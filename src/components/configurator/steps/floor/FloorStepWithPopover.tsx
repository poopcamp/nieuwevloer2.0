
import React from "react";
import { ConfiguratorState } from "../../types";
import ExtraOptionsPopover from "./ExtraOptionsPopover";

interface FloorStepWithPopoverProps {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
}

const FloorStepWithPopover = ({ state, updateState }: FloorStepWithPopoverProps) => {
  // Check if the user has made the necessary selections for floor type and format
  const hasBasicSelections = !!state.floorType && !!state.tileSize;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Vloer Configureren
      </h2>
      
      {/* Basis opties */}
      <div className="space-y-8">
        {/* Hier komen de basisopties van het vloerproject */}
        {/* Deze moeten worden geïmplementeerd op basis van bestaande FloorStep.tsx */}
      </div>
      
      {/* Extra opties popover - alleen tonen als basisopties zijn ingevuld */}
      {hasBasicSelections && (
        <div className="my-6">
          <ExtraOptionsPopover 
            state={state} 
            updateState={updateState} 
          />
        </div>
      )}
    </div>
  );
};

export default FloorStepWithPopover;
