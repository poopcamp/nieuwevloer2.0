
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuickCalculatorTile, tableNames } from "@/utils/supabase/customTypes";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";

export function useQuickCalculatorTiles() {
  const [tileOptions, setTileOptions] = useState<QuickCalculatorTile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const { toast } = useToast();

  // Fallback data voor het geval er geen verbinding is met de database
  const getFallbackData = (): QuickCalculatorTile[] => {
    const now = new Date().toISOString();
    return [
      { id: "fallback-1", value: "30x30", label: "30 x 30 cm", price_per_sqm: 45, created_at: now, updated_at: now },
      { id: "fallback-2", value: "60x60", label: "60 x 60 cm", price_per_sqm: 50, created_at: now, updated_at: now },
      { id: "fallback-3", value: "80x80", label: "80 x 80 cm", price_per_sqm: 65, created_at: now, updated_at: now },
      { id: "fallback-4", value: "90x90", label: "90 x 90 cm", price_per_sqm: 75, created_at: now, updated_at: now }
    ];
  };

  // Fetch all tile options
  const fetchTileOptions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching quick calculator tiles...");
      
      // Set a timeout for the request (3 seconds)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database request timed out after 3 seconds')), 3000);
      });
      
      // Race between the actual fetch and the timeout
      const result = await Promise.race([
        supabase
          .from(tableNames.QUICK_CALCULATOR_TILES)
          .select("*")
          .order('value'),
        timeoutPromise
      ]);
      
      // Type assertion to handle the response
      const { data, error } = result as { data: QuickCalculatorTile[] | null, error: any };

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        console.log("No tile options found in database");
        setTileOptions(getFallbackData());
        setError("Geen tegelopties gevonden in de database. Voeg tegelopties toe om te beginnen.");
      } else {
        console.log(`Found ${data.length} tile options`, data);
        setTileOptions(data);
        setError(null);
      }
      
    } catch (error: any) {
      console.error("Error fetching tile options:", error.message);
      
      // Gebruik fallback data bij een fout
      setTileOptions(getFallbackData());
      setError(`Database fout: ${error.message}. Fallback data wordt gebruikt.`);
      
      toast({
        title: "Fout bij ophalen tegelopties",
        description: error.message,
        variant: "destructive",
      });
      
      // Toon een permanente toast met de sonner toast voor kritieke verbindingsfouten
      sonnerToast.error("Database verbindingsfout", {
        description: "Controleer de RLS policies en databaserechten",
        duration: 10000,
        action: {
          label: "Probeer opnieuw",
          onClick: () => retryConnection(),
        },
      });
      
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Retry connection function
  const retryConnection = useCallback(() => {
    setConnectionAttempts(prev => prev + 1);
    sonnerToast.success("Opnieuw verbinden...");
  }, []);

  // Add a new tile option
  const addTileOption = async (tileOption: Omit<QuickCalculatorTile, "id" | "created_at" | "updated_at">) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from(tableNames.QUICK_CALCULATOR_TILES)
        .insert([tileOption])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setTileOptions(prev => [...prev, data]);
      toast({
        title: "Tegeloptie toegevoegd",
        description: `${tileOption.label} is succesvol toegevoegd.`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Error adding tile option:", error.message);
      toast({
        title: "Fout bij toevoegen tegeloptie",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update an existing tile option
  const updateTileOption = async (id: string, updates: Partial<QuickCalculatorTile>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from(tableNames.QUICK_CALCULATOR_TILES)
        .update(updates)
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTileOptions(prev => 
        prev.map(option => option.id === id ? { ...option, ...updates } : option)
      );
      
      toast({
        title: "Tegeloptie bijgewerkt",
        description: `De tegeloptie is succesvol bijgewerkt.`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Error updating tile option:", error.message);
      toast({
        title: "Fout bij bijwerken tegeloptie",
        description: error.message,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a tile option
  const deleteTileOption = async (id: string) => {
    if (!window.confirm('Weet u zeker dat u deze tegeloptie wilt verwijderen?')) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from(tableNames.QUICK_CALCULATOR_TILES)
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTileOptions(prev => prev.filter(option => option.id !== id));
      
      toast({
        title: "Tegeloptie verwijderd",
        description: `De tegeloptie is succesvol verwijderd.`,
      });
    } catch (error: any) {
      console.error("Error deleting tile option:", error.message);
      toast({
        title: "Fout bij verwijderen tegeloptie",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load data on component mount or when retry is triggered
  useEffect(() => {
    fetchTileOptions();
  }, [fetchTileOptions, connectionAttempts]);

  return {
    tileOptions,
    isLoading,
    isSubmitting,
    error,
    addTileOption,
    updateTileOption,
    deleteTileOption,
    refreshTileOptions: fetchTileOptions,
    retryConnection
  };
}
