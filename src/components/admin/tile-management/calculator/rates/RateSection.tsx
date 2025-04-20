
import React from 'react';
import RateField from "./RateField";
import { RateSectionProps } from "./types";
import { Card } from "@/components/ui/card";

const RateSection = ({ sectionId, rates, onChange }: RateSectionProps) => {
  // Handle rate field change
  const handleRateChange = (rateKey: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onChange(sectionId, rateKey, numValue);
    }
  };
  
  const hasRates = Object.entries(rates).length > 0;
  
  return (
    <div className="space-y-4">
      {hasRates ? (
        Object.entries(rates).map(([key, rate]) => (
          <RateField
            key={key}
            label={rate.name}
            value={rate.value.toString()}
            onChange={(value) => handleRateChange(key, value)}
          />
        ))
      ) : (
        <Card className="bg-gray-50 p-4">
          <p className="text-sm text-gray-500 text-center">Geen tarieven gevonden voor deze sectie.</p>
          <p className="text-xs text-gray-400 text-center mt-1">Voeg nieuwe tarieven toe via het beheer.</p>
        </Card>
      )}
    </div>
  );
};

export default RateSection;
