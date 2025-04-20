
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";

interface ColorPickerProps {
  color: string;
  colorIndex: number;
  tileIndex: number;
  onColorChange: (tileIndex: number, colorIndex: number, value: string) => void;
  onRemoveColor: (tileIndex: number, colorIndex: number) => void;
}

const ColorPicker = ({
  color,
  colorIndex,
  tileIndex,
  onColorChange,
  onRemoveColor
}: ColorPickerProps) => {
  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-6 h-6 rounded-full border shadow-sm flex-shrink-0" 
        style={{backgroundColor: color}}
      />
      <Input 
        type="color"
        value={color}
        onChange={(e) => onColorChange(tileIndex, colorIndex, e.target.value)}
        className="h-8 w-24"
      />
      <Input 
        type="text"
        value={color}
        onChange={(e) => onColorChange(tileIndex, colorIndex, e.target.value)}
        className="h-8 flex-grow"
      />
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onRemoveColor(tileIndex, colorIndex)}
        className="h-8 w-8"
      >
        <Trash className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default ColorPicker;
