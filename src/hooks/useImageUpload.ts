
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseImageUploadProps {
  bucketName?: string;
  folderPath?: string;
  maxSizeInMB?: number;
}

/**
 * Custom hook for handling image uploads
 */
export const useImageUpload = ({
  bucketName = 'clientphotos', // Default bucket
  folderPath = '', // Optional folder path within bucket
  maxSizeInMB = 5 // Default 5MB max size
}: UseImageUploadProps = {}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSizeInMB) {
        toast({
          title: "Bestand te groot",
          description: `Maximale bestandsgrootte is ${maxSizeInMB}MB`,
          variant: "destructive"
        });
        return;
      }
      
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    
    try {
      setIsUploading(true);
      
      // Generate a unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 10);
      const fileName = `${timestamp}-${randomString}-${imageFile.name.replace(/\s+/g, '_')}`;
      
      // Construct the full path
      const fullPath = folderPath ? `${folderPath}/${fileName}` : fileName;
      
      // Upload the file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fullPath, imageFile);
      
      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        toast({
          title: "Fout bij uploaden",
          description: uploadError.message,
          variant: "destructive"
        });
        return null;
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fullPath);
      
      return publicUrlData.publicUrl;
    } catch (error: any) {
      console.error("Error in image upload:", error);
      toast({
        title: "Fout bij uploaden",
        description: error.message || "Er is een fout opgetreden bij het uploaden",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    imageFile,
    imagePreview,
    isUploading,
    handleImageUpload,
    clearImage,
    uploadImage
  };
};
