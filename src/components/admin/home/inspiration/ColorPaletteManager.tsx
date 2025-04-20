
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ColorPicker from "./ColorPicker";

interface ColorPaletteManagerProps {
  colors: string[];
  tileIndex: number;
  onColorChange: (tileIndex: number, colorIndex: number, value: string) => void;
  onAddColor: (index: number) => void;
  onRemoveColor: (tileIndex: number, colorIndex: number) => void;
}

const ColorPaletteManager = ({
  colors,
  tileIndex,
  onColorChange,
  onAddColor,
  onRemoveColor
}: ColorPaletteManagerProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label>Kleurenpalet</Label>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAddColor(tileIndex)}
          className="h-7 text-xs px-2"
        >
          Kleur toevoegen
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {colors.map((color, colorIndex) => (
          <ColorPicker
            key={colorIndex}
            color={color}
            colorIndex={colorIndex}
            tileIndex={tileIndex}
            onColorChange={onColorChange}
            onRemoveColor={onRemoveColor}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPaletteManager;
