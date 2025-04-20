import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ConfiguratorState } from "../../configurator/types";
import { ensureClientPhotosBucketExists } from "@/utils/createBucket";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  additionalNotes: string;
  wantsSiteVisit: boolean;
  wantsShowroomVisit: boolean;
  addressStreet: string;
  addressCity: string;
}

interface UseAppointmentDialogProps {
  configState: ConfiguratorState;
  price: number;
  onOpenChange: (open: boolean) => void;
  wantsToBuyTiles?: boolean;
  tilePricePerSqm?: number | null;
  squareMetersWithCuttingLoss?: number;
  tileCost?: number;
}

interface SubmissionResult {
  success: boolean;
  error?: string;
  details?: any;
}

export function useAppointmentDialog({
  configState,
  price,
  onOpenChange,
  wantsToBuyTiles = false,
  tilePricePerSqm = null,
  squareMetersWithCuttingLoss = 0,
  tileCost = 0
}: UseAppointmentDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [formData, setFormData] = useState<FormValues>({
    name: configState.name || "",
    email: configState.email || "",
    phone: configState.phone || "",
    additionalNotes: configState.additionalNotes || "",
    wantsSiteVisit: configState.wantsSiteVisit || false,
    wantsShowroomVisit: configState.wantsShowroomVisit || false,
    addressStreet: configState.addressStreet || "",
    addressCity: configState.addressCity || ""
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Bestand te groot",
          description: "De afbeelding mag maximaal 5MB zijn",
          variant: "destructive"
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Ongeldig bestandsformaat",
          description: "Upload alleen afbeeldingen (JPG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }
      
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const clearImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast({
        title: "E-mail is verplicht",
        description: "Vul a.u.b. uw e-mailadres in om door te gaan",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.wantsSiteVisit && (!formData.addressStreet || !formData.addressCity)) {
      toast({
        title: "Adres is verplicht",
        description: "Vul a.u.b. uw adres in voor het plaatsbezoek",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await ensureClientPhotosBucketExists();
      
      let imageUrl = null;
      if (imageFile) {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${imageFile.name.split('.').pop()}`;
        const filePath = `configurator/${fileName}`;
        
        try {
          const { error: uploadError } = await supabase.storage
            .from('customer-uploads')
            .upload(filePath, imageFile);
            
          if (uploadError) throw uploadError;
          
          const { data: publicUrlData } = supabase.storage
            .from('customer-uploads')
            .getPublicUrl(filePath);
            
          imageUrl = publicUrlData.publicUrl;
          console.log("Image uploaded successfully:", imageUrl);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          toast({
            title: "Waarschuwing",
            description: "Er was een probleem met het uploaden van de afbeelding, maar we verwerken uw aanvraag zonder de afbeelding",
            variant: "destructive"
          });
        }
      }
      
      const { data: configData, error: configError } = await supabase
        .from('configurations')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          project_type: configState.projectType,
          square_meters: configState.squareMeters,
          floor_type: configState.floorType,
          tile_size: configState.tileSize,
          need_plinths: configState.needsPlinths,
          wall_type: configState.wallType,
          wall_tile_size: configState.wallTileSize,
          bathroom_options: configState.bathroomOptions,
          bathroom_tile_size: configState.bathroomTileSize,
          other_description: configState.otherDescription,
          needs_chape: configState.needsChape,
          needs_electrician: configState.needsElectrician,
          additional_notes: formData.additionalNotes,
          wants_site_visit: formData.wantsSiteVisit,
          wants_showroom_visit: formData.wantsShowroomVisit,
          address_street: formData.addressStreet,
          address_city: formData.addressCity,
          shower_nis: configState.showerNis,
          shower_nis_size: configState.showerNisSize,
          shower_nis_custom_size: configState.showerNisCustomSize,
          full_bathroom_renovation: configState.fullBathroomRenovation,
          total_price: price,
          lead_score: 60,
          laatste_contactmoment: new Date().toISOString(),
          project_image_url: imageUrl,
          wants_to_buy_tiles: wantsToBuyTiles,
          tile_price_per_sqm: tilePricePerSqm,
          tile_cost: tileCost
        }]);
        
      if (configError) {
        throw configError;
      }
      
      const emailResponse = await supabase.functions.invoke("send-confirmation", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          projectType: configState.projectType,
          squareMeters: configState.squareMeters,
          floorType: configState.floorType,
          tileSize: configState.tileSize,
          needsPlinths: configState.needsPlinths,
          wallType: configState.wallType,
          wallTileSize: configState.wallTileSize,
          bathroomOptions: configState.bathroomOptions,
          bathroomTileSize: configState.bathroomTileSize,
          otherDescription: configState.otherDescription,
          needsChape: configState.needsChape,
          needsElectrician: configState.needsElectrician,
          additionalNotes: formData.additionalNotes,
          wantsSiteVisit: formData.wantsSiteVisit,
          wantsShowroomVisit: formData.wantsShowroomVisit,
          addressStreet: formData.addressStreet,
          addressCity: formData.addressCity,
          showerNis: configState.showerNis,
          showerNisSize: configState.showerNisSize,
          showerNisCustomSize: configState.showerNisCustomSize,
          fullBathroomRenovation: configState.fullBathroomRenovation,
          totalPrice: price,
          wantsToBuyTiles,
          tilePricePerSqm,
          squareMetersWithCuttingLoss,
          tileCost,
          imageUrl
        }
      });
      
      console.log("Email response:", emailResponse);
      
      if (emailResponse.error) {
        console.error("Error from edge function:", emailResponse.error);
        throw new Error("Fout bij verzenden van bevestigingsmail");
      }
      
      setSubmissionResult({
        success: true
      });
      
      const updatedState = {
        ...configState,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        additionalNotes: formData.additionalNotes,
        wantsSiteVisit: formData.wantsSiteVisit,
        wantsShowroomVisit: formData.wantsShowroomVisit,
        addressStreet: formData.addressStreet,
        addressCity: formData.addressCity
      };
      
      setTimeout(() => {
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
        
        setTimeout(() => {
          onOpenChange(false);
        }, 2000);
      }, 1000);
      
    } catch (error: any) {
      console.error("Submission error:", error);
      
      setSubmissionResult({
        success: false,
        error: error.message || "Er is een fout opgetreden bij het verwerken van uw aanvraag",
        details: error
      });
      
      toast({
        title: "Fout",
        description: error.message || "Er is een fout opgetreden bij het verwerken van uw aanvraag",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    formData,
    handleFormChange,
    handleSubmit,
    isSubmitting,
    submissionResult,
    imageFile,
    imagePreview,
    handleImageUpload,
    clearImage
  };
}
