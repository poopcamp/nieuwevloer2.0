
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ExtraOption } from "./types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ExtraOptionsPopoverProps {
  options: ExtraOption[];
  selectedOptions: string[];
  onToggle: (id: string) => void;
}

const ExtraOptionsPopover = ({ options, selectedOptions, onToggle }: ExtraOptionsPopoverProps) => {
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
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2 mb-2">
            <h3 className="font-medium text-base">Extra opties</h3>
          </div>
          
          <div className="space-y-3">
            {options.map((option) => (
              <div key={option.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={`extra-${option.id}`} 
                  checked={selectedOptions.includes(option.id)}
                  onCheckedChange={() => onToggle(option.id)}
                  className="mt-1"
                />
                <Label 
                  htmlFor={`extra-${option.id}`}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{option.name}</span>
                    <span className="text-xs text-gray-500">+€{option.price}/m²</span>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ExtraOptionsPopover;
