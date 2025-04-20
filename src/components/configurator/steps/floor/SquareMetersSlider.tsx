
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface SquareMetersSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const SquareMetersSlider = ({ value = 20, onChange }: SquareMetersSliderProps) => {
  const [localValue, setLocalValue] = useState(value || 20);
  
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value || 20);
    }
  }, [value]);

  const handleSliderChange = (newValue: number[]) => {
    const sqm = newValue[0];
    setLocalValue(sqm);
    onChange(sqm);
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Aantal vierkante meters</h3>
      <div className="space-y-5">
        <Slider
          defaultValue={[localValue]}
          value={[localValue]}
          onValueChange={handleSliderChange}
          min={1}
          max={200}
          step={1}
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">1 m²</span>
          <span className="text-sm font-medium text-primary">{localValue} m²</span>
          <span className="text-sm text-gray-600">200 m²</span>
        </div>
      </div>
    </div>
  );
};

export default SquareMetersSlider;
