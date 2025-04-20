import { useEffect, useState } from "react";
import { ConfiguratorState } from "../types";
import { useToast } from "@/hooks/use-toast";
import FloorTypeSelector from "./floor/FloorTypeSelector";
import TileSizeSelector from "./floor/TileSizeSelector";
import TilePatternSelector from "./floor/TilePatternSelector";
import SquareMetersSlider from "./floor/SquareMetersSlider";
import TilePurchaseOptions from "./floor/TilePurchaseOptions";
import RomeinsVerbandAlert from "./floor/RomeinsVerbandAlert";
import HolidayDiscountDialog from "./floor/HolidayDiscountDialog";
import FloorStepWithPopover from "./floor/FloorStepWithPopover";
import ExtraOptionsPopover from "./floor/ExtraOptionsPopover";

interface FloorStepProps {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
}

const FloorStep = ({ state, updateState }: FloorStepProps) => {
  const { toast } = useToast();
  const [showHolidayPopup, setShowHolidayPopup] = useState(false);
  
  const showOntkoppelingsmat = () => {
    if (state.tilePattern === 'romeins') return true;
    
    if (state.tileSize === 'parket') return true;
    
    if (!state.tileSize) return false;
    
    if (state.tileSize === 'XXL') return true;
    
    const sizeParts = state.tileSize.split('x');
    if (sizeParts.length !== 2) return false;
    
    try {
      const [width, height] = sizeParts.map(part => parseInt(part, 10));
      return (width > 90 || height > 90);
    } catch (e) {
      return false;
    }
  };
  
  useEffect(() => {
    const isHoliday = false;
    
    if (isHoliday && !state.hasHolidayDiscount) {
      setShowHolidayPopup(true);
    }
  }, [state.hasHolidayDiscount]);
  
  const handleTileSizeChange = (newSize: string) => {
    updateState({ tileSize: newSize });
    
    if (newSize === 'romeins') {
      updateState({ tilePattern: 'romeins' });
      
      toast({
        title: "Romeins verband geselecteerd",
        description: "Dit patroon gebruikt meerdere tegelformaten voor een natuurlijke uitstraling. Ontkoppelingsmat wordt aanbevolen.",
      });
    }
    
    if (newSize === '120x120' || newSize === '90x90' || newSize === 'XXL') {
      if (!state.needsChape) {
        toast({
          title: "Tip voor grote tegels",
          description: "Voor grote tegelformaten adviseren wij een egale ondergrond (chape) en ontkoppelingsmat voor het beste resultaat.",
        });
      }
    }
  };
  
  const handleFloorTypeChange = (type: string) => {
    updateState({ floorType: type });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Vloer Configureren
      </h2>
      
      <div className="space-y-8">
        <FloorTypeSelector
          selectedType={state.floorType || ''}
          onTypeChange={handleFloorTypeChange}
        />
        
        <TileSizeSelector
          state={state}
          updateState={updateState}
        />
        
        {state.tileSize === 'romeins' && <RomeinsVerbandAlert isVisible={true} />}
        
        {state.tileSize && state.tileSize !== 'romeins' && (
          <TilePatternSelector 
            state={state}
            updateState={updateState}
          />
        )}
        
        <SquareMetersSlider 
          value={state.squareMeters}
          onChange={(val) => updateState({ squareMeters: val })}
        />
        
        <ExtraOptionsPopover 
          state={state} 
          updateState={updateState}
        />
        
        <TilePurchaseOptions 
          state={state}
          updateState={updateState}
        />
      </div>
      
      <HolidayDiscountDialog
        open={showHolidayPopup}
        onOpenChange={setShowHolidayPopup}
        onApply={() => {
          updateState({ hasHolidayDiscount: true });
          setShowHolidayPopup(false);
        }}
      />
    </div>
  );
};

export default FloorStep;
