
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { tableNames } from "@/utils/supabase/customTypes";
import { TileOption, DataFetchResult } from "./types";
import { useQuery } from "@tanstack/react-query";

interface PricingInfo {
  base_m2_price: number;
}

export function useTileDataFetcher() {
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  // Default options to use as fallback
  const getDefaultOptions = (): TileOption[] => {
    return [
      { id: "1", value: "30x30", label: "30 x 30 cm", price_per_sqm: 45 },
      { id: "2", value: "60x60", label: "60 x 60 cm", price_per_sqm: 50 },
      { id: "3", value: "90x90", label: "90 x 90 cm", price_per_sqm: 75 },
      { id: "4", value: "120x120", label: "120 x 120 cm", price_per_sqm: 110 }
    ];
  };

  const retryConnection = useCallback(() => {
    setConnectionAttempts(prev => prev + 1);
  }, []);

  // Use React Query to fetch pricing info
  const { data: pricingData } = useQuery({
    queryKey: ['pricingInfo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_info')
        .select('base_m2_price')
        .single();
      
      if (error) throw error;
      return data as PricingInfo;
    },
    retry: 1,
    enabled: connectionAttempts < 3,
    meta: {
      onFailure: () => console.error("Failed to fetch pricing info")
    }
  });

  // Use React Query to fetch tile options
  const { data: tileOptionsData, isLoading } = useQuery({
    queryKey: ['tileOptions', connectionAttempts],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(tableNames.QUICK_CALCULATOR_TILES)
        .select("*")
        .order('value');
      
      if (error) throw error;
      if (!data || data.length === 0) {
        console.warn("No tile options found, using defaults");
        return getDefaultOptions();
      }
      
      return data as TileOption[];
    },
    retry: 1,
    enabled: connectionAttempts < 3,
    meta: {
      onFailure: (error: Error) => {
        console.error("Failed to fetch tile options:", error);
        setConnectionError("Kon tegelopties niet laden. Standaardopties worden gebruikt.");
      }
    },
    initialData: getDefaultOptions
  });

  const basePricePerSqm = pricingData?.base_m2_price || 45;
  const tileOptions = tileOptionsData || getDefaultOptions();

  return {
    tileOptions,
    basePricePerSqm,
    isLoading,
    connectionError,
    connectionAttempts,
    retryConnection
  };
}
