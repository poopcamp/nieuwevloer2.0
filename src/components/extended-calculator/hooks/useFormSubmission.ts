
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ExtendedCalculatorState, PriceBreakdown } from '../types';

export const useFormSubmission = (
  state: ExtendedCalculatorState,
  setState: React.Dispatch<React.SetStateAction<ExtendedCalculatorState>>,
  calculatePriceBreakdown: () => PriceBreakdown
) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      if (!state.selectedProject) {
        throw new Error("Selecteer eerst een project.");
      }
      
      if (!state.customerName || !state.customerEmail || !state.customerPhone) {
        throw new Error("Vul alle verplichte contactinformatie in.");
      }

      // Validate address fields if site visit is selected
      if (state.wantsSiteVisit && (!state.addressStreet || !state.addressCity)) {
        throw new Error("Vul a.u.b. het volledige adres in voor het plaatsbezoek.");
      }
      
      const priceBreakdown = calculatePriceBreakdown();
      
      const selectedOptionsData = state.selectedOptions.map(option => ({
        id: option.id,
        name: option.name,
        price: option.price_addition,
        internal_cost: option.internal_cost
      }));
      
      let imageUrl = state.uploadedImageUrl;
      if (state.uploadedImage && !state.uploadedImageUrl) {
        const file = state.uploadedImage;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `extended-calculator/${fileName}`;
        
        try {
          const { error: uploadError, data } = await supabase.storage
            .from('customer-uploads')
            .upload(filePath, file);
            
          if (uploadError) throw uploadError;
          
          const { data: publicUrlData } = supabase.storage
            .from('customer-uploads')
            .getPublicUrl(filePath);
            
          imageUrl = publicUrlData.publicUrl;
        } catch (uploadErr) {
          console.error("Error uploading image:", uploadErr);
          // Continue without image if upload fails
        }
      }
      
      // Log the complete data being sent to the edge function
      console.log("Preparing to send data to edge function:", {
        projectId: state.selectedProject.id,
        projectName: state.selectedProject.name,
        name: state.customerName,
        email: state.customerEmail,
        phone: state.customerPhone,
        squareMeters: state.squareMeters,
        selectedTileFormat: state.selectedTileFormat,
        selectedTileStyle: state.selectedTileStyle,
        selectedOptions: selectedOptionsData,
        questionResponses: state.questionResponses,
        notes: state.notes,
        projectImage: imageUrl,
        calculatedPrice: priceBreakdown.totalCustomerPrice,
        wantsSiteVisit: state.wantsSiteVisit,
        wantsShowroomVisit: state.wantsShowroomVisit,
        addressStreet: state.addressStreet,
        addressCity: state.addressCity
      });

      const emailData = {
        projectId: state.selectedProject.id,
        projectName: state.selectedProject.name,
        name: state.customerName,
        email: state.customerEmail,
        phone: state.customerPhone,
        squareMeters: state.squareMeters,
        selectedTileFormat: state.selectedTileFormat ? {
          id: state.selectedTileFormat.id,
          name: state.selectedTileFormat.name,
          dimensions: state.selectedTileFormat.dimensions
        } : undefined,
        selectedTileStyle: state.selectedTileStyle ? {
          id: state.selectedTileStyle.id,
          name: state.selectedTileStyle.name
        } : undefined,
        selectedOptions: selectedOptionsData,
        questionResponses: state.questionResponses,
        notes: state.notes,
        projectImage: imageUrl,
        calculatedPrice: priceBreakdown.totalCustomerPrice,
        wantsSiteVisit: state.wantsSiteVisit,
        wantsShowroomVisit: state.wantsShowroomVisit,
        addressStreet: state.addressStreet,
        addressCity: state.addressCity
      };
      
      // Log the final data being sent to ensure it includes the necessary fields
      console.log("Versturen van gegevens naar edge functie:", JSON.stringify(emailData, null, 2));
      
      // Now let's check which edge function we're invoking
      console.log("Invoking edge function: send-extended-calculator-confirmation");
      
      // Send a more complete payload to the edge function - removing the timeout property
      const { data: emailResult, error: emailError } = await supabase.functions.invoke(
        "send-extended-calculator-confirmation",
        { 
          body: emailData
        }
      );

      if (emailError) {
        console.error("Fout van edge functie:", emailError);
        throw new Error(`Er is een fout opgetreden bij het verzenden van de e-mails: ${emailError.message || "Onbekende fout"}`);
      }
      
      console.log("Edge functie resultaat:", emailResult);
      
      if (!emailResult || !emailResult.success) {
        console.error("E-mail verzenden mislukt:", emailResult);
        throw new Error(emailResult?.message || emailResult?.error || "Er is een fout opgetreden bij het verzenden van de e-mails.");
      }
      
      console.log("E-mail succesvol verzonden:", emailResult);
      
      // Save the submission to the database regardless of email success
      try {
        const submissionData = {
          project_id: state.selectedProject.id,
          customer_name: state.customerName,
          customer_email: state.customerEmail,
          customer_phone: state.customerPhone,
          square_meters: state.squareMeters,
          selected_tile_style_id: state.selectedTileStyle?.id,
          selected_tile_format_id: state.selectedTileFormat?.id,
          selected_options: selectedOptionsData,
          question_responses: state.questionResponses,
          calculated_price: priceBreakdown.totalCustomerPrice,
          internal_cost: priceBreakdown.internalTotalCost,
          notes: state.notes,
          project_image_url: imageUrl,
          wants_site_visit: state.wantsSiteVisit,
          wants_showroom_visit: state.wantsShowroomVisit,
          receives_newsletter: state.receivesNewsletter,
          lead_score: 70,
          address_street: state.addressStreet,
          address_city: state.addressCity
        };

        console.log("Saving submission to database:", submissionData);

        const { error: dbError } = await supabase
          .from('extended_calculator_submissions')
          .insert([submissionData]);
          
        if (dbError) {
          console.error("Fout bij opslaan van inzending in database:", dbError);
        } else {
          console.log("Submission successfully saved to database");
        }
      } catch (dbError) {
        console.error("Exceptie bij opslaan in database:", dbError);
      }
      
      toast({
        title: "Offerte aanvraag geslaagd!",
        description: "We hebben uw gegevens ontvangen en nemen spoedig contact met u op.",
        variant: "success",
      });
      
      setSubmissionSuccess(true);
      
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Fout",
        description: `Het versturen is mislukt: ${error.message}`,
      });
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setState({
      selectedProject: state.selectedProject,
      squareMeters: 10,
      selectedTileStyle: null,
      selectedTileFormat: null,
      selectedOptions: [],
      questionResponses: {},
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      notes: '',
      wantsSiteVisit: false,
      wantsShowroomVisit: false,
      receivesNewsletter: false,
      uploadedImage: null,
      uploadedImageUrl: null,
      addressStreet: '',
      addressCity: ''
    });
    setSubmissionSuccess(false);
  };

  return {
    submitting,
    error,
    submissionSuccess,
    handleSubmit,
    resetForm
  };
};
