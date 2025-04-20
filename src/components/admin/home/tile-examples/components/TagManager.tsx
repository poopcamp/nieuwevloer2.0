
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, Trash } from "lucide-react";

interface TagManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  index: number;
}

const TagManager = ({ tags, onTagsChange, index }: TagManagerProps) => {
  const [tagInput, setTagInput] = useState('');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;
    
    if (!tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
    }
    
    setTagInput('');
  };

  const removeTag = (tagIndex: number) => {
    const updatedTags = [...tags];
    updatedTags.splice(tagIndex, 1);
    onTagsChange(updatedTags);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor={`example-tags-${index}`}>Geschikt voor</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, tagIndex) => (
          <Badge key={tagIndex} className="flex items-center gap-1 bg-primary-50 text-primary border-primary-100 hover:bg-primary-100">
            {tag}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => removeTag(tagIndex)}
              className="h-4 w-4 rounded-full ml-1 hover:bg-primary-200"
            >
              <Trash className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          id={`example-tags-${index}`}
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Voeg een tag toe en druk op Enter"
        />
        <Button 
          type="button" 
          size="icon" 
          onClick={addTag}
        >
          <Tag className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TagManager;
