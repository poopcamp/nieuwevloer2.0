
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { SquareIcon } from 'lucide-react';

interface SquareMetersInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const SquareMetersInput = ({
  value,
  onChange,
  min = 1,
  max = 100,
  step = 1
}: SquareMetersInputProps) => {
  const [localValue, setLocalValue] = useState<string>(value.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    const numValue = Number(newValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleSliderChange = (values: number[]) => {
    const newValue = values[0];
    setLocalValue(newValue.toString());
    onChange(newValue);
  };

  const handleBlur = () => {
    const numValue = Number(localValue);
    if (isNaN(numValue) || numValue < min) {
      setLocalValue(min.toString());
      onChange(min);
    } else if (numValue > max) {
      setLocalValue(max.toString());
      onChange(max);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <SquareIcon className="h-5 w-5 mr-2 text-gray-600" />
        <Label htmlFor="squareMeters" className="text-base">
          Oppervlakte (m²)
        </Label>
      </div>
      
      <div className="flex items-center gap-4">
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleSliderChange}
          className="flex-1"
        />
        
        <div className="flex items-center w-24">
          <Input
            id="squareMeters"
            type="number"
            min={min}
            max={max}
            value={localValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="text-right"
          />
          <span className="ml-2">m²</span>
        </div>
      </div>
    </div>
  );
};

export default SquareMetersInput;
