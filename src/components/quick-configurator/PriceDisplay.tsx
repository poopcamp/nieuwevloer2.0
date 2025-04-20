
import React from "react";
import { TileOption } from "./hooks/types";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  calculatedPrice: number | null;
  installationPrice: number | null;
  squareMeters: number;
  selectedTileFormat: string;
  tileOptions: TileOption[];
  onRequestAppointment: () => void;
  isLoading: boolean;
  basePricePerSqm: number | null;
  wantsToBuyTiles: boolean;
  tilePricePerSqm: number | null;
  squareMetersWithCuttingLoss: number;
  tileCost: number;
}

const PriceDisplay = ({
  calculatedPrice,
  installationPrice,
  squareMeters,
  selectedTileFormat,
  tileOptions,
  onRequestAppointment,
  isLoading,
  wantsToBuyTiles,
  tilePricePerSqm,
  squareMetersWithCuttingLoss,
  tileCost
}: PriceDisplayProps) => {
  
  // Find the selected tile option to get its price
  const selectedOption = tileOptions.find(option => option.value === selectedTileFormat);
  const pricePerSqm = selectedOption?.price_per_sqm || 0;
  
  const formatPrice = (price: number | null): string => {
    if (price === null) return "-";
    return `€ ${price.toLocaleString('nl-NL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const hasValidInputs = squareMeters > 0 && selectedTileFormat;
  
  // Price display content (loading, invalid inputs, or price calculation)
  let priceContent;
  
  if (isLoading) {
    priceContent = (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-gray-500">Prijsberekening laden...</p>
      </div>
    );
  } else if (!hasValidInputs) {
    priceContent = (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <p className="text-sm text-gray-500">
          Selecteer het tegelformaat en voer het aantal vierkante meters in om een prijsindicatie te krijgen.
        </p>
      </div>
    );
  } else {
    priceContent = (
      <div className="space-y-4">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-4">Uw prijsindicatie</h3>
          <p className="text-xs text-gray-500 mb-4">Excl. BTW</p>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Prijs per m²:</span>
              <span className="font-medium">{formatPrice(pricePerSqm)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Oppervlakte:</span>
              <span className="font-medium">{squareMeters} m²</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Subtotaal (excl. btw):</span>
              <span className="font-medium">{formatPrice(installationPrice)}</span>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold">Richtprijs:</span>
            <span className="text-xl font-bold text-primary">{formatPrice(calculatedPrice)}</span>
          </div>
          
          <Button 
            onClick={onRequestAppointment} 
            className="w-full mb-3"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Afspraak aanvragen
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full text-sm"
            onClick={() => window.location.href = '/configurator'}
          >
            Uitgebreide calculator <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-white p-6 rounded-lg border",
      hasValidInputs ? "border-gray-200" : "border-gray-100"
    )}>
      {priceContent}
    </div>
  );
};

export default PriceDisplay;
