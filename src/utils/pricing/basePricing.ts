import { supabase } from "@/integrations/supabase/client";

// Functie om basisprijzen op te halen
export const getBasePrices = async () => {
  try {
    const { data, error } = await supabase
      .from('pricing_info')
      .select('*')
      .single();
      
    if (error) throw error;
    
    return {
      basePricePerSqm: data.base_m2_price || 45,
      minimumPrice: data.minimum_price || 500,
      bathRoomBasePrice: data.base_bathroom_price || 1200,
      kitchenBasePrice: data.base_kitchen_price || 950,
      cuttingLossPercentage: data.cutting_loss_percentage || 10
    };
  } catch (error) {
    console.error("Fout bij het ophalen van basisprijzen:", error);
    // Fallback prijzen
    return {
      basePricePerSqm: 45,
      minimumPrice: 500,
      bathRoomBasePrice: 1200,
      kitchenBasePrice: 950,
      cuttingLossPercentage: 10
    };
  }
};

// Functie om prijsmultiplier voor tegelformaten op te halen
export const getTileFormatMultiplier = async (formatName: string, isFloor: boolean = true) => {
  try {
    const { data, error } = await supabase
      .from('calculator_rates')
      .select('value')
      .eq('project_type', isFloor ? 'vloer' : 'wand')
      .eq('section_id', isFloor ? 'formaten' : 'wand_formaten')
      .eq('name', formatName)
      .maybeSingle();
      
    if (error) throw error;
    
    return data?.value || 1.0;
  } catch (error) {
    console.error(`Fout bij het ophalen van multiplier voor ${formatName}:`, error);
    return 1.0; // Default multiplier
  }
};

// Functie om prijsmultiplier voor tegeltypes op te halen
export const getTileTypeMultiplier = async (typeName: string, isFloor: boolean = true) => {
  try {
    const { data, error } = await supabase
      .from('calculator_rates')
      .select('value')
      .eq('project_type', isFloor ? 'vloer' : 'wand')
      .eq('section_id', isFloor ? 'types' : 'wand_types')
      .eq('name', typeName)
      .maybeSingle();
      
    if (error) throw error;
    
    return data?.value || 1.0;
  } catch (error) {
    console.error(`Fout bij het ophalen van multiplier voor ${typeName}:`, error);
    return 1.0; // Default multiplier
  }
};

// Helper functie voor standaard berekening van prijs op basis van tegelformaat
export const getPriceByArea = (tileSize: string, area: number) => {
  // Standaard prijzen per m² op basis van tegelformaat
  const tileSizePrices: { [key: string]: number } = {
    "30x30": 45,
    "60x60": 50,
    "80x80": 60,
    "90x90": 70,
    "100x100": 80,
    "120x60": 75,
    "120x120": 110,
    "parket": 65
  };
  
  return tileSizePrices[tileSize] || 45; // Default naar basisprijs als formaat niet bekend is
};

// Helper functie voor multipliers voor vloertypes
export const getFloorTypeMultiplier = (floorType: string): number => {
  const typeMultipliers: { [key: string]: number } = {
    "betonlook": 1.0,
    "marmerlook": 1.15,
    "houtlook": 1.2,
    "natuursteen": 1.3,
    "keramisch": 1.0
  };
  
  return typeMultipliers[floorType] || 1.0;
};
