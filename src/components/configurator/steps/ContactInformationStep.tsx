
import React, { useEffect, useState } from "react";
import { ConfiguratorState } from "../types";
import { useToast } from "@/hooks/use-toast";
import { Gift } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ContactDialog from "../ContactDialog";
import SubmitButton from "./contact/SubmitButton";
import { isHoliday } from "@/utils/holidayHelper";

interface ContactInformationStepProps {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
}

const ContactInformationStep = ({ state, updateState }: ContactInformationStepProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);

  // Check for holiday discount
  const today = new Date();
  const holidayInfo = isHoliday(today);

  useEffect(() => {
    // If we have a holiday discount, update state
    if (holidayInfo.isHoliday && !state.hasHolidayDiscount) {
      updateState({ hasHolidayDiscount: true });
    }
  }, [holidayInfo.isHoliday, state.hasHolidayDiscount, updateState]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Check if we have basic required info
      if (!state.email) {
        toast({
          title: "E-mail is verplicht",
          description: "Vul een geldig e-mailadres in om door te gaan.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Show contact popup for additional info
      setShowContactPopup(true);
      
    } catch (error) {
      console.error("Error submitting contact info:", error);
      toast({
        title: "Er is iets misgegaan",
        description: "Probeer het later nog eens",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleContactPopupSubmit = async (contactData: Partial<ConfiguratorState>) => {
    // Update local state with the contact info
    updateState(contactData);
    
    // Show success toast notification
    toast({
      title: "Gegevens ontvangen!",
      description: "We zullen zo snel mogelijk contact met u opnemen.",
      variant: "success",
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Bijna klaar...
      </h2>
      
      {state.hasHolidayDiscount && (
        <div className="mb-6 p-4 border border-orange-200 bg-orange-50 rounded-lg flex items-center gap-3">
          <Gift className="h-5 w-5 text-orange-500 flex-shrink-0" />
          <div>
            <p className="text-orange-800 font-medium">Feestdagkorting: 10% korting op uw offerte!</p>
            <p className="text-orange-700 text-sm">Vandaag is het {holidayInfo.name}. Bij aanvraag vandaag geniet u van 10% korting.</p>
          </div>
        </div>
      )}
      
      <Alert className="mb-6">
        <AlertTitle>Laatste stap!</AlertTitle>
        <AlertDescription>
          Vul uw contactgegevens in om een offerte te ontvangen en een afspraak te maken.
        </AlertDescription>
      </Alert>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <SubmitButton 
          isSubmitting={isSubmitting} 
          buttonText="Naar contactgegevens" 
          submittingText="Een moment..." 
        />
      </form>

      <ContactDialog
        open={showContactPopup}
        onOpenChange={setShowContactPopup}
        onSubmit={handleContactPopupSubmit}
        initialData={state}
      />
    </div>
  );
};

export default ContactInformationStep;
