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
  });
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
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitStatus("idle");

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
      });
      
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
    });
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
  };
};
