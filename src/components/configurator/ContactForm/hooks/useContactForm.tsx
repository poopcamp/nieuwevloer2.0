
import { useState } from "react";
import { ConfiguratorState } from "../../types";
import { useToast } from "@/hooks/use-toast";

interface UseContactFormProps {
  initialData: ConfiguratorState;
  onSubmit: (updatedState: Partial<ConfiguratorState>) => void;
}

export function useContactForm({ initialData, onSubmit }: UseContactFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ConfiguratorState>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSubscribed, setEmailSubscribed] = useState(true);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.email) {
      toast({
        title: "E-mailadres is verplicht",
        description: "Vul a.u.b. uw e-mailadres in",
        variant: "destructive",
      });
      return;
    }
    
    // Check if email looks valid
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(formData.email)) {
      toast({
        title: "Ongeldig e-mailadres",
        description: "Vul een geldig e-mailadres in",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the onSubmit function from props with data
      const result = await onSubmit({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        additionalNotes: formData.additionalNotes,
        receivesNewsletter: emailSubscribed,
      });
      
      // Success message
      toast({
        title: "Bedankt voor uw aanvraag!",
        description: "We hebben uw gegevens ontvangen en nemen spoedig contact met u op.",
        variant: "success",
      });
      
      return result;
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Er is een fout opgetreden",
        description: error.message || "Probeer het later opnieuw",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    formData,
    isSubmitting,
    emailSubscribed,
    setEmailSubscribed,
    handleChange,
    handleCheckboxChange,
    handleSubmit
  };
}
