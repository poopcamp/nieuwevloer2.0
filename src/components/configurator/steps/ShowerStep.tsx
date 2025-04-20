
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ConfiguratorState } from "../types";
import { Checkbox } from "@/components/ui/checkbox";
import ShowerNisOptions from "./bathroom/ShowerNisOptions";

interface ShowerStepProps {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
}

const showerTypes = [
  { id: "inloopdouche", name: "Inloopdouche" },
  { id: "douchecabine", name: "Douchecabine" },
  { id: "badkamervloer", name: "Badkamervloer" },
  { id: "badkamerwand", name: "Badkamerwand" },
];

const showerTileSizes = [
  { id: "5x5", name: "5 x 5 cm (Mozaïek)" },
  { id: "30x30", name: "30 x 30 cm" },
  { id: "30x60", name: "30 x 60 cm" },
  { id: "60x60", name: "60 x 60 cm" },
  { id: "XXL", name: "XXL Formaat (120+ cm)" },
];

const ShowerStep = ({ state, updateState }: ShowerStepProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Douche/Badkamer Configureren
      </h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Welk type douche/badkamer werk?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {showerTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => {
                  const updatedOptions = { ...state.bathroomOptions };
                  
                  // Reset all options
                  Object.keys(updatedOptions).forEach(key => {
                    updatedOptions[key as keyof typeof updatedOptions] = false;
                  });
                  
                  // Set the selected option
                  if (type.id === "inloopdouche") {
                    updatedOptions.walkInShower = true;
                  } else if (type.id === "badkamervloer") {
                    updatedOptions.floor = true;
                  } else if (type.id === "badkamerwand") {
                    updatedOptions.showerWall = true;
                  } else {
                    updatedOptions.shower = true;
                  }
                  
                  updateState({ bathroomOptions: updatedOptions });
                }}
                className={`p-4 border rounded-md cursor-pointer text-center transition-all ${
                  (type.id === "inloopdouche" && state.bathroomOptions.walkInShower) ||
                  (type.id === "badkamervloer" && state.bathroomOptions.floor) ||
                  (type.id === "badkamerwand" && state.bathroomOptions.showerWall) ||
                  (type.id === "douchecabine" && state.bathroomOptions.shower)
                    ? 'border-2 border-primary bg-primary/5 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="font-medium">{type.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Welk formaat tegels?</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {showerTileSizes.map((size) => (
              <div
                key={size.id}
                onClick={() => updateState({ bathroomTileSize: size.id })}
                className={`p-4 border rounded-md cursor-pointer text-center transition-all ${
                  state.bathroomTileSize === size.id 
                    ? 'border-2 border-primary bg-primary/5 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="font-medium">{size.name}</div>
              </div>
            ))}
          </div>
          {state.bathroomTileSize === "XXL" && (
            <p className="text-sm text-primary font-medium mt-2">XXL formaat: €109,80/m² (exclusief tegels)</p>
          )}
        </div>
        
        {(state.bathroomOptions.showerWall || state.bathroomOptions.walkInShower) && (
          <ShowerNisOptions 
            state={state}
            updateState={updateState}
          />
        )}
        
        <div className="bg-gray-50 p-5 rounded-lg">
          <div className="flex justify-between mb-2">
            <Label htmlFor="squareMeters" className="text-lg font-medium">Oppervlakte</Label>
            <span className="text-lg font-semibold text-primary">{state.squareMeters} m²</span>
          </div>
          <Slider
            id="squareMeters"
            min={1}
            max={30}
            step={1}
            value={[state.squareMeters]}
            onValueChange={(value) => updateState({ squareMeters: value[0] })}
            className="py-4"
          />
          <p className="text-sm text-gray-500 mt-1">Verschuif de slider om het aantal vierkante meters aan te geven</p>
        </div>
        
        <div className="flex items-start space-x-3 pt-2">
          <Checkbox 
            id="wantsSiteVisit"
            checked={state.wantsSiteVisit}
            onCheckedChange={(checked) => updateState({ wantsSiteVisit: checked === true })}
          />
          <div>
            <Label htmlFor="wantsSiteVisit" className="cursor-pointer">
              Ik wil graag een plaatsbezoek aanvragen
            </Label>
            <p className="text-sm text-gray-500 mt-1">
              Voor een exact voorstel op maat inclusief technisch advies
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowerStep;
