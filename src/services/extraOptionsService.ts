
import { supabase } from "@/integrations/supabase/client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { ExtraOption } from "@/components/admin/tile-management/extra-options/types";
import { handleServiceError } from "@/utils/errorHandling";
import { baseService } from "./baseService";

/**
 * Service for handling CRUD operations on extra options
 */
export const extraOptionsService = {
  // Fetch all extra options
  async fetchExtraOptions(): Promise<ExtraOption[]> {
    try {
      const data = await baseService.select<ExtraOption>('extra_options', '*', 
        (query) => query.order('name')
      );
      
      return data;
    } catch (error) {
      handleServiceError(error, 'extraOptionsService.fetchExtraOptions');
      return []; // Return empty array on error for consistency
    }
  },
  
  // Add a new extra option
  async addExtraOption(name: string, price: number, project_type: string | null = null): Promise<ExtraOption> {
    try {
      const result = await baseService.insert<ExtraOption>('extra_options', {
        name, 
        price, 
        project_type
      });
      
      if (!result) {
        throw new Error('Failed to create extra option');
      }
      
      return result;
    } catch (error) {
      throw handleServiceError(error, 'extraOptionsService.addExtraOption');
    }
  },
  
  // Update an existing extra option
  async updateExtraOption(id: string, name: string, price: number, project_type: string | null = null): Promise<void> {
    try {
      await baseService.update('extra_options', { name, price, project_type }, 'id', id);
    } catch (error) {
      throw handleServiceError(error, 'extraOptionsService.updateExtraOption');
    }
  },
  
  // Delete an extra option
  async deleteExtraOption(id: string): Promise<void> {
    try {
      await baseService.delete('extra_options', 'id', id);
    } catch (error) {
      throw handleServiceError(error, 'extraOptionsService.deleteExtraOption');
    }
  },
  
  // Fetch extra options by project type
  async fetchExtraOptionsByProjectType(projectType: string | null): Promise<ExtraOption[]> {
    try {
      return await baseService.select<ExtraOption>('extra_options', '*', (query) => {
        let q = query.order('name');
        
        if (projectType) {
          // If project type is provided, fetch options specific to that project 
          // or options that are available for all projects (null project_type)
          q = q.or(`project_type.eq.${projectType},project_type.is.null`);
        }
        
        return q;
      });
    } catch (error) {
      handleServiceError(error, 'extraOptionsService.fetchExtraOptionsByProjectType');
      return []; // Return empty array on error for consistency
    }
  },

  // Helper method to map data to ExtraOption interface
  mapExtraOptionData(item: any): ExtraOption {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      project_type: item.project_type || null,
      created_at: item.created_at,
      updated_at: item.updated_at
    };
  },

  // Helper method to map an array of data to ExtraOption[] interface
  mapExtraOptionsData(data: any[]): ExtraOption[] {
    return data.map(item => this.mapExtraOptionData(item));
  }
};
