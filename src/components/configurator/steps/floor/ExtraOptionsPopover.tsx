
import React from "react";
import { ConfiguratorState } from "../../types";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ExtraOptionsPopoverProps {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
}

const ExtraOptionsPopover = ({ state, updateState }: ExtraOptionsPopoverProps) => {
  // Tel hoeveel opties zijn geselecteerd
  const getSelectedOptionsCount = () => {
    let count = 0;
    if (state.needsPlinths) count++;
    if (state.needsChape) count++;
    if (state.needsElectrician) count++;
    return count;
  };

  const selectedCount = getSelectedOptionsCount();

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
          
          <div className="space-y-4">
            {/* Plinten */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="plinths" className="cursor-pointer">
                  Plinten plaatsen
                </Label>
                <p className="text-xs text-gray-500">
                  Afwerking tussen vloer en muur
                </p>
              </div>
              <Switch
                id="plinths"
                checked={state.needsPlinths || false}
                onCheckedChange={(checked) => updateState({ needsPlinths: checked })}
              />
            </div>
            
            {/* Chape */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div>
                  <Label htmlFor="chape" className="cursor-pointer">
                    Chapewerken nodig
                  </Label>
                  <p className="text-xs text-gray-500">
                    Egaliseren van ondervloer
                  </p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-sm">
                        Aanbevolen voor grootformaat tegels (60x60 cm of groter) en
                        onmisbaar voor XXL-tegels.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Switch
                id="chape"
                checked={state.needsChape || false}
                onCheckedChange={(checked) => updateState({ needsChape: checked })}
              />
            </div>
            
            {/* Elektriciën */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="electrician" className="cursor-pointer">
                  Elektriciën nodig
                </Label>
                <p className="text-xs text-gray-500">
                  Voor vloerverwarming en andere aansluitingen
                </p>
              </div>
              <Switch
                id="electrician"
                checked={state.needsElectrician || false}
                onCheckedChange={(checked) => updateState({ needsElectrician: checked })}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ExtraOptionsPopover;
