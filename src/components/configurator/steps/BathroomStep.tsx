
import { useState, useEffect } from "react";
import { ConfiguratorState } from "../types";
import BathroomOptionItem from "./bathroom/BathroomOptionItem";
import ShowerNisOptions from "./bathroom/ShowerNisOptions";
import TileSizeSelector from "./bathroom/TileSizeSelector";
import AreaSlider from "./bathroom/AreaSlider";
import WalkInShowerAlert from "./bathroom/WalkInShowerAlert";
import FullBathroomOption from "./bathroom/FullBathroomOption";

interface BathroomStepProps {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
}

const tileSizes = [
  { id: "30x60", name: "30 x 60 cm" },
  { id: "60x60", name: "60 x 60 cm" },
  { id: "60x120", name: "60 x 120 cm" },
  { id: "120x120", name: "120 x 120 cm" },
  { id: "120x240", name: "120 x 240 cm" },
  { id: "XXL", name: "XXL Formaat (> 120 cm)" },
];

const BathroomStep = ({ state, updateState }: BathroomStepProps) => {
  // Create local copies to track changes
  const [options, setOptions] = useState(state.bathroomOptions);
  
  // Monitor full bathroom renovation selection to disable other options
  useEffect(() => {
    if (state.fullBathroomRenovation) {
      // Reset all other options when full renovation is selected
      const resetOptions = Object.keys(options).reduce((acc, key) => {
        acc[key as keyof typeof options] = false;
        return acc;
      }, {} as typeof options);
      
      setOptions(resetOptions);
      updateState({ bathroomOptions: resetOptions });
    }
  }, [state.fullBathroomRenovation]);

  // Update both local state and parent state
  const handleOptionChange = (option: keyof typeof options, value: boolean) => {
    // If full bathroom renovation is selected, don't allow other options
    if (state.fullBathroomRenovation && value) {
      return;
    }
    
    const updatedOptions = { ...options, [option]: value };
    setOptions(updatedOptions);
    updateState({ bathroomOptions: updatedOptions });
  };
  
  // Function to reset all bathroom options
  const resetAllOptions = () => {
    const resetOptions = Object.keys(options).reduce((acc, key) => {
      acc[key as keyof typeof options] = false;
      return acc;
    }, {} as typeof options);
    
    setOptions(resetOptions);
    updateState({ bathroomOptions: resetOptions });
  };

  // Check if selected size is a large format tile (120cm or larger)
  const isLargeFormatTile = () => {
    return state.bathroomTileSize === "120x120" || 
           state.bathroomTileSize === "120x240" ||
           state.bathroomTileSize === "XXL";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Badkamer Configureren
      </h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Welke delen wilt u betegelen?</h3>
          <div className="space-y-4">
            <BathroomOptionItem 
              id="floor"
              label="Vloer"
              description="Betegeling van de vloer in de badkamer"
              checked={options.floor}
              onCheckedChange={(checked) => handleOptionChange("floor", checked)}
              disabled={state.fullBathroomRenovation}
            />
            
            <BathroomOptionItem 
              id="showerWall"
              label="Douchewand"
              description="Betegeling van de wanden in de douche"
              checked={options.showerWall}
              onCheckedChange={(checked) => handleOptionChange("showerWall", checked)}
              disabled={state.fullBathroomRenovation}
              additionalContent={options.showerWall && (
                <ShowerNisOptions
                  state={state}
                  updateState={updateState}
                />
              )}
            />
            
            <BathroomOptionItem 
              id="walkInShower"
              label="Inloopdouche"
              description="Installatie en betegeling van een inloopdouche"
              checked={options.walkInShower}
              onCheckedChange={(checked) => handleOptionChange("walkInShower", checked)}
              disabled={state.fullBathroomRenovation}
              additionalContent={options.walkInShower && (
                <>
                  <div className="mt-2 bg-blue-50 border border-blue-100 rounded p-3">
                    <p className="text-sm text-blue-700">
                      We werken uitsluitend met systemen van Technicel voor inloopdouches.
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Standaard vaste chapekost van €750 (excl. BTW)
                    </p>
                  </div>
                  <ShowerNisOptions
                    state={state}
                    updateState={updateState}
                  />
                </>
              )}
            />
            
            <div className="mt-6">
              <FullBathroomOption 
                checked={state.fullBathroomRenovation}
                onCheckedChange={(checked) => updateState({ fullBathroomRenovation: checked })}
                onSiteVisitRequest={() => updateState({ wantsSiteVisit: true })}
                onResetOtherOptions={resetAllOptions}
              />
            </div>
          </div>
        </div>
        
        {/* Only show tile size selector if fullBathroomRenovation is NOT selected */}
        {!state.fullBathroomRenovation && (
          <TileSizeSelector 
            tileSizes={tileSizes}
            selectedSize={state.bathroomTileSize}
            onSizeChange={(size) => updateState({ bathroomTileSize: size })}
          />
        )}
        
        <AreaSlider 
          squareMeters={state.squareMeters}
          onValueChange={(value) => updateState({ squareMeters: value })}
        />
        
        {options.walkInShower && !state.fullBathroomRenovation && <WalkInShowerAlert />}
      </div>
    </div>
  );
};

export default BathroomStep;
