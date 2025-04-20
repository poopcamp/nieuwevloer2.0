
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if the inspiration_tiles table exists in the database
 * Returns true if it exists, false if it doesn't
 */
export const checkInspirationTilesTableExists = async (): Promise<boolean> => {
  try {
    // Just try to query from the table
    const { error } = await supabase
      .from('inspiration_tiles')
      .select('id')
      .limit(1);
      
    // If there's no error, the table exists
    return !error;
    
  } catch (error) {
    console.error("Error checking if inspiration_tiles table exists:", error);
    return false;
  }
};
