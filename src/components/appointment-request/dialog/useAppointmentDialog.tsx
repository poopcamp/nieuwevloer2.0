
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendConfirmationEmail } from "@/utils/supabaseHelpers";
import { ConfiguratorState } from "../../configurator/types";

export interface FormValues {
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

export const useAppointmentDialog = ({
  configState,
  price,
  onOpenChange,
  wantsToBuyTiles = false,
  tilePricePerSqm = null,
  squareMetersWithCuttingLoss = 0,
  tileCost = 0
}: UseAppointmentDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean } | null>(null);
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
      console.log("Submitting appointment request to Supabase");
      
      const prepareLeadData = async () => {
        const configData: any = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          project_type: configState.projectType,
          floor_type: configState.floorType,
          tile_size: configState.tileSize,
          need_plinths: configState.needsPlinths,
          square_meters: configState.squareMeters,
          wall_type: configState.wallType,
          wall_tile_size: configState.wallTileSize,
          other_description: configState.otherDescription,
          needs_chape: configState.needsChape,
          needs_electrician: configState.needsElectrician,
          additional_notes: formData.additionalNotes,
          wants_showroom_visit: formData.wantsShowroomVisit,
          wants_site_visit: formData.wantsSiteVisit,
          bathroom_options: configState.bathroomOptions,
          bathroom_tile_size: configState.bathroomTileSize,
          full_bathroom_renovation: configState.fullBathroomRenovation,
          shower_nis: configState.showerNis,
          shower_nis_size: configState.showerNisSize,
          shower_nis_custom_size: configState.showerNisCustomSize,
          lead_score: 80,
          total_price: price,
          wants_to_buy_tiles: wantsToBuyTiles,
          tile_price_per_sqm: tilePricePerSqm,
          tile_cost: tileCost
        };
        
        if (formData.wantsSiteVisit) {
          configData.address_street = formData.addressStreet;
          configData.address_city = formData.addressCity;
        }
        
        if (configState.selectedInspirationStyle) {
          configData.selected_inspiration_style_id = parseInt(String(configState.selectedInspirationStyle.id), 10);
          configData.selected_inspiration_style_title = configState.selectedInspirationStyle.title;
        }
        
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
          }
        }
        
        if (imageUrl) {
          configData.project_image_url = imageUrl;
        }
        
        console.log("Sending data to Supabase:", configData);
        
        const insertResult = await supabase.from("configurations").insert(configData);

        console.log("Supabase insert response:", insertResult);
        
        if (insertResult.error) {
          console.error("Supabase insert error:", insertResult.error);
          throw insertResult.error;
        }

        console.log("Successfully inserted data, now sending confirmation email");
        
        await sendConfirmationEmail({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          projectType: configState.projectType || "vloer",
          totalPrice: price,
          squareMeters: configState.squareMeters || 0,
          tileSize: configState.tileSize || configState.wallTileSize || configState.bathroomTileSize || "",
          additionalNotes: formData.additionalNotes,
          wantsSiteVisit: formData.wantsSiteVisit,
          wantsShowroomVisit: formData.wantsShowroomVisit,
          addressStreet: formData.wantsSiteVisit ? formData.addressStreet : undefined,
          addressCity: formData.wantsSiteVisit ? formData.addressCity : undefined,
          wantsToBuyTiles: wantsToBuyTiles,
          tilePricePerSqm: tilePricePerSqm,
          squareMetersWithCuttingLoss: squareMetersWithCuttingLoss,
          tileCost: tileCost,
          imageUrl: imageUrl || undefined,
          selectedInspirationStyle: configState.selectedInspirationStyle?.id,
          selectedInspirationStyleTitle: configState.selectedInspirationStyle?.title
        });

        setSubmissionResult({ success: true });
        toast({
          title: "Afspraak aangevraagd!",
          description: "We hebben uw aanvraag ontvangen en nemen spoedig contact met u op.",
          variant: "success",
        });
        
        setTimeout(() => {
          onOpenChange(false);
          setTimeout(() => {
            setSubmissionResult(null);
          }, 300);
        }, 2000);
      };

      await prepareLeadData();
    } catch (error: any) {
      console.error("Error submitting appointment request:", error);
      toast({
        title: "Er is een fout opgetreden",
        description: error.message || "Probeer het later opnieuw",
        variant: "destructive",
      });
      setSubmissionResult({ success: false });
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
