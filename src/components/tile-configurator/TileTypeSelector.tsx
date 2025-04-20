
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TileType } from "./types";

interface TileTypeSelectorProps {
  tileTypes: TileType[];
  selectedType: string;
  onSelect: (value: string) => void;
}

const TileTypeSelector = ({ tileTypes, selectedType, onSelect }: TileTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="tileType">Type tegel</Label>
      <RadioGroup 
        id="tileType" 
        value={selectedType} 
        onValueChange={onSelect}
        className="flex flex-col space-y-1"
      >
        {tileTypes.map((type) => (
          <div key={type.id} className="flex items-center space-x-2">
            <RadioGroupItem value={type.id} id={`type-${type.id}`} />
            <Label htmlFor={`type-${type.id}`} className="cursor-pointer">
              {type.name} (€{type.basePrice}/m²)
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default TileTypeSelector;
