
import { baseService, TableNames } from "./baseService";
import { ConfiguratorState } from "@/components/configurator/types";
import { supabase } from "@/integrations/supabase/client";
import { ConfigurationData } from "@/types/configuration";

interface PriceBreakdown {
  basePrice: number;
  additionalOptions: { name: string; price: number }[];
  total: number;
}

interface ConfigurationOptions {
  id: string;
  name: string;
  price: number;
  project_type: string | null;
}

/**
 * Service for handling configuration-related operations
 */
export const configurationService = {
  /**
   * Saves a configuration to the database
   * @param configData Configuration data to save
   */
  async saveConfiguration(configData: ConfigurationData): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      // Ensure required fields are present to satisfy TypeScript
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
  },
  
  /**
   * Gets all available extra options
   * @param projectType Optional project type filter
   */
  async getExtraOptions(projectType: string | null = null): Promise<ConfigurationOptions[]> {
    try {
      return await baseService.select<ConfigurationOptions>('extra_options', '*', (query) => {
        let q = query.order('name');
        
        if (projectType) {
          // Include options for this project type OR options that apply to all project types
          q = q.or(`project_type.eq.${projectType},project_type.is.null`);
        }
        
        return q;
      });
    } catch (error) {
      console.error("Failed to fetch extra options:", error);
      return [];
    }
  },
  
  /**
   * Gets pricing information for quick calculations
   */
  async getQuickCalculatorTiles(): Promise<any[]> {
    try {
      return await baseService.select<any>('quick_calculator_tiles', '*', 
        (query) => query.order('label')
      );
    } catch (error) {
      console.error("Failed to fetch quick calculator tiles:", error);
      return [];
    }
  },
  
  /**
   * Calculates price based on configurator state
   * @param state Current configurator state
   * @returns Formatted price string
   */
  calculatePrice(state: ConfiguratorState): string {
    // Move the calculation logic from utils/configuratorPricing.ts here
    // This would be a longer implementation but centralizes the logic
    
    // For now, we'll return a placeholder
    return "0.00";
  },
  
  /**
   * Gets detailed price breakdown
   * @param state Current configurator state
   * @param totalPrice Total calculated price
   */
  getPriceBreakdown(state: ConfiguratorState, totalPrice: string): PriceBreakdown {
    // Implementation would be specific to requirements
    // This function would replace the similar function in utils/configuratorPricing.ts
    
    return {
      basePrice: parseFloat(totalPrice),
      additionalOptions: [],
      total: parseFloat(totalPrice)
    };
  }
};
