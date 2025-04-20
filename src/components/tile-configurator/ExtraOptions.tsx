
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ExtraOption } from "./types";

interface ExtraOptionsProps {
  options: ExtraOption[];
  selectedOptions: string[];
  onToggle: (id: string) => void;
}

const ExtraOptions = ({ options, selectedOptions, onToggle }: ExtraOptionsProps) => {
  return (
    <div className="space-y-2">
      <Label>Extra opties</Label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`extra-${option.id}`} 
              checked={selectedOptions.includes(option.id)}
              onCheckedChange={() => onToggle(option.id)}
            />
            <Label 
              htmlFor={`extra-${option.id}`}
              className="cursor-pointer text-sm"
            >
              {option.name} (+€{option.price}/m²)
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExtraOptions;
