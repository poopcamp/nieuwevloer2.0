
import { useState } from "react";
import { ConfiguratorState } from "../types";
import ContactFormFields from "./FormFields/ContactFormFields";
import FormActions from "./FormActions/FormActions";
import PrivacyDisclaimer from "./PrivacyDisclaimer";
import { useContactForm } from "./hooks/useContactForm";
import { useToast } from "@/hooks/use-toast";
import HolidayDiscountBanner from "./HolidayDiscountBanner";

interface ContactFormContentProps {
  initialData: ConfiguratorState;
  onSubmit: (data: Partial<ConfiguratorState>) => void;
  onCancel: () => void;
  hasHolidayDiscount?: boolean;
}

const ContactFormContent = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  hasHolidayDiscount 
}: ContactFormContentProps) => {
  const { toast } = useToast();
  const {
    formData,
    isSubmitting,
    emailSubscribed,
    setEmailSubscribed,
    handleChange,
    handleSubmit: originalHandleSubmit
  } = useContactForm({
    initialData,
    onSubmit
  });

  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!privacyAgreed) {
      toast({
        title: "Privacy akkoord vereist",
        description: "U moet akkoord gaan met onze privacyvoorwaarden om door te gaan.",
        variant: "destructive",
      });
      return;
    }
    
    originalHandleSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <ContactFormFields
        formData={formData}
        emailSubscribed={emailSubscribed}
        setEmailSubscribed={setEmailSubscribed}
        handleChange={handleChange}
      />
      
      {hasHolidayDiscount && <HolidayDiscountBanner />}
      
      <PrivacyDisclaimer 
        value={privacyAgreed}
        onChange={setPrivacyAgreed}
        required={true}
      />
      
      <FormActions 
        isSubmitting={isSubmitting} 
        onCancel={onCancel} 
      />
    </form>
  );
};

export default ContactFormContent;
