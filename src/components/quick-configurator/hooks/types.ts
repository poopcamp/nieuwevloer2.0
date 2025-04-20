
import { tableNames } from "@/utils/supabase/customTypes";

export type TileOption = {
  id: string;
  value: string;
  label: string;
  price_per_sqm: number;
};

export interface QuickConfiguratorState {
  selectedTileFormat: string;
  squareMeters: number;
  appointmentDialogOpen: boolean;
  wantsToBuyTiles: boolean;
  tilePricePerSqm: number | null;
  tileOptions: TileOption[];
  basePricePerSqm: number;
  isLoading: boolean;
  connectionError: string | null;
  connectionAttempts: number;
}

export interface PriceCalculation {
  squareMetersWithCuttingLoss: number;
  tileCost: number;
  installationPrice: number | null;
  calculatedPrice: number | null;
}

export interface DataFetchResult<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  retry: () => void;
}

export type RetryFunction = () => void;
