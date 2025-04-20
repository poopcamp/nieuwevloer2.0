import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ConfiguratorState } from "../../types";

interface UseConfiguratorAppointmentDialogProps {
  configState: ConfiguratorState;
  price: number;
  onOpenChange: (open: boolean) => void;
  wantsToBuyTiles?: boolean;
  tilePricePerSqm?: number | null;
  squareMetersWithCuttingLoss?: number;
  tileCost?: number;
}

export interface FormValues {
  name: string;
  email: string;
  phone: string;
  notes: string;
  wantsSiteVisit: boolean;
  wantsShowroomVisit: boolean;
  addressStreet: string;
  addressCity: string;
  receivesNewsletter: boolean;
}

interface SubmissionResult {
  success: boolean;
  error?: string;
}

export const useConfiguratorAppointmentDialog = ({
  configState,
  price,
  onOpenChange,
  wantsToBuyTiles = false,
  tilePricePerSqm = null,
  squareMetersWithCuttingLoss = 0,
  tileCost = 0
}: UseConfiguratorAppointmentDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormValues>({
    name: configState.name || "",
    email: configState.email || "",
    phone: configState.phone || "",
    notes: configState.additionalNotes || "",
    wantsSiteVisit: configState.wantsSiteVisit || false,
    wantsShowroomVisit: configState.wantsShowroomVisit || false,
    addressStreet: configState.addressStreet || "",
    addressCity: configState.addressCity || "",
    receivesNewsletter: true
  });
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
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
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast({
        title: "E-mailadres is verplicht",
        description: "Vul a.u.b. uw e-mailadres in",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        try {
          const fileName = `${Date.now()}-${imageFile.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('clientphotos')
            .upload(fileName, imageFile);
          
          if (uploadError) {
            console.error("Error uploading image:", uploadError);
            throw uploadError;
          }
          
          if (uploadData) {
            const { data: publicUrlData } = supabase.storage
              .from('clientphotos')
              .getPublicUrl(fileName);
              
            imageUrl = publicUrlData.publicUrl;
          }
        } catch (uploadErr: any) {
          console.error("Failed to upload image:", uploadErr);
          toast({
            title: "Fout bij uploaden afbeelding",
            description: uploadErr.message || "De afbeelding kon niet worden geüpload",
            variant: "destructive",
          });
          // Continue without image
        }
      }
      
      const tileFormat = configState.projectType === 'vloer' 
        ? { name: configState.tileSize || 'Niet geselecteerd', dimensions: configState.tileSize || 'Niet geselecteerd' }
        : configState.projectType === 'badkamer'
          ? { name: configState.bathroomTileSize || 'Niet geselecteerd', dimensions: configState.bathroomTileSize || 'Niet geselecteerd' }
          : { name: 'Niet geselecteerd', dimensions: 'Niet geselecteerd' };
      
      const projectData = {
        projectId: configState.projectType || "vloer",
        projectName: configState.projectType === 'vloer' 
          ? "Vloerbetegeling" 
          : configState.projectType === 'badkamer' 
            ? "Badkamerrenovatie" 
            : configState.projectType || "Tegelproject",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        squareMeters: configState.squareMeters || 0,
        selectedTileFormat: {
          id: "dynamic",
          name: tileFormat.name,
          dimensions: tileFormat.dimensions
        },
        notes: formData.notes,
        projectImage: imageUrl,
        calculatedPrice: price,
        wantsSiteVisit: formData.wantsSiteVisit,
        wantsShowroomVisit: formData.wantsShowroomVisit,
        questionResponses: {
          ...(configState.needsChape ? { "Chape nodig": "Ja" } : {}),
          ...(configState.needsElectrician ? { "Elektricien nodig": "Ja" } : {}),
          ...(configState.showerNis ? { "Douche nis": "Ja", "Formaat douche nis": configState.showerNisSize || "Standaard" } : {}),
          ...(configState.fullBathroomRenovation ? { "Complete badkamerrenovatie": "Ja" } : {})
        }
      };

      console.log("Sending data to edge function:", projectData);
      const { data, error } = await supabase.functions.invoke("send-extended-calculator-confirmation", {
        body: projectData
      });

      console.log("Edge function response:", data, error);
      
      if (error) throw new Error(error.message);
      
      if (!data.success) throw new Error(data.message || "Failed to send confirmation emails");

      try {
        const configurationData = {
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
          additional_notes: formData.notes,
          wants_showroom_visit: formData.wantsShowroomVisit,
          wants_site_visit: formData.wantsSiteVisit,
          address_street: formData.wantsSiteVisit ? formData.addressStreet : null,
          address_city: formData.wantsSiteVisit ? formData.addressCity : null,
          shower_nis: configState.showerNis,
          shower_nis_size: configState.showerNisSize,
          shower_nis_custom_size: configState.showerNisCustomSize,
          full_bathroom_renovation: configState.fullBathroomRenovation,
          project_image_url: imageUrl,
          lead_score: 60,
          laatste_contactmoment: new Date().toISOString(),
          total_price: price,
          wants_to_buy_tiles: wantsToBuyTiles,
          tile_price_per_sqm: tilePricePerSqm,
          tile_cost: tileCost
        };

        await supabase
          .from('configurations')
          .insert([configurationData]);
      } catch (dbError) {
        console.error("Error saving to database (continuing):", dbError);
      }

      setSubmissionResult({ success: true });
      toast({
        title: "Bedankt voor uw aanvraag!",
        description: "We hebben uw gegevens ontvangen en nemen zo snel mogelijk contact met u op.",
        variant: "success",
      });

    } catch (error: any) {
      console.error("Error submitting appointment request:", error);
      toast({
        title: "Er is een fout opgetreden",
        description: error.message || "Probeer het later opnieuw",
        variant: "destructive",
      });
      setSubmissionResult({ 
        success: false, 
        error: error.message || "Er is een onbekende fout opgetreden"
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
};
