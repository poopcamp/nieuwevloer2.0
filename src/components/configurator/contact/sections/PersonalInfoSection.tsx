
import { useRef, useState } from "react";
import ContactFormLayout from "@/components/contact/common/ContactFormLayout";

interface PersonalInfoSectionProps {
  email: string;
  name: string;
  phone: string;
  handleChange: (field: string, value: string | boolean | File) => void;
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoSection = ({ 
  email, 
  name, 
  phone, 
  handleChange,
  handleImageUpload
}: PersonalInfoSectionProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (handleImageUpload) {
      handleImageUpload(e);
      
      if (e.target.files && e.target.files[0]) {
        // Maak een URL voor de preview
        const previewUrl = URL.createObjectURL(e.target.files[0]);
        setImagePreview(previewUrl);
      }
    }
  };
  
  const clearImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleFieldChange = (field: string, value: string | boolean) => {
    handleChange(field, value);
  };

  return (
    <ContactFormLayout
      email={email}
      name={name}
      phone={phone}
      onFieldChange={handleFieldChange}
      addImage={!!handleImageUpload}
      onImageUpload={handleFileChange}
      imagePreview={imagePreview}
      onClearImage={clearImage}
    />
  );
};

export default PersonalInfoSection;
