
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash, Info, AlertCircle } from "lucide-react";
import ColorPaletteManager from "./ColorPaletteManager";
import ImageUploader from "./ImageUploader";
import { InspirationTileFormProps } from "./types";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";

const InspirationTileForm = ({
  tile,
  index,
  onRemove,
  onInputChange,
  onColorChange,
  onAddColor,
  onRemoveColor,
  onImageUpload,
  imageUploading
}: InspirationTileFormProps) => {
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    title: false,
    description: false
  });

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const errors = {
    title: !tile.title && touched.title ? "Titel is verplicht" : null,
    description: !tile.description && touched.description ? "Beschrijving is verplicht" : null
  };

  // Reset touched state when tile changes
  useEffect(() => {
    setTouched({ title: false, description: false });
  }, [tile.id]);

  return (
    <div className="border p-4 rounded-md space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="font-medium">Inspiratietegel {index + 1}</h3>
        <Button 
          variant="destructive" 
          size="icon" 
          onClick={() => onRemove(index)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid gap-y-6 md:grid-cols-2 md:gap-x-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`tile-title-${index}`} className="flex items-center">
              Titel
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input 
              id={`tile-title-${index}`}
              value={tile.title}
              onChange={(e) => onInputChange(index, 'title', e.target.value)}
              onBlur={() => handleBlur('title')}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <div className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.title}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`tile-description-${index}`} className="flex items-center">
              Beschrijving
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea 
              id={`tile-description-${index}`}
              value={tile.description}
              onChange={(e) => onInputChange(index, 'description', e.target.value)}
              onBlur={() => handleBlur('description')}
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <div className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.description}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={`tile-popularity-${index}`}>Populariteit (0-100)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5">
                      <Info className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white p-2 rounded shadow-md text-sm max-w-xs">
                    <p>Dit bepaalt het percentage dat wordt weergegeven in de populariteitsmeter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input 
              id={`tile-popularity-${index}`}
              type="number"
              min="0"
              max="100"
              value={tile.popularity}
              onChange={(e) => onInputChange(index, 'popularity', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <ImageUploader 
            tileIndex={index}
            imageUrl={tile.image}
            isUploading={imageUploading[tile.id] || false}
            onImageUpload={onImageUpload}
          />
          
          <ColorPaletteManager 
            colors={tile.colorPalette}
            tileIndex={index}
            onColorChange={onColorChange}
            onAddColor={onAddColor}
            onRemoveColor={onRemoveColor}
          />
        </div>
      </div>
    </div>
  );
};

export default InspirationTileForm;
