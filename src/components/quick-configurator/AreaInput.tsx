
import { Input } from "@/components/ui/input";
import { useState, useEffect, ChangeEvent } from "react";

interface AreaInputProps {
  value: number;
  onChange: (value: number) => void;
}

const AreaInput = ({ value, onChange }: AreaInputProps) => {
  const [localValue, setLocalValue] = useState<string>(value.toString());

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(',', '.').trim();
    setLocalValue(inputValue);
    
    if (inputValue === '') {
      onChange(0);
      return;
    }
    
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue) && numericValue >= 0) {
      onChange(numericValue);
    }
  };

  return (
    <div className="relative">
      <Input
        type="text"
        inputMode="decimal"
        value={localValue}
        onChange={handleValueChange}
        className="pr-10"
        placeholder="Voer oppervlakte in"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
        m²
      </span>
      <p className="text-xs text-gray-500 mt-2">
        Voer het aantal vierkante meters in
      </p>
    </div>
  );
};

export default AreaInput;
