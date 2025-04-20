
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ConfiguratorState, DEFAULT_STATE } from '../types';

export function useSavedConfiguration() {
  const [state, setState] = useState<ConfiguratorState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedSavedConfig, setHasLoadedSavedConfig] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const tryLoadSavedConfig = async () => {
      // Try to get saved configuration from local storage
      const savedConfigString = localStorage.getItem('configuratorState');

      if (savedConfigString) {
        try {
          const savedConfig = JSON.parse(savedConfigString);
          setState(prev => ({ ...prev, ...savedConfig }));
          setHasLoadedSavedConfig(true);
          
          toast({
            title: "Configuratie geladen",
            description: "We hebben uw laatst opgeslagen configuratie geladen.",
          });
        } catch (error) {
          console.error("Error parsing saved configuration:", error);
        }
      }
    };

    tryLoadSavedConfig();
  }, []);

  // Save state to local storage whenever it changes
  useEffect(() => {
    if (state.projectType) {
      localStorage.setItem('configuratorState', JSON.stringify(state));
    }
  }, [state]);

  const updateState = (updates: Partial<ConfiguratorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Function to save the current configuration to Supabase
  const saveConfiguration = async () => {
    setIsLoading(true);
    
    try {
      // Basic validation
      if (!state.name || !state.email || !state.phone) {
        toast({
          title: "Ontbrekende gegevens",
          description: "Vul a.u.b. alle verplichte velden in.",
          variant: "destructive",
        });
        return false;
      }
      
      // Calculate tile costs if needed
      let tileCost = null;
      if (state.wantsToBuyTiles && state.squareMeters && state.tilePricePerSqm) {
        const squareMetersWithCuttingLoss = state.squareMeters * 1.1; // 10% cutting loss
        tileCost = squareMetersWithCuttingLoss * state.tilePricePerSqm;
      }
      
      // Convert state to database format
      const dbData = {
        name: state.name,
        email: state.email,
        phone: state.phone,
        project_type: state.projectType,
        square_meters: state.squareMeters,
        floor_type: state.floorType,
        tile_size: state.tileSize,
        need_plinths: state.needsPlinths,
        // Note: tile_pattern isn't in the database schema, so we'll omit it
        wall_type: state.wallType,
        wall_tile_size: state.wallTileSize,
        bathroom_options: state.bathroomOptions,
        bathroom_tile_size: state.bathroomTileSize,
        other_description: state.otherDescription,
        needs_chape: state.needsChape,
        needs_electrician: state.needsElectrician,
        address_street: state.addressStreet,
        address_city: state.addressCity,
        additional_notes: state.additionalNotes,
        wants_showroom_visit: state.wantsShowroomVisit,
        wants_site_visit: state.wantsSiteVisit,
        shower_nis: state.showerNis,
        shower_nis_size: state.showerNisSize,
        shower_nis_custom_size: state.showerNisCustomSize,
        full_bathroom_renovation: state.fullBathroomRenovation,
        wants_to_buy_tiles: state.wantsToBuyTiles,
        tile_price_per_sqm: state.tilePricePerSqm,
        tile_cost: tileCost
      };
      
      const { error } = await supabase
        .from('configurations')
        .insert(dbData);
      
      if (error) {
        console.error("Error saving configuration:", error);
        toast({
          title: "Fout bij opslaan",
          description: "Er is een fout opgetreden bij het opslaan van uw configuratie.",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Configuratie opgeslagen",
        description: "Uw configuratie is succesvol opgeslagen.",
      });
      
      return true;
    } catch (error) {
      console.error("Unexpected error saving configuration:", error);
      toast({
        title: "Onverwachte fout",
        description: "Er is een onverwachte fout opgetreden. Probeer het later opnieuw.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load a saved configuration from Supabase by ID
  const loadConfigurationById = async (id: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('configurations')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !data) {
        console.error("Error loading configuration:", error);
        return false;
      }
      
      // Convert database format back to state
      const updateStateFromSavedData = (data: any): Partial<ConfiguratorState> => {
        return {
          name: data.name,
          email: data.email,
          phone: data.phone,
          projectType: data.project_type as ConfiguratorState["projectType"],
          squareMeters: data.square_meters,
          floorType: data.floor_type,
          tileSize: data.tile_size,
          needsPlinths: data.need_plinths,
          tilePattern: "recht", // Use a default value since it's not in the database
          wallType: data.wall_type,
          wallTileSize: data.wall_tile_size,
          bathroomOptions: data.bathroom_options,
          bathroomTileSize: data.bathroom_tile_size,
          otherDescription: data.other_description,
          needsChape: data.needs_chape,
          needsElectrician: data.needs_electrician,
          addressStreet: data.address_street,
          addressCity: data.address_city,
          additionalNotes: data.additional_notes,
          wantsShowroomVisit: data.wants_showroom_visit,
          wantsSiteVisit: data.wants_site_visit,
          showerNis: data.shower_nis,
          showerNisSize: data.shower_nis_size,
          showerNisCustomSize: data.shower_nis_custom_size,
          fullBathroomRenovation: data.full_bathroom_renovation,
          hasHolidayDiscount: false, // Use a default value since it's not in the database
          wantsToBuyTiles: data.wants_to_buy_tiles || false,
          tilePricePerSqm: data.tile_price_per_sqm || null
        };
      };
      
      updateState(updateStateFromSavedData(data));
      
      setHasLoadedSavedConfig(true);
      
      return true;
    } catch (error) {
      console.error("Unexpected error loading configuration:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    state,
    updateState,
    saveConfiguration,
    loadConfigurationById,
    isLoading,
    hasLoadedSavedConfig
  };
}
