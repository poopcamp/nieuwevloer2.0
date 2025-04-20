
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { contactService } from "@/services/contactService";
import { useFormState } from "@/utils/formHandling";
import { ContactSubmissionData } from "@/types/configuration";

export type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
  receives_newsletter: boolean;
};

export const useContactFormRefactored = (onSuccess?: () => void) => {
  const initialState: ContactFormData = {
    name: "",
    email: "",
    phone: "",
    message: "",
    receives_newsletter: false,
  };
  
  const { 
    formData, 
    setFormData,
    isSubmitting, 
    setIsSubmitting,
    handleChange, 
    handleCheckboxChange,
    showError,
    showSuccess
  } = useFormState<ContactFormData>(initialState);
  
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [emailStatus, setEmailStatus] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const result = await contactService.submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        additional_notes: formData.message,
        receives_newsletter: formData.receives_newsletter
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      setEmailStatus(result.emailStatus);
      setSubmitStatus("success");
      showSuccess("Bedankt voor uw bericht. We nemen zo snel mogelijk contact met u op.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        receives_newsletter: false,
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("Contact form submission error:", err);
      setSubmitStatus("error");
      showError(err.message || "Er is een fout opgetreden. Probeer het later opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      receives_newsletter: false,
    });
    setSubmitStatus("idle");
    setEmailStatus(null);
  };

  return {
    formData,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
    resetForm,
    isSubmitting,
    isSuccess: submitStatus === "success",
    submitStatus,
    emailStatus,
  };
};
