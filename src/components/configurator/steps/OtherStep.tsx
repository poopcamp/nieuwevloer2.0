
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { ConfiguratorState } from "../types";

interface OtherStepProps {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
}

const OtherStep = ({ state, updateState }: OtherStepProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Andere Werken Configureren
      </h2>
      
      <div className="space-y-8">
        <div className="bg-gray-50 p-5 rounded-lg">
          <div className="flex justify-between mb-2">
            <Label htmlFor="squareMeters" className="text-lg font-medium">Oppervlakte</Label>
            <span className="text-lg font-semibold text-primary">{state.squareMeters} m²</span>
          </div>
          <Slider
            id="squareMeters"
            min={1}
            max={500}
            step={1}
            value={[state.squareMeters]}
            onValueChange={(value) => updateState({ squareMeters: value[0] })}
            className="py-4"
          />
          <p className="text-sm text-gray-500 mt-1">Verschuif de slider om het aantal vierkante meters aan te geven</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="otherDescription" className="text-lg font-medium">
            Beschrijf uw project
          </Label>
          <Textarea
            id="otherDescription"
            value={state.otherDescription}
            onChange={(e) => updateState({ otherDescription: e.target.value })}
            placeholder="Geef een korte beschrijving van uw project, bijvoorbeeld: terras, oprit, tuinpad, etc."
            className="h-32 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default OtherStep;
