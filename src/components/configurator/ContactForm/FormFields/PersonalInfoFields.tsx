
import { useRef, useState } from "react";
import ContactFormLayout from "@/components/contact/common/ContactFormLayout";

interface PersonalInfoFieldsProps {
  name: string;
  email: string;
  phone: string;
  handleChange: (field: string, value: string | boolean) => void;
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoFields = ({ 
  name, 
  email, 
  phone, 
  handleChange,
  handleImageUpload
}: PersonalInfoFieldsProps) => {
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

  return (
    <ContactFormLayout
      email={email}
      name={name}
      phone={phone}
      onFieldChange={handleChange}
      addImage={!!handleImageUpload}
      onImageUpload={handleFileChange}
      imagePreview={imagePreview}
      onClearImage={clearImage}
    />
  );
};

export default PersonalInfoFields;
