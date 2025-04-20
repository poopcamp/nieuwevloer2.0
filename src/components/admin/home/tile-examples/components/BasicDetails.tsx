
import { TileExample } from "@/types/homeContent";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BasicDetailsProps {
  example: TileExample;
  index: number;
  onChange: (field: keyof TileExample, value: any) => void;
}

const BasicDetails = ({ example, index, onChange }: BasicDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`example-name-${index}`}>Naam</Label>
          <Input 
            id={`example-name-${index}`}
            value={example.name}
            onChange={(e) => onChange('name', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`example-size-${index}`}>Afmeting</Label>
          <Input 
            id={`example-size-${index}`}
            value={example.size}
            onChange={(e) => onChange('size', e.target.value)}
            placeholder="Bijv. 60x60 cm"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`example-description-${index}`}>Beschrijving</Label>
        <Textarea 
          id={`example-description-${index}`}
          value={example.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`example-finish-${index}`}>Afwerking</Label>
        <Input 
          id={`example-finish-${index}`}
          value={example.finish || ''}
          onChange={(e) => onChange('finish', e.target.value)}
          placeholder="Bijv. Mat, Glanzend, etc."
        />
      </div>
    </div>
  );
};

export default BasicDetails;
