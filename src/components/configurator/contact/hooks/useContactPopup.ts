
import { useState } from 'react';
import { ConfiguratorState } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculatePrice } from '@/utils/configuratorPricing';
import { sendEmailRequest } from '@/utils/email';
import { ensureClientPhotosBucketExists } from '@/utils/createBucket';

interface UseContactPopupProps {
  initialData: ConfiguratorState;
  onSuccess: (data: Partial<ConfiguratorState>) => void;
  onClose?: () => void;
}

export const useContactPopup = ({ initialData, onSuccess, onClose }: UseContactPopupProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    addressStreet: initialData.addressStreet || '',
    addressCity: initialData.addressCity || '',
    additionalNotes: initialData.additionalNotes || '',
    wantsShowroomVisit: initialData.wantsShowroomVisit || false,
    wantsSiteVisit: initialData.wantsSiteVisit || false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSubscribed, setEmailSubscribed] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (field: string, value: string | boolean) => {
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
    if (imageFile && imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
      setImageFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ensure storage bucket exists
      await ensureClientPhotosBucketExists();
      
      // Calculate price using the utility function
      const totalPrice = parseFloat(calculatePrice(initialData));
      
      let imageUrl = null;
      // Upload image if available
      if (imageFile) {
        try {
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${imageFile.name}`;
          const filePath = `configurator/${fileName}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('customer-uploads')
            .upload(filePath, imageFile);
            
          if (uploadError) throw uploadError;
          
          const { data: publicUrlData } = supabase.storage
            .from('customer-uploads')
            .getPublicUrl(filePath);
            
          imageUrl = publicUrlData.publicUrl;
          console.log("Image uploaded successfully:", imageUrl);
        } catch (uploadErr) {
          console.error("Error uploading image:", uploadErr);
          // Continue without image if upload fails
        }
      }

      // Save configuration to Supabase
      await saveConfigurationToSupabase(formData, initialData);
      
      // Find human-readable values for selected options
      // For wall type, we need to convert from UUID to human-readable value
      let wallTypeName = initialData.wallType;
      if (initialData.projectType === 'keukenwand' && initialData.wallType) {
        try {
          // Attempt to fetch the human-readable wall type name from the database
          const { data: wallTypeData } = await supabase
            .from('wall_types')
            .select('name')
            .eq('id', initialData.wallType)
            .single();
            
          if (wallTypeData && wallTypeData.name) {
            wallTypeName = wallTypeData.name;
          }
        } catch (error) {
          console.error("Error fetching wall type name:", error);
        }
      }
      
      // Prepare email data
      const emailData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        projectType: initialData.projectType,
        squareMeters: initialData.squareMeters,
        floorType: initialData.floorType,
        tileSize: initialData.tileSize,
        needsPlinths: initialData.needsPlinths,
        wallType: wallTypeName, // Use the human-readable wall type name
        wallTileSize: initialData.wallTileSize, // Make sure wall tile size is included
        bathroomOptions: initialData.bathroomOptions,
        bathroomTileSize: initialData.bathroomTileSize,
        otherDescription: initialData.otherDescription,
        needsChape: initialData.needsChape,
        needsElectrician: initialData.needsElectrician,
        additionalNotes: formData.additionalNotes,
        wantsSiteVisit: formData.wantsSiteVisit,
        wantsShowroomVisit: formData.wantsShowroomVisit,
        addressStreet: formData.addressStreet,
        addressCity: formData.addressCity,
        showerNis: initialData.showerNis,
        showerNisSize: initialData.showerNisSize,
        showerNisCustomSize: initialData.showerNisCustomSize,
        fullBathroomRenovation: initialData.fullBathroomRenovation,
        totalPrice: totalPrice,
        imageUrl: imageUrl,
        hasHolidayDiscount: initialData.hasHolidayDiscount,
        tilePricePerSqm: initialData.tilePricePerSqm,
        wantsToBuyTiles: initialData.wantsToBuyTiles
      };
      
      console.log("Sending email data to edge function:", JSON.stringify(emailData, null, 2));
      
      // Send email via the send-confirmation edge function
      const emailResult = await sendEmailRequest(emailData);
      
      if (!emailResult.success) {
        console.error("Error sending confirmation email:", emailResult.error);
        console.log("Email result details:", emailResult.details);
        // Continue with success flow even if email fails to avoid blocking user
      } else {
        console.log("Email sent successfully:", emailResult);
      }

      // Update submission state
      toast({
        title: "Aanvraag verzonden!",
        description: "We nemen zo snel mogelijk contact met u op.",
      });

      // Call onSuccess function with updated form data
      onSuccess({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        addressStreet: formData.addressStreet,
        addressCity: formData.addressCity,
        additionalNotes: formData.additionalNotes,
        wantsShowroomVisit: formData.wantsShowroomVisit,
        wantsSiteVisit: formData.wantsSiteVisit,
      });
      
      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      console.error("Error in contact popup submission:", error);
      toast({
        title: "Er is een fout opgetreden",
        description: error.message || "Probeer het later opnieuw",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    emailSubscribed,
    imageFile,
    imagePreview,
    setEmailSubscribed,
    handleChange,
    handleSubmit,
    handleImageUpload,
    clearImage
  };
};

export const saveConfigurationToSupabase = async (formData: any, state: ConfiguratorState) => {
  try {
    // Calculate price if needed
    const totalPrice = parseFloat(calculatePrice(state));
    
    // Prepare data for Supabase
    const dbData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      project_type: state.projectType,
      square_meters: state.squareMeters,
      floor_type: state.floorType,
      tile_size: state.tileSize,
      need_plinths: state.needsPlinths,
      wall_type: state.wallType,
      wall_tile_size: state.wallTileSize,
      bathroom_options: state.bathroomOptions,
      bathroom_tile_size: state.bathroomTileSize,
      other_description: state.otherDescription,
      needs_chape: state.needsChape,
      needs_electrician: state.needsElectrician,
      additional_notes: formData.additionalNotes,
      wants_showroom_visit: formData.wantsShowroomVisit,
      wants_site_visit: formData.wantsSiteVisit,
      address_street: formData.addressStreet,
      address_city: formData.addressCity,
      shower_nis: state.showerNis,
      shower_nis_size: state.showerNisSize,
      shower_nis_custom_size: state.showerNisCustomSize,
      full_bathroom_renovation: state.fullBathroomRenovation,
      opvolging_gestopt: false,
      lead_score: 60,
      laatste_contactmoment: new Date().toISOString(),
      total_price: totalPrice,
    };

    const { data, error } = await supabase
      .from('configurations')
      .insert([dbData]);

    if (error) {
      console.error("Error saving configuration to Supabase:", error);
      throw new Error("Failed to save configuration. Please try again.");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error saving configuration:", error);
    throw new Error("Unexpected error occurred. Please try again.");
  }
};
