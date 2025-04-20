
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface AreaSliderProps {
  squareMeters: number;
  onValueChange: (value: number) => void;
}

const AreaSlider = ({ squareMeters, onValueChange }: AreaSliderProps) => {
  return (
    <div className="bg-gray-50 p-5 rounded-lg">
      <div className="flex justify-between mb-2">
        <Label htmlFor="squareMeters" className="text-lg font-medium">Oppervlakte (ongeveer)</Label>
        <span className="text-lg font-semibold text-primary">{squareMeters} m²</span>
      </div>
      <Slider
        id="squareMeters"
        min={2}
        max={500}
        step={1}
        value={[squareMeters]}
        onValueChange={(value) => onValueChange(value[0])}
        className="py-4"
      />
      <p className="text-sm text-gray-500 mt-1">Verschuif de slider om het aantal vierkante meters aan te geven</p>
    </div>
  );
};

export default AreaSlider;
