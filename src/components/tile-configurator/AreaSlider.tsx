
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface AreaSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const AreaSlider = ({ value, onChange }: AreaSliderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="squareMeters">Oppervlakte (m²)</Label>
        <span className="text-sm font-medium">{value} m²</span>
      </div>
      <Slider
        id="squareMeters"
        min={1}
        max={500}
        step={1}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        className="py-4"
      />
    </div>
  );
};

export default AreaSlider;
