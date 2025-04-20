
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TileStyle } from "./types";

interface TileStyleSelectorProps {
  tileStyles: TileStyle[];
  selectedStyle: string;
  onSelect: (value: string) => void;
}

const TileStyleSelector = ({ tileStyles, selectedStyle, onSelect }: TileStyleSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="tileStyle">Tegelstijl</Label>
      <Select 
        value={selectedStyle} 
        onValueChange={onSelect}
      >
        <SelectTrigger>
          <SelectValue placeholder="Kies een stijl" />
        </SelectTrigger>
        <SelectContent>
          {tileStyles.map((style) => (
            <SelectItem key={style.id} value={style.id}>
              {style.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TileStyleSelector;
