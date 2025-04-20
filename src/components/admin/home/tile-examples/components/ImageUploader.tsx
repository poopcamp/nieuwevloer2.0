
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Upload, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  imageUrl: string;
  onImageUploaded: (url: string) => void;
  index: number;
}

const ImageUploader = ({ imageUrl, onImageUploaded, index }: ImageUploaderProps) => {
  const [imageUploading, setImageUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(imageUrl || '');
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [manualUrlMode, setManualUrlMode] = useState(false);
  const [manualUrl, setManualUrl] = useState<string>(imageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Ensure we update the preview if the parent updates the imageUrl
  useEffect(() => {
    if (imageUrl && imageUrl !== previewUrl) {
      setPreviewUrl(imageUrl);
      setManualUrl(imageUrl);
    }
  }, [imageUrl]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    
    // Validate file size (max 5MB)
    if (file && file.size > 5 * 1024 * 1024) {
      toast({
        title: "Afbeelding te groot",
        description: "Afbeelding mag niet groter zijn dan 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (file && !file.type.startsWith('image/')) {
      toast({
        title: "Ongeldig bestandstype",
        description: "Bestand moet een afbeelding zijn",
        variant: "destructive",
      });
      return;
    }
    
    setImageUploading(true);
    
    try {
      // Toon een tijdelijke preview meteen na selectie
      const tempPreviewUrl = URL.createObjectURL(file);
      setLocalPreview(tempPreviewUrl);
      
      // Skip bucket creation - assume buckets already exist
      // Just attempt to upload directly
      
      const fileExt = file.name.split('.').pop();
      const fileName = `tile-example-${Date.now()}.${fileExt}`;
      
      console.log(`Uploading file ${fileName} to website_images/tile-examples/`);
      
      // Upload naar Supabase
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('website_images')
        .upload(`tile-examples/${fileName}`, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      console.log("Upload successful, getting public URL...");
      
      const { data: publicUrlData } = supabase.storage
        .from('website_images')
        .getPublicUrl(`tile-examples/${fileName}`);

      if (!publicUrlData.publicUrl) {
        throw new Error("Kon geen publieke URL genereren");
      }

      console.log("Afbeelding geüpload, URL:", publicUrlData.publicUrl);
      
      // Update naar de echte URL en stuur terug naar parent
      setPreviewUrl(publicUrlData.publicUrl);
      onImageUploaded(publicUrlData.publicUrl);
      
      toast({
        title: "Afbeelding geüpload",
        description: "De afbeelding is succesvol geüpload.",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      
      let errorMessage = "Er is een fout opgetreden bij het uploaden van de afbeelding.";
      
      // Controleer op specifieke Supabase storage fouten
      if (error.message?.includes('storage') || error.message?.includes('bucket')) {
        errorMessage = "Er is een probleem met de opslagruimte. Neem contact op met de beheerder om de nodige buckets aan te maken.";
      } else if (error.message?.includes("does not exist")) {
        errorMessage = "De opgegeven opslagbucket bestaat niet. Neem contact op met de beheerder om de 'website_images' bucket aan te maken.";
      }
      
      toast({
        title: "Fout bij uploaden",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
    }
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
    
    setPreviewUrl(manualUrl);
    onImageUploaded(manualUrl);
    
    toast({
      title: "URL toegepast",
      description: "De afbeelding URL is succesvol toegepast.",
    });
  };
  
  // Functie om te controleren of een URL geldig is
  const isValidUrl = (url: string) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://');
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Toggle between upload and manual URL modes
  const toggleManualUrlMode = () => {
    setManualUrlMode(!manualUrlMode);
  };

  // Choose which image to display (local preview or stored URL)
  const displayUrl = localPreview || previewUrl;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={`example-image-${index}`}>Afbeelding</Label>
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
        <div className="flex items-center gap-2">
          <div className="flex-grow">
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
            className="flex-shrink-0"
          >
            Toepassen
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <Input 
              id={`example-image-${index}`}
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
              disabled={imageUploading}
            />
            {imageUploading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
          
          {isValidUrl(displayUrl) && (
            <Button 
              variant="outline" 
              size="icon" 
              asChild
              className="flex-shrink-0"
            >
              <a href={displayUrl} target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      )}
      
      {imageUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Uploaden...</span>
        </div>
      )}
      
      {isValidUrl(displayUrl) ? (
        <div 
          className="aspect-video rounded-md overflow-hidden border cursor-pointer"
          onClick={manualUrlMode ? undefined : triggerFileInput}
        >
          <img 
            src={displayUrl} 
            alt="Tegelvoorbeeld" 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Afbeelding kon niet worden geladen:", displayUrl);
              e.currentTarget.src = 'https://placehold.co/600x400?text=Afbeelding+niet+beschikbaar';
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
