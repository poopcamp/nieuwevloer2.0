
import { useCallback } from "react";
import { TileOption, PriceCalculation } from "./types";

interface PriceCalculatorProps {
  selectedTileFormat: string;
  squareMeters: number;
  tileOptions: TileOption[];
  wantsToBuyTiles: boolean;
  tilePricePerSqm: number | null;
  basePricePerSqm?: number;
}

export function usePriceCalculator({
  selectedTileFormat,
  squareMeters,
  tileOptions,
  wantsToBuyTiles,
  tilePricePerSqm,
  basePricePerSqm
}: PriceCalculatorProps): PriceCalculation {
  
  // Calculate square meters with cutting loss (10%)
  const squareMetersWithCuttingLoss = squareMeters * 1.1;
  
  // Calculate tile cost if applicable
  const tileCost = tilePricePerSqm && !wantsToBuyTiles
    ? squareMetersWithCuttingLoss * tilePricePerSqm 
    : 0;
  
  // Get the price per m² for the selected tile format directly from options
  const selectedTileOption = tileOptions.find(option => option.value === selectedTileFormat);
  const pricePerSqm = selectedTileFormat === 'romeins'
    ? (basePricePerSqm || 0) * 1.25  // 25% toeslag voor Romeins verband
    : selectedTileOption?.price_per_sqm || 0;
  
  // Calculate installation price based on selected format's direct price
  const installationPrice = selectedTileFormat && squareMeters > 0
    ? pricePerSqm * squareMeters
    : null;

  // Total price including tile cost if applicable
  const calculatedPrice = installationPrice !== null
    ? !wantsToBuyTiles ? installationPrice + tileCost : installationPrice
    : null;

  return {
    squareMetersWithCuttingLoss,
    tileCost,
    installationPrice,
    calculatedPrice
  };
}

