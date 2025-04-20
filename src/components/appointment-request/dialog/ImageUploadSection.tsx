
import ImageUploadField from "@/components/common/ImageUploadField";

interface ImageUploadSectionProps {
  imagePreview: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage: () => void;
}

const ImageUploadSection = ({ 
  imagePreview, 
  handleImageUpload, 
  clearImage 
}: ImageUploadSectionProps) => {
  return (
    <ImageUploadField
      imagePreview={imagePreview}
      onUpload={handleImageUpload}
      onClear={clearImage}
      label="Foto toevoegen (optioneel)"
    />
  );
};

export default ImageUploadSection;
