
import { supabase } from "@/integrations/supabase/client";

export interface CalculatorRate {
  id: string;
  section_id: string;
  project_type: string;
  name: string;
  value: number;
  rate_key: string;
  created_at: string;
  updated_at: string;
}

export interface TileFormat {
  id: string;
  format_name: string;
  price_multiplier: number;  // Nu vertegenwoordigt dit direct de prijs per m²
  rate_key: string;
  created_at?: string;
  updated_at?: string;
  type: 'floor' | 'wall';
}

/**
 * Service for handling calculator-related operations
 */
export const calculatorService = {
  /**
   * Check database access and RLS policies
   */
  async checkAccess(): Promise<{
    success: boolean;
    error: string | null;
  }> {
    try {
      // Try a simple query to check if we have access
      const { data, error } = await supabase
        .from('calculator_rates')
        .select('id')
        .limit(1);
        
      if (error) {
        console.error("Database access check failed:", error);
        return { 
          success: false, 
          error: error.message 
        };
      }
      
      return { 
        success: true, 
        error: null 
      };
    } catch (error: any) {
      console.error("Error checking database access:", error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },
  
  /**
   * Fetch tile formats from calculator_rates table
   */
  async getTileFormats(type: 'floor' | 'wall'): Promise<{ 
    data: TileFormat[] | null; 
    error: string | null; 
    usingFallback: boolean;
  }> {
    const sectionId = type === 'floor' ? 'formaten' : 'wand_formaten';
    const projectType = type === 'floor' ? 'vloer' : 'wand';
    
    try {
      // Actual fetch request - no timeout
      const { data, error } = await supabase
        .from('calculator_rates')
        .select('*')
        .eq('project_type', projectType)
        .eq('section_id', sectionId)
        .order('name');
        
      if (error) {
        console.error(`Error fetching ${type} formats:`, error);
        return { 
          data: null, 
          error: error.message,
          usingFallback: false
        };
      }
      
      // Transform data to the right format
      // Note: value now directly represents price per m², not a multiplier
      const transformedData = (data || []).map((item: any): TileFormat => ({
        id: item.id,
        format_name: item.name,
        price_multiplier: item.value, // Nu direct prijs per m²
        rate_key: item.rate_key,
        created_at: item.created_at,
        updated_at: item.updated_at,
        type
      }));
      
      if (transformedData.length === 0) {
        return {
          data: [],
          error: null,
          usingFallback: false
        };
      }
      
      return { 
        data: transformedData, 
        error: null,
        usingFallback: false
      };
    } catch (error: any) {
      console.error("Error fetching tile formats:", error);
      return { 
        data: null, 
        error: error.message,
        usingFallback: false
      };
    }
  },
  
  /**
   * Create a new tile format
   */
  async createTileFormat(type: 'floor' | 'wall', name: string, pricePerSqm: number): Promise<{
    data: TileFormat | null;
    error: string | null;
  }> {
    const sectionId = type === 'floor' ? 'formaten' : 'wand_formaten';
    const projectType = type === 'floor' ? 'vloer' : 'wand';
    
    try {
      // Generate a unique rate_key based on the name
      const rate_key = name
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '')
        + '_' + Date.now().toString().substring(9, 13);
      
      const { data, error } = await supabase
        .from('calculator_rates')
        .insert({
          section_id: sectionId,
          project_type: projectType,
          name: name,
          value: pricePerSqm, // Direct price per m²
          rate_key: rate_key
        })
        .select();
        
      if (error) {
        console.error("Error creating format:", error);
        return { 
          data: null, 
          error: error.message 
        };
      }
      
      if (!data || data.length === 0) {
        return { 
          data: null, 
          error: 'Geen data teruggegeven bij creatie.' 
        };
      }
      
      return { 
        data: {
          id: data[0].id,
          format_name: data[0].name,
          price_multiplier: data[0].value, // Direct price per m²
          rate_key: data[0].rate_key,
          created_at: data[0].created_at,
          updated_at: data[0].updated_at,
          type
        }, 
        error: null 
      };
    } catch (error: any) {
      console.error("Error creating tile format:", error);
      return { 
        data: null, 
        error: error.message 
      };
    }
  },
  
  /**
   * Update an existing tile format
   */
  async updateTileFormat(id: string, pricePerSqm: number): Promise<{
    success: boolean;
    error: string | null;
  }> {
    try {
      const { error } = await supabase
        .from('calculator_rates')
        .update({ 
          value: pricePerSqm, // Direct prijs per m²
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        console.error("Error updating format:", error);
        return { 
          success: false, 
          error: error.message 
        };
      }
      
      return { 
        success: true, 
        error: null 
      };
    } catch (error: any) {
      console.error("Error updating tile format:", error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },
  
  /**
   * Delete a tile format
   */
  async deleteTileFormat(id: string): Promise<{
    success: boolean;
    error: string | null;
  }> {
    try {
      const { error } = await supabase
        .from('calculator_rates')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("Error deleting format:", error);
        return { 
          success: false, 
          error: error.message 
        };
      }
      
      return { 
        success: true, 
        error: null 
      };
    } catch (error: any) {
      console.error("Error deleting tile format:", error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  /**
   * Create sample tile formats for a specific type
   */
  async createSampleFormats(type: 'floor' | 'wall'): Promise<{
    success: boolean;
    count: number;
    error: string | null;
  }> {
    const sectionId = type === 'floor' ? 'formaten' : 'wand_formaten';
    const projectType = type === 'floor' ? 'vloer' : 'wand';
    
    const samples = type === 'floor' 
      ? [
          { name: '60 x 60 cm', pricePerSqm: 45 },
          { name: '80 x 80 cm', pricePerSqm: 55 },
          { name: '90 x 90 cm', pricePerSqm: 65 },
          { name: '120 x 60 cm', pricePerSqm: 75 },
          { name: '120 x 120 cm', pricePerSqm: 85 },
        ]
      : [
          { name: '30 x 60 cm', pricePerSqm: 42 },
          { name: '60 x 60 cm', pricePerSqm: 48 },
          { name: '30 x 90 cm', pricePerSqm: 58 },
        ];
    
    try {
      // Check if there are already formats of this type to avoid duplicates
      const { data: existingData, error: checkError } = await supabase
        .from('calculator_rates')
        .select('id')
        .eq('project_type', projectType)
        .eq('section_id', sectionId);
      
      if (checkError) {
        console.error("Error checking existing formats:", checkError);
        return {
          success: false,
          count: 0,
          error: checkError.message
        };
      }
      
      if (existingData && existingData.length > 0) {
        return {
          success: true,
          count: 0,
          error: `Er bestaan al ${existingData.length} formaten van dit type.`
        };
      }
      
      // Prepare the sample data
      const sampleData = samples.map(sample => ({
        section_id: sectionId,
        project_type: projectType,
        name: sample.name,
        value: sample.pricePerSqm, // Direct prijs per m²
        rate_key: sample.name
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-z0-9_]/g, '')
      }));
      
      // Insert the samples
      const { data, error } = await supabase
        .from('calculator_rates')
        .insert(sampleData)
        .select();
      
      if (error) {
        console.error("Error adding sample formats:", error);
        return {
          success: false,
          count: 0,
          error: error.message
        };
      }
      
      return {
        success: true,
        count: data?.length || 0,
        error: null
      };
    } catch (error: any) {
      console.error("Error adding sample formats:", error);
      return {
        success: false,
        count: 0,
        error: error.message
      };
    }
  }
};
