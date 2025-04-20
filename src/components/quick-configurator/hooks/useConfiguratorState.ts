
import { useState, useCallback } from "react";
import { QuickConfiguratorState } from "./types";

export function useConfiguratorState(initialTileOptions: any[]) {
  const [selectedTileFormat, setSelectedTileFormat] = useState<string>("");
  const [squareMeters, setSquareMeters] = useState<number>(15);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [wantsToBuyTiles, setWantsToBuyTiles] = useState<boolean>(true);
  const [tilePricePerSqm, setTilePricePerSqm] = useState<number | null>(null);

  // Initialize tile format selection if available
  const initializeSelectedFormat = useCallback((options: any[]) => {
    if (options && options.length > 0 && !selectedTileFormat) {
      setSelectedTileFormat(options[0].value);
    }
  }, [selectedTileFormat]);

  return {
    selectedTileFormat,
    setSelectedTileFormat,
    squareMeters,
    setSquareMeters,
    appointmentDialogOpen,
    setAppointmentDialogOpen,
    wantsToBuyTiles,
    setWantsToBuyTiles,
    tilePricePerSqm,
    setTilePricePerSqm,
    initializeSelectedFormat
  };
}
