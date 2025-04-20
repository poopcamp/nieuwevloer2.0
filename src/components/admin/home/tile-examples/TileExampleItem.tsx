
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash } from "lucide-react";
import { TileExample } from "@/types/homeContent";
import BasicDetails from "./components/BasicDetails";
import ImageUploader from "./components/ImageUploader";
import TagManager from "./components/TagManager";

interface TileExampleItemProps {
  example: TileExample;
  index: number;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof TileExample, value: any) => void;
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tagIndex: number) => void;
}

const TileExampleItem = ({
  example,
  index,
  onRemove,
  onChange,
  onAddTag,
  onRemoveTag
}: TileExampleItemProps) => {
  
  const handleFieldChange = (field: keyof TileExample, value: any) => {
    onChange(index, field, value);
  };

  const handleTagsChange = (tags: string[]) => {
    onChange(index, 'suitable_for', tags);
  };

  const handleImageUploaded = (url: string) => {
    console.log(`Afbeelding geüpload voor voorbeeld ${index + 1}:`, url);
    handleFieldChange('image', url);
  };

  return (
    <div className="border p-4 rounded-md space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="font-medium">Tegelvoorbeeld {index + 1}</h3>
        <Button 
          variant="destructive" 
          size="icon" 
          onClick={() => onRemove(index)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <BasicDetails 
          example={example} 
          index={index} 
          onChange={handleFieldChange} 
        />
        
        <div className="space-y-4">
          <ImageUploader 
            imageUrl={example.image || ''} 
            onImageUploaded={handleImageUploaded} 
            index={index} 
          />
          
          <TagManager 
            tags={example.suitable_for || []} 
            onTagsChange={handleTagsChange} 
            index={index} 
          />
        </div>
      </div>
    </div>
  );
};

export default TileExampleItem;
