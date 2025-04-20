
import { useState } from 'react';
import { ConfiguratorState } from '../../types';
import { saveConfiguration, sendConfirmationEmail } from '@/utils/supabaseHelpers';
import { useToast } from '@/hooks/use-toast';
import { calculatePrice } from '@/utils/configuratorPricing';

interface UseContactFormProps {
  initialData: ConfiguratorState;
  onSubmit: (data: Partial<ConfiguratorState>) => void;
}

// Define extended state if needed to track submission status separately
interface ExtendedFormState {
  submissionComplete?: boolean;
}

export const useContactForm = ({ initialData, onSubmit }: UseContactFormProps) => {
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
  const [submissionComplete, setSubmissionComplete] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Onvolledige gegevens",
        description: "Vul a.u.b. uw naam en e-mailadres in",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate price using the utility function
      const totalPrice = parseFloat(calculatePrice(initialData));
      
      // Prepare data for Supabase
      const configData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        project_type: initialData.projectType,
        square_meters: initialData.squareMeters,
        floor_type: initialData.floorType,
        tile_size: initialData.tileSize,
        need_plinths: initialData.needsPlinths,
        wall_type: initialData.wallType,
        wall_tile_size: initialData.wallTileSize,
        bathroom_options: initialData.bathroomOptions,
        bathroom_tile_size: initialData.bathroomTileSize,
        other_description: initialData.otherDescription,
        needs_chape: initialData.needsChape,
        needs_electrician: initialData.needsElectrician,
        additional_notes: formData.additionalNotes,
        wants_showroom_visit: formData.wantsShowroomVisit,
        wants_site_visit: formData.wantsSiteVisit,
        address_street: formData.addressStreet,
        address_city: formData.addressCity,
        shower_nis: initialData.showerNis,
        shower_nis_size: initialData.showerNisSize,
        shower_nis_custom_size: initialData.showerNisCustomSize,
        full_bathroom_renovation: initialData.fullBathroomRenovation,
        opvolging_gestopt: false,
        lead_score: 60,
        laatste_contactmoment: new Date().toISOString(),
        total_price: totalPrice,
      };
      
      // Save to Supabase
      const saveResult = await saveConfiguration(configData);
      
      if (!saveResult.success) {
        throw new Error(saveResult.error || "Fout bij opslaan van configuratie");
      }
      
      // Send confirmation email
      await sendConfirmationEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        projectType: initialData.projectType,
        totalPrice: totalPrice,
        wantsSiteVisit: formData.wantsSiteVisit,
        addressStreet: formData.addressStreet,
        addressCity: formData.addressCity,
        additionalNotes: formData.additionalNotes,
        showerNis: initialData.showerNis,
        showerNisSize: initialData.showerNisSize,
        showerNisCustomSize: initialData.showerNisCustomSize,
        fullBathroomRenovation: initialData.fullBathroomRenovation,
        squareMeters: initialData.squareMeters,
        floorType: initialData.floorType,
        tileSize: initialData.tileSize,
        wallType: initialData.wallType,
        needsChape: initialData.needsChape,
        needsElectrician: initialData.needsElectrician,
      });
      
      // Update submission state
      setSubmissionComplete(true);
      
      // Call onSubmit function with updated form data
      onSubmit({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        addressStreet: formData.addressStreet,
        addressCity: formData.addressCity,
        additionalNotes: formData.additionalNotes,
        wantsShowroomVisit: formData.wantsShowroomVisit,
        wantsSiteVisit: formData.wantsSiteVisit,
      });
      
    } catch (error: any) {
      console.error("Error in contact form submission:", error);
      toast({
        title: "Er is een fout opgetreden",
        description: error.message || "Probeer het later opnieuw",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    emailSubscribed,
    setEmailSubscribed,
    handleChange,
    handleSubmit,
    submissionComplete
  };
};
