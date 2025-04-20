
import { supabase } from "@/integrations/supabase/client";
import { ConfigurationData } from "@/types/configuration";

/**
 * Save configuration data to the database
 * @param configData Configuration data to save
 */
export const saveConfiguration = async (configData: ConfigurationData): Promise<{ success: boolean; error?: string; data?: any }> => {
  try {
    // Ensure required fields are present
    if (!configData.name || !configData.email || !configData.phone) {
      throw new Error("Missing required fields: name, email, and phone are required");
    }
    
    const { data, error } = await supabase
      .from('configurations')
      .insert(configData)
      .select();
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to save configuration:", error);
    return { 
      success: false, 
      error: error.message || "Er is een fout opgetreden bij het opslaan van uw configuratie." 
    };
  }
};
