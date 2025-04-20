
import { useState } from "react";
import { ConfiguratorState } from "../../types";
import SquareMetersSlider from "./SquareMetersSlider";
import FloorTypeSelector from "./FloorTypeSelector";
import TileSizeSelector from "./TileSizeSelector";
import TilePatternSelector from "./TilePatternSelector";
import RomeinsVerbandAlert from "./RomeinsVerbandAlert";
import TilePurchaseOptions from "./TilePurchaseOptions";
import HolidayDiscountDialog from "./HolidayDiscountDialog";
import ExtraOptionsPopover from "./ExtraOptionsPopover";

interface FloorStepProps {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
}

const FloorStep = ({ state, updateState }: FloorStepProps) => {
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  
  // Check if user has made the basic selections
  const hasBasicSelections = !!state.floorType && !!state.tileSize;
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Vloer Configureren
      </h2>
      
      <div className="space-y-8">
        <FloorTypeSelector 
          selectedType={state.floorType}
          onTypeChange={(floorType) => updateState({ floorType })}
        />
        
        <TileSizeSelector 
          state={state}
          updateState={updateState}
        />
        
        {state.floorType && state.tileSize && (
          <>
            <SquareMetersSlider
              value={state.squareMeters || 20}
              onChange={(squareMeters) => updateState({ squareMeters })}
            />
            
            <TilePatternSelector
              state={state}
              updateState={updateState}
            />
            
            {state.tilePattern === "romeins" && <RomeinsVerbandAlert isVisible={true} />}
            
            <TilePurchaseOptions
              state={state}
              updateState={updateState}
            />
            
            <HolidayDiscountDialog
              open={showDiscountDialog}
              onOpenChange={setShowDiscountDialog}
              onApply={() => {
                updateState({ hasHolidayDiscount: true });
                setShowDiscountDialog(false);
              }}
            />
          </>
        )}
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

export default FloorStep;
