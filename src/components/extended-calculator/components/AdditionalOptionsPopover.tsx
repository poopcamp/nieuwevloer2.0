
import { useState } from 'react';
import { CalculatorOption } from '../types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { formatPrice } from '@/utils/configuratorPricing';
import { PlusCircle } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface AdditionalOptionsPopoverProps {
  options: CalculatorOption[];
  selectedOptions: CalculatorOption[];
  onToggleOption: (option: CalculatorOption) => void;
}

const AdditionalOptionsPopover = ({ 
  options, 
  selectedOptions, 
  onToggleOption 
}: AdditionalOptionsPopoverProps) => {
  // Toon aantal geselecteerde opties in de trigger-knop
  const selectedCount = selectedOptions.length;
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 w-full justify-start">
          <PlusCircle className="h-4 w-4 text-primary" />
          <span>Extra opties {selectedCount > 0 && `(${selectedCount})`}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2 mb-2">
            <h3 className="font-medium text-base">Extra opties</h3>
          </div>
          
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
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
      </PopoverContent>
    </Popover>
  );
};

export default AdditionalOptionsPopover;
