
import { useState, useEffect, useCallback } from "react";
import { TileOption } from "./types";

// Default tile options in case the data fetch fails
const defaultTileOptions: TileOption[] = [
  { id: "1", value: "30x30", label: "30 x 30 cm", price_per_sqm: 40 },
  { id: "2", value: "45x45", label: "45 x 45 cm", price_per_sqm: 45 },
  { id: "3", value: "60x60", label: "60 x 60 cm", price_per_sqm: 50 },
  { id: "4", value: "80x80", label: "80 x 80 cm", price_per_sqm: 55 },
  { id: "5", value: "90x90", label: "90 x 90 cm", price_per_sqm: 60 },
  { id: "6", value: "120x120", label: "120 x 120 cm", price_per_sqm: 70 }
];

export function useQuickConfigurator() {
  // State management
  const [selectedTileFormat, setSelectedTileFormat] = useState<string>("");
  const [squareMeters, setSquareMeters] = useState<number>(15);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [wantsToBuyTiles, setWantsToBuyTiles] = useState<boolean>(true);
  const [tilePricePerSqm, setTilePricePerSqm] = useState<number | null>(null);
  const [tileOptions, setTileOptions] = useState<TileOption[]>(defaultTileOptions);
  const [basePricePerSqm, setBasePricePerSqm] = useState<number>(45);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState<number>(0);

  // Retry connection logic
  const retryConnection = useCallback(() => {
    setConnectionAttempts(prev => prev + 1);
    setIsLoading(true);
    
    // Simulate data fetching delay
    setTimeout(() => {
      setIsLoading(false);
      setConnectionError(null);
    }, 1500);
  }, []);

  // Initialize connection on component mount
  useEffect(() => {
    if (!selectedTileFormat && tileOptions.length > 0) {
      setSelectedTileFormat(tileOptions[0].value);
    }
  }, [selectedTileFormat, tileOptions]);

  // Calculate prices based on inputs
  const squareMetersWithCuttingLoss = squareMeters * 1.1;
  
  const tileCost = tilePricePerSqm && !wantsToBuyTiles
    ? squareMetersWithCuttingLoss * tilePricePerSqm 
    : 0;
  
  const selectedTileOption = tileOptions.find(option => option.value === selectedTileFormat);
  const pricePerSqm = selectedTileFormat === 'romeins'
    ? basePricePerSqm * 1.25
    : selectedTileOption?.price_per_sqm || basePricePerSqm;
  
  const installationPrice = selectedTileFormat && squareMeters > 0
    ? pricePerSqm * squareMeters
    : null;

  const calculatedPrice = installationPrice !== null
    ? !wantsToBuyTiles ? installationPrice + tileCost : installationPrice
    : null;

  return {
    selectedTileFormat,
    setSelectedTileFormat,
    squareMeters,
    setSquareMeters,
    calculatedPrice,
    installationPrice,
    tileOptions,
    isLoading,
    connectionError,
    appointmentDialogOpen,
    setAppointmentDialogOpen,
    basePricePerSqm,
    wantsToBuyTiles,
    setWantsToBuyTiles,
    tilePricePerSqm,
    setTilePricePerSqm,
    squareMetersWithCuttingLoss,
    tileCost,
    retryConnection,
    connectionAttempts
  };
}
