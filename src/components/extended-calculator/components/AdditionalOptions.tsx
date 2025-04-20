
import { useState } from 'react';
import { CalculatorOption } from '../types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { formatPrice } from '@/utils/configuratorPricing';
import { PlusCircle } from 'lucide-react';

interface AdditionalOptionsProps {
  options: CalculatorOption[];
  selectedOptions: CalculatorOption[];
  onToggleOption: (option: CalculatorOption) => void;
}

const AdditionalOptions = ({ options, selectedOptions, onToggleOption }: AdditionalOptionsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <PlusCircle className="h-5 w-5 mr-2 text-gray-600" />
        <h3 className="text-base font-medium">Extra opties</h3>
      </div>
      
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedOptions.some(o => o.id === option.id);
          
          return (
            <div
              key={option.id}
              className={`flex items-start p-3 border rounded-md ${
                isSelected ? 'border-primary bg-primary-50' : 'border-gray-200 bg-white'
              }`}
            >
              <Checkbox
                id={`option-${option.id}`}
                checked={isSelected}
                onCheckedChange={() => onToggleOption(option)}
                className="mt-1"
              />
              <div className="ml-3 flex-1">
                <Label
                  htmlFor={`option-${option.id}`}
                  className={`font-medium cursor-pointer ${isSelected ? 'text-primary-700' : ''}`}
                >
                  {option.name}
                </Label>
                {option.description && (
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                )}
              </div>
              {option.price_addition > 0 && (
                <div className="text-right ml-2">
                  <span className="font-medium">
                    {formatPrice(option.price_addition)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdditionalOptions;
