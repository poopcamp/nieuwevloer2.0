
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ConfiguratorState } from "../types";
import { useContactPopup } from "./hooks/useContactPopup";
import ContactForm from "./ContactForm";

interface ContactPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: ConfiguratorState;
  onSuccess: (data: Partial<ConfiguratorState>) => void;
}

const ContactPopup = ({ open, onOpenChange, state, onSuccess }: ContactPopupProps) => {
  const {
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
  } = useContactPopup({
    initialData: state,
    onSuccess,
    onClose: () => onOpenChange(false)
  });
  
  return (
    <Dialog open={open} onOpenChange={isSubmitting ? undefined : onOpenChange}>
      <DialogContent className="max-w-md overflow-y-auto max-h-[90vh] p-0">
        <ContactForm 
          formData={formData}
          isSubmitting={isSubmitting}
          emailSubscribed={emailSubscribed}
          setEmailSubscribed={setEmailSubscribed}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          imageFile={imageFile}
          imagePreview={imagePreview}
          handleImageUpload={handleImageUpload}
          clearImage={clearImage}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ContactPopup;
