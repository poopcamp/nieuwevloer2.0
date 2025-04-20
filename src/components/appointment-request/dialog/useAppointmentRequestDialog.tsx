
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendEmailRequest } from "@/utils/email/emailService";
import { saveConfiguration } from "@/utils/configurationHelpers";
import { ConfigurationData } from "@/types/configuration";
import { EMAIL_TYPES } from "@/utils/email/config";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  additionalNotes: string;
  wantsSiteVisit: boolean;
  wantsShowroomVisit: boolean;
  addressStreet: string;
  addressCity: string;
  dynamicFields?: Record<string, any>;
}

interface UseAppointmentRequestDialogProps {
  tileFormat: string;
  squareMeters: number;
  calculatedPrice: number | null;
  onOpenChange: (open: boolean) => void;
  wantsToBuyTiles?: boolean;
  tilePricePerSqm?: number | null;
  squareMetersWithCuttingLoss?: number;
  tileCost?: number;
}

export const useAppointmentRequestDialog = ({
  tileFormat,
  squareMeters,
  calculatedPrice,
  onOpenChange,
  wantsToBuyTiles = false,
  tilePricePerSqm = null,
  squareMetersWithCuttingLoss = 0,
  tileCost = 0
}: UseAppointmentRequestDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormValues>({
    name: "",
    email: "",
    phone: "",
    additionalNotes: "",
    wantsSiteVisit: false,
    wantsShowroomVisit: false,
    addressStreet: "",
    addressCity: ""
  });
  const [isSuccess, setIsSuccess] = useState(false);
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
      // Upload the image first if available
      let imageUrl = null;
      if (imageFile) {
        try {
          const fileName = `${Date.now()}-${imageFile.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('clientphotos')
            .upload(fileName, imageFile);
          
          if (uploadError) {
            console.error("[useAppointmentRequestDialog] Error uploading image:", uploadError);
            throw uploadError;
          }
          
          if (uploadData) {
            const { data: publicUrlData } = supabase.storage
              .from('clientphotos')
              .getPublicUrl(fileName);
              
            imageUrl = publicUrlData.publicUrl;
            console.log("[useAppointmentRequestDialog] Successfully uploaded image:", imageUrl);
          }
        } catch (uploadErr: any) {
          console.error("[useAppointmentRequestDialog] Failed to upload image:", uploadErr);
          toast({
            title: "Fout bij uploaden afbeelding",
            description: uploadErr.message || "De afbeelding kon niet worden geüpload",
            variant: "destructive",
          });
          // Continue without image
        }
      }
      
      // Prepare the data for Supabase insert 
      const configData: ConfigurationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        project_type: "quick_calculator",
        square_meters: squareMeters,
        tile_size: tileFormat,
        additional_notes: formData.additionalNotes,
        wants_site_visit: formData.wantsSiteVisit,
        wants_showroom_visit: formData.wantsShowroomVisit,
        lead_score: 70,
        laatste_contactmoment: new Date().toISOString(),
        total_price: calculatedPrice || 0,
        wants_to_buy_tiles: wantsToBuyTiles,
        tile_price_per_sqm: tilePricePerSqm,
        tile_cost: tileCost
      };
      
      // Add address if site visit is requested
      if (formData.wantsSiteVisit) {
        configData.address_street = formData.addressStreet;
        configData.address_city = formData.addressCity;
      }
      
      // Add image URL if we have one
      if (imageUrl) {
        configData.project_image_url = imageUrl;
      }
      
      console.log("[useAppointmentRequestDialog] Configuration data being saved:", configData);
      
      // Save to Supabase
      const result = await saveConfiguration(configData);
      if (!result.success) throw new Error(result.error);

      console.log("[useAppointmentRequestDialog] Configuration saved successfully, now sending email");

      // Send email using the service
      const emailPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        projectType: "quick_calculator",
        totalPrice: calculatedPrice || 0,
        squareMeters: squareMeters,
        tileSize: tileFormat,
        additionalNotes: formData.additionalNotes,
        wantsSiteVisit: formData.wantsSiteVisit,
        wantsShowroomVisit: formData.wantsShowroomVisit,
        addressStreet: formData.wantsSiteVisit ? formData.addressStreet : undefined,
        addressCity: formData.wantsSiteVisit ? formData.addressCity : undefined,
        wantsToBuyTiles,
        tilePricePerSqm,
        squareMetersWithCuttingLoss,
        tileCost,
        imageUrl
      };

      console.log("[useAppointmentRequestDialog] Sending email with payload:", JSON.stringify(emailPayload, null, 2));
      
      const emailResponse = await sendEmailRequest(emailPayload);
      
      console.log("[useAppointmentRequestDialog] Email service response:", emailResponse);
      
      if (!emailResponse.success) {
        console.warn("[useAppointmentRequestDialog] Email sending failed:", emailResponse.error);
        // We continue even if email fails since data is saved
      }

      // Show success message
      setIsSuccess(true);
      toast({
        title: "Offerte aanvraag verzonden!",
        description: "We hebben uw gegevens ontvangen en nemen spoedig contact met u op.",
        variant: "success",
      });

      // Close dialog after a short delay
      setTimeout(() => {
        onOpenChange(false);
        // Reset form and success state after dialog is closed
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            phone: "",
            additionalNotes: "",
            wantsSiteVisit: false,
            wantsShowroomVisit: false,
            addressStreet: "",
            addressCity: ""
          });
          setIsSuccess(false);
          clearImage();
        }, 300);
      }, 2000);

    } catch (error: any) {
      console.error("[useAppointmentRequestDialog] Error submitting appointment request:", error);
      toast({
        title: "Er is een fout opgetreden",
        description: error.message || "Probeer het later opnieuw",
        variant: "destructive",
      });
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    formData,
    handleFormChange,
    handleSubmit,
    isSubmitting,
    isSuccess,
    imageFile,
    imagePreview,
    handleImageUpload,
    clearImage
  };
};
