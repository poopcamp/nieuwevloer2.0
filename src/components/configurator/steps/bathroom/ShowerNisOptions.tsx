
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ConfiguratorState } from "../../types";

interface ShowerNisOptionsProps {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
}

const showerNisSizes = [
  { id: "30x60", name: "30 x 60 cm" },
  { id: "30x90", name: "30 x 90 cm" },
  { id: "30x120", name: "30 x 120 cm" },
  { id: "45x60", name: "45 x 60 cm" },
];

const ShowerNisOptions = ({ state, updateState }: ShowerNisOptionsProps) => {
  return (
    <div className="mt-3">
      <div className="p-4 border rounded-md border-gray-200 bg-gray-50">
        <h4 className="font-medium text-gray-800 mb-3">Douchenis opties</h4>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox 
              id="showerNis"
              checked={state.showerNis}
              onCheckedChange={(checked) => updateState({ showerNis: !!checked })}
            />
            <Label htmlFor="showerNis" className="cursor-pointer">
              Wil je een nis voorzien?
            </Label>
          </div>
          
          {state.showerNis && (
            <div className="space-y-4 ml-7 pt-2">
              <div className="space-y-2">
                <Label className="block text-sm">Kies het formaat van de nis:</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {showerNisSizes.map((size) => (
                    <div
                      key={size.id}
                      onClick={() => updateState({ showerNisSize: size.id })}
                      className={`p-2 border rounded-md cursor-pointer text-center text-sm transition-all ${
                        state.showerNisSize === size.id 
                          ? 'border-2 border-primary bg-primary/5 shadow-sm' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {size.name}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customNisSize" className="block text-sm">
                  Heb je een specifieke maat in gedachten?
                </Label>
                <Input
                  id="customNisSize"
                  value={state.showerNisCustomSize || ""}
                  onChange={(e) => updateState({ showerNisCustomSize: e.target.value })}
                  placeholder="Bijv. 40 x 70 cm"
                  className="border-gray-300"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowerNisOptions;
