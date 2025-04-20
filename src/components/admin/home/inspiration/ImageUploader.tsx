
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Loader2, Upload, Link as LinkIcon } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploaderProps {
  tileIndex: number;
  imageUrl: string;
  isUploading: boolean;
  onImageUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploader = ({
  tileIndex,
  imageUrl,
  isUploading,
  onImageUpload
}: ImageUploaderProps) => {
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [manualUrlMode, setManualUrlMode] = useState(false);
  const [manualUrl, setManualUrl] = useState<string>(imageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset error
    setError(null);
    
    // Validate file size (max 5MB)
    if (file && file.size > 5 * 1024 * 1024) {
      setError("Afbeelding mag niet groter zijn dan 5MB");
      toast({
        title: "Afbeelding te groot",
        description: "Afbeelding mag niet groter zijn dan 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file type
    if (file && !file.type.startsWith('image/')) {
      setError("Bestand moet een afbeelding zijn");
      toast({
        title: "Ongeldig bestandstype",
        description: "Bestand moet een afbeelding zijn",
        variant: "destructive",
      });
      return;
    }
    
    // Create local preview immediately for better UX
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    
    // Continue with the parent upload handler
    onImageUpload(tileIndex, e);
  };

  // Handle manually entered URL
  const handleManualUrlSubmit = () => {
    if (!manualUrl) {
      toast({
        title: "Geen URL ingevoerd",
        description: "Voer een geldige URL in",
        variant: "destructive",
      });
      return;
    }
    
    if (!isValidUrl(manualUrl)) {
      toast({
        title: "Ongeldige URL",
        description: "Voer een geldige URL in die begint met http:// of https://",
        variant: "destructive",
      });
      return;
    }
    
    // Create a mock file input event to maintain compatibility with existing code
    const mockEvent = {
      target: {
        files: null,
        value: manualUrl,
        dataset: {
          manualUrl: manualUrl
        }
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    // Pass the URL through our custom attribute
    onImageUpload(tileIndex, mockEvent);
    
    toast({
      title: "URL toegepast",
      description: "De afbeelding URL is succesvol toegepast.",
    });
  };
  
  // Helper function to check if URL is valid
  const isValidUrl = (url: string) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://');
  };

  // Helper function to manually trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Toggle between upload and manual URL modes
  const toggleManualUrlMode = () => {
    setManualUrlMode(!manualUrlMode);
  };

  // Show either the uploaded image URL or the local preview
  const displayImageUrl = localPreview || imageUrl;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={`tile-image-${tileIndex}`}>Afbeelding</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={toggleManualUrlMode} 
          className="text-xs flex items-center gap-1"
        >
          {manualUrlMode ? (
            <>
              <Upload className="h-3 w-3" />
              Upload modus
            </>
          ) : (
            <>
              <LinkIcon className="h-3 w-3" />
              URL modus
            </>
          )}
        </Button>
      </div>
      
      {manualUrlMode ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="w-full">
            <Input
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="https://voorbeeld.com/afbeelding.jpg"
            />
          </div>
          <Button 
            type="button" 
            onClick={handleManualUrlSubmit} 
            disabled={!manualUrl}
            className="sm:flex-shrink-0"
          >
            Toepassen
          </Button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="relative w-full">
            <Input 
              id={`tile-image-${tileIndex}`}
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
              disabled={isUploading}
            />
            {isUploading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
          
          {displayImageUrl && (
            <Button 
              variant="outline" 
              size="icon" 
              asChild
              className="flex-shrink-0"
            >
              <a href={displayImageUrl} target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Bezig met uploaden...</span>
        </div>
      )}
      
      {displayImageUrl ? (
        <div 
          className="aspect-video max-h-[200px] rounded-md overflow-hidden border cursor-pointer"
          onClick={manualUrlMode ? undefined : triggerFileInput}
        >
          <img 
            src={displayImageUrl} 
            alt="Inspiratie" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/640x360?text=Afbeelding+niet+beschikbaar';
            }}
          />
        </div>
      ) : (
        <div 
          className="aspect-video border border-dashed rounded-md flex items-center justify-center bg-muted/30 cursor-pointer"
          onClick={manualUrlMode ? undefined : triggerFileInput}
        >
          <div className="text-center p-4">
            <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              {manualUrlMode ? "Voer URL in om afbeelding te tonen" : "Klik om een afbeelding te uploaden"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
