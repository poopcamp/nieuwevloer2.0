import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { sendEmailRequest } from "@/utils/email";
import { tableNames } from "@/utils/supabase/customTypes";

export type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
  receives_newsletter: boolean;
  privacy_agreement: boolean;
};

interface EmailStatus {
  sentToCustomer: boolean;
  sentToAdmin: boolean;
  details?: any;
}

export const useContactForm = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    receives_newsletter: false,
    privacy_agreement: false,
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ContactFormData | "privacy_agreement", string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name as keyof ContactFormData];
      return next;
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name as keyof ContactFormData];
      return next;
    });
  };

  const validate = (): boolean => {
    const errors: Partial<Record<keyof ContactFormData | "privacy_agreement", string>> = {};
    if (!formData.name.trim()) errors.name = "Vul uw naam in.";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Vul een geldig e-mailadres in.";
    }
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, "").length < 8) {
      errors.phone = "Vul een geldig telefoonnummer in.";
    }
    if (!formData.message.trim()) errors.message = "Schrijf kort uw vraag of project.";
    if (!formData.privacy_agreement) {
      errors.privacy_agreement = "Bevestig de privacyvoorwaarden om verder te gaan.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitStatus("idle");
    if (!validate()) {
      toast({
        title: "Controleer het formulier",
        description: "Vul de verplichte velden in om verder te gaan.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from(tableNames.CONTACT_SUBMISSIONS)
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          additional_notes: formData.message,
          project_type: "contact_form",
          receives_newsletter: formData.receives_newsletter
        });

      if (dbError) throw new Error(dbError.message);

      // Send notification email
      const emailResult = await sendEmailRequest({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        projectType: "contact_form",
        totalPrice: 0,
        additionalNotes: formData.message,
      });

      setEmailStatus({
        sentToCustomer: emailResult.customerEmail?.success || false,
        sentToAdmin: emailResult.adminEmail?.success || false,
        details: emailResult.details
      });

      if (!emailResult.success) {
        console.warn("Warning: Email notification failed", emailResult.error);
        // Continue anyway, don't throw
      }

      // Success
      setSubmitStatus("success");
      toast({
        title: "Bericht verzonden",
        description: "Bedankt voor uw bericht. We nemen zo snel mogelijk contact met u op.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        receives_newsletter: false,
        privacy_agreement: false,
      });
      setFieldErrors({});
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("Contact form submission error:", err);
      setSubmitError(err.message || "Er is een fout opgetreden bij het verzenden van uw bericht.");
      setSubmitStatus("error");
      toast({
        title: "Fout bij verzenden",
        description: err.message || "Er is een fout opgetreden. Probeer het later opnieuw.",
        variant: "destructive",
      });
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
      privacy_agreement: false,
    });
    setFieldErrors({});
    setSubmitStatus("idle");
    setSubmitError(null);
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
    error: submitError,
    submitStatus,
    submitError,
    emailStatus,
    fieldErrors,
  };
};
