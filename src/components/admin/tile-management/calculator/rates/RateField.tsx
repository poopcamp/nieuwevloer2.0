
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const RateField = ({ label, value, onChange }: RateFieldProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  return (
    <div className="grid grid-cols-2 gap-4 items-center">
      <Label htmlFor={`rate-${label}`}>{label}</Label>
      <Input
        id={`rate-${label}`}
        type="number"
        step="0.01"
        min="0"
        value={value}
        onChange={handleInputChange}
        className="w-full"
      />
    </div>
  );
};

export default RateField;
