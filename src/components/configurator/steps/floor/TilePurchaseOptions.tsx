import { ConfiguratorState } from "../../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
interface TilePurchaseOptionsProps {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
}
const TilePurchaseOptions = ({
  state,
  updateState
}: TilePurchaseOptionsProps) => {
  const {
    toast
  } = useToast();
  const [localPricePerSqm, setLocalPricePerSqm] = useState<string>(state.tilePricePerSqm ? state.tilePricePerSqm.toString() : "");
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(',', '.');
    setLocalPricePerSqm(value);
  };
  useEffect(() => {
    if (localPricePerSqm) {
      const numericValue = parseFloat(localPricePerSqm);
      if (!isNaN(numericValue)) {
        // Convert BTW-inclusive price to BTW-exclusive price
        const priceExclBtw = numericValue / 1.21;
        updateState({
          tilePricePerSqm: parseFloat(priceExclBtw.toFixed(2))
        });
      }
    }
  }, [localPricePerSqm, updateState]);
  const handleYesClick = () => {
    updateState({
      wantsToBuyTiles: true,
      tilePricePerSqm: undefined
    });
    setLocalPricePerSqm("");
    toast({
      title: "Tegels via ons",
      description: "U hebt gekozen om tegels via ons aan te kopen."
    });
  };
  const handleNoClick = () => {
    updateState({
      wantsToBuyTiles: false
    });
    toast({
      title: "Zelf tegels aankopen",
      description: "U hebt gekozen om zelf tegels aan te kopen."
    });
  };
  return <div>
      <h3 className="text-lg font-medium mb-4">Tegels via ons of zelf voorzien?</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={handleYesClick} className={`flex items-center justify-center border rounded-lg p-4 cursor-pointer transition-all ${state.wantsToBuyTiles ? 'border-primary bg-primary/10 text-primary font-medium' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}>
          <span className="text-sm font-medium">Ja</span>
        </button>
        
        <button type="button" onClick={handleNoClick} className={`flex items-center justify-center border rounded-lg p-4 cursor-pointer transition-all ${state.wantsToBuyTiles === false ? 'border-primary bg-primary/10 text-primary font-medium' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}>
          <span className="text-sm font-medium">Nee</span>
        </button>
      </div>
      
      {state.wantsToBuyTiles === false && <div className="mt-4 p-4 border border-gray-200 rounded-lg animate-fadeIn">
          <Label htmlFor="tilePrice" className="block mb-2 text-sm">
            Wat is de aankoopprijs per m² van uw tegels? (incl. BTW)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
            <Input id="tilePrice" type="text" value={localPricePerSqm} onChange={handlePriceChange} className="pl-7" placeholder="0.00" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            We rekenen 10% snijverlies mee bij de calculatie
          </p>
        </div>}
    </div>;
};
export default TilePurchaseOptions;