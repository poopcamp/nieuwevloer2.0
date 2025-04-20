
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { uploadImageToStorage } from "./api/inspirationTilesApi";

export type ImageUploadState = {[key: string]: boolean};

export const useImageUpload = () => {
  const [imageUploading, setImageUploading] = useState<ImageUploadState>({});
  const { toast } = useToast();

  const handleImageUpload = async (index: number, tileId: string, e: React.ChangeEvent<HTMLInputElement>, onSuccess: (url: string) => void) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    
    setImageUploading(prev => ({...prev, [tileId]: true}));
    
    try {
      const publicUrl = await uploadImageToStorage(file);
      onSuccess(publicUrl);
      
      toast({
        title: "Afbeelding geüpload",
        description: "De afbeelding is succesvol geüpload.",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      
      let errorMessage = error.message;
      
      // Check for common storage bucket errors
      if (errorMessage.includes('bucket') || errorMessage.includes('storage')) {
        errorMessage = "Er is een probleem met de opslagbucket. Neem contact op met de beheerder.";
      }
      
      toast({
        title: "Fout bij uploaden",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setImageUploading(prev => ({...prev, [tileId]: false}));
    }
  };

  return {
    imageUploading,
    handleImageUpload
  };
};
