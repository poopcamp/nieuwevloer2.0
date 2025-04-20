
import { ConfiguratorState } from "../types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LinkIcon } from "lucide-react";

interface AdditionalWorkStepProps {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
}

const AdditionalWorkStep = ({ state, updateState }: AdditionalWorkStepProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Bijkomende Werken
      </h2>
      
      <div className="space-y-6">
        <p className="text-gray-600 mb-4">
          Zijn er nog voorbereidende werken nodig? Vink hieronder aan wat je wenst – wij regelen het via betrouwbare partners.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-5 border rounded-md border-gray-200 hover:border-gray-300 transition-all hover:shadow-sm">
            <Checkbox 
              id="needsChape" 
              checked={state.needsChape}
              onCheckedChange={(checked) => updateState({ needsChape: checked === true })}
              className="mt-1"
            />
            <div>
              <Label 
                htmlFor="needsChape"
                className="font-medium cursor-pointer"
              >
                Chapist nodig
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                De ondergrond nog niet klaar? Wij zorgen voor een dekvloer via een vakman.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-5 border rounded-md border-gray-200 hover:border-gray-300 transition-all hover:shadow-sm">
            <Checkbox 
              id="needsElectrician" 
              checked={state.needsElectrician}
              onCheckedChange={(checked) => updateState({ needsElectrician: checked === true })}
              className="mt-1"
            />
            <div>
              <Label 
                htmlFor="needsElectrician"
                className="font-medium cursor-pointer"
              >
                Elektriciteitswerken nodig
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Nood aan een stopcontact, vloerdoos of aansluiting voor vloerwarming? We brengen je in contact met de juiste specialist.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 p-5 rounded-md border border-amber-100 text-amber-800 text-sm mt-6">
          <div className="flex items-start gap-2">
            <LinkIcon className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-600" />
            <div>
              <h3 className="font-medium mb-2">Goed om te weten:</h3>
              <p>
                Wij coördineren deze werken via ervaren partners. Jij behoudt 1 aanspreekpunt (wij), maar de facturatie verloopt rechtstreeks via de partner na jouw goedkeuring van hun offerte. Geen verrassingen, wel volledige transparantie.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalWorkStep;
