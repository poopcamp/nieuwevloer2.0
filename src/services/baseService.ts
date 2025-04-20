
import { supabase } from "@/integrations/supabase/client";
import { handleServiceError } from "@/utils/errorHandling";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";

/**
 * Type representing all valid table names in our Supabase database
 * This helps with type safety while still allowing string keys to be used
 */
export type TableNames = keyof Database['public']['Tables'] | string;

/**
 * Base service with common Supabase functionality and error handling
 */
export const baseService = {
  /**
   * Performs a select query with standardized error handling
   */
  async select<T>(
    table: TableNames,
    columns: string = '*',
    queryFn?: (query: any) => any
  ): Promise<T[]> {
    try {
      // Cast to any to avoid TypeScript issues with string vs literal types
      let query = supabase.from(table as any).select(columns);
      
      if (queryFn) {
        query = queryFn(query);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data || []) as T[];
    } catch (error) {
      handleServiceError(error, `baseService.select(${table})`);
      return []; // Return empty array on error
    }
  },
  
  /**
   * Performs an insert operation with standardized error handling
   */
  async insert<T>(
    table: TableNames,
    data: Record<string, any>
  ): Promise<T | null> {
    try {
      const { data: result, error }: PostgrestSingleResponse<any> = await supabase
        .from(table as any)
        .insert(data)
        .select();
        
      if (error) throw error;
      
      if (!result || result.length === 0) {
        throw new Error(`Failed to insert data into ${table}`);
      }
      
      return Array.isArray(result) ? result[0] as T : result as T;
    } catch (error) {
      throw handleServiceError(error, `baseService.insert(${table})`);
    }
  },
  
  /**
   * Performs a batch insert operation with standardized error handling
   */
  async batchInsert<T>(
    table: TableNames,
    dataArray: Record<string, any>[]
  ): Promise<T[] | null> {
    try {
      const { data: result, error }: PostgrestSingleResponse<any> = await supabase
        .from(table as any)
        .insert(dataArray)
        .select();
        
      if (error) throw error;
      
      if (!result || result.length === 0) {
        throw new Error(`Failed to insert batch data into ${table}`);
      }
      
      return result as T[];
    } catch (error) {
      throw handleServiceError(error, `baseService.batchInsert(${table})`);
    }
  },
  
  /**
   * Performs an update operation with standardized error handling
   */
  async update(
    table: TableNames,
    data: Record<string, any>,
    columnName: string,
    value: any
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from(table as any)
        .update(data)
        .eq(columnName, value);
        
      if (error) throw error;
    } catch (error) {
      throw handleServiceError(error, `baseService.update(${table})`);
    }
  },
  
  /**
   * Performs a delete operation with standardized error handling
   */
  async delete(table: TableNames, columnName: string, value: any): Promise<void> {
    try {
      const { error } = await supabase
        .from(table as any)
        .delete()
        .eq(columnName, value);
        
      if (error) throw error;
    } catch (error) {
      throw handleServiceError(error, `baseService.delete(${table})`);
    }
  }
};
