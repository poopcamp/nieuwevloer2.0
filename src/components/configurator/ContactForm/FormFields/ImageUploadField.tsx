import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadFieldProps {
  onImageUpload: (file: File | null, imageUrl?: string) => void;
}

const ImageUploadField = ({ onImageUpload }: ImageUploadFieldProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Bestand te groot",
        description: "Het bestand mag niet groter zijn dan 10MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Ongeldig bestandstype",
        description: "Upload a.u.b. een afbeelding (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    // Start upload to Supabase
    setIsUploading(true);
    
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('clientphotos')
        .upload(fileName, file);
      
      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        throw uploadError;
      }
      
      // Get public URL
      if (uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('clientphotos')
          .getPublicUrl(fileName);
          
        const imageUrl = publicUrlData.publicUrl;
        
        // Pass both file and URL to parent
        onImageUpload(file, imageUrl);
        
        toast({
          title: "Afbeelding geüpload",
          description: "Uw afbeelding is succesvol toegevoegd",
        });
      }
    } catch (error: any) {
      console.error("Failed to upload image:", error);
      toast({
        title: "Fout bij uploaden",
        description: error.message || "De afbeelding kon niet worden geüpload",
        variant: "destructive",
      });
      
      // Still keep the local preview and file
      onImageUpload(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    onImageUpload(null);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="projectImage">Foto's van uw project (optioneel)</Label>
      
      <input 
        ref={fileInputRef}
        type="file"
        id="projectImage"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {imagePreview ? (
        <div className="relative mt-2">
          <img 
            src={imagePreview}
            alt="Project preview"
            className="w-full h-48 object-cover rounded-md border border-gray-200"
          />
          <Button 
            type="button"
            variant="outline" 
            size="icon"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-white rounded-full h-8 w-8 p-0"
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          onClick={handleButtonClick}
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:border-gray-400 transition-colors"
        >
          <Camera className="h-10 w-10 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Klik om foto's toe te voegen</span>
          <span className="text-xs text-gray-400 mt-1">JPG, PNG, etc. (max 10MB)</span>
        </div>
      )}
      
      {isUploading && (
        <div className="text-sm text-gray-500 mt-1 flex items-center">
          <div className="animate-spin mr-2 h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
          Bezig met uploaden...
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
