
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { tableNames, ConfiguratorField } from "@/utils/supabase/customTypes";
import { getDefaultOptionsForFieldType } from "../utils/field-utils";

interface ConfiguratorFieldFormValues {
  key: string;
  field_type: string;
  label: string;
  description?: string;
  placeholder?: string;
  default_value?: any;
  options?: any;
  validation_rules?: any;
  price_impact?: any;
  conditional_logic?: any;
  is_required: boolean;
  is_active: boolean;
  step_id: string;
}

export const useConfiguratorFields = (stepId: string) => {
  const [fields, setFields] = useState<ConfiguratorField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFields = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from(tableNames.CONFIGURATOR_FIELDS)
        .select('*')
        .eq('step_id', stepId)
        .order('sort_order');
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Map database model to our Field interface
      const mappedData: ConfiguratorField[] = data.map(item => ({
        id: item.id,
        step_id: item.step_id,
        key: item.key,
        field_type: item.field_type,
        label: item.label,
        description: item.description || '',
        placeholder: item.placeholder || '',
        default_value: item.default_value || null,
        options: item.options || null,
        validation_rules: item.validation_rules || null,
        price_impact: item.price_impact || null,
        conditional_logic: item.conditional_logic || null,
        is_required: item.is_required,
        is_active: item.is_active,
        sort_order: item.sort_order,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      
      setFields(mappedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch fields';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createField = async (field: ConfiguratorFieldFormValues): Promise<boolean> => {
    try {
      setError(null);
      
      // Get the highest order to place new item at the end
      const highestOrder = fields.length > 0 
        ? Math.max(...fields.map(f => f.sort_order)) + 1 
        : 1;
      
      // Set default options based on field type if not provided
      if (!field.options && ["select", "radio", "checkbox"].includes(field.field_type)) {
        field.options = getDefaultOptionsForFieldType(field.field_type);
      }
      
      const { data, error } = await supabase
        .from(tableNames.CONFIGURATOR_FIELDS)
        .insert({
          step_id: field.step_id,
          key: field.key,
          field_type: field.field_type,
          label: field.label,
          description: field.description || '',
          placeholder: field.placeholder || '',
          default_value: field.default_value || null,
          options: field.options || null,
          validation_rules: field.validation_rules || null,
          price_impact: field.price_impact || null,
          conditional_logic: field.conditional_logic || null,
          is_required: field.is_required,
          is_active: field.is_active,
          sort_order: highestOrder
        })
        .select();
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Map the returned data to our Field interface
      const newField: ConfiguratorField = {
        id: data[0].id,
        step_id: data[0].step_id,
        key: data[0].key,
        field_type: data[0].field_type,
        label: data[0].label,
        description: data[0].description,
        placeholder: data[0].placeholder,
        default_value: data[0].default_value,
        options: data[0].options,
        validation_rules: data[0].validation_rules,
        price_impact: data[0].price_impact,
        conditional_logic: data[0].conditional_logic,
        is_required: data[0].is_required,
        is_active: data[0].is_active,
        sort_order: data[0].sort_order,
        created_at: data[0].created_at,
        updated_at: data[0].updated_at
      };
      
      setFields([...fields, newField]);
      
      toast({
        title: "Succes",
        description: "Veld succesvol aangemaakt",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create field';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateField = async (id: string, field: Partial<ConfiguratorFieldFormValues>): Promise<boolean> => {
    try {
      setError(null);
      
      // Set default options based on field type if not provided but required
      if (field.field_type && !field.options && ["select", "radio", "checkbox"].includes(field.field_type)) {
        field.options = getDefaultOptionsForFieldType(field.field_type);
      }
      
      const { error } = await supabase
        .from(tableNames.CONFIGURATOR_FIELDS)
        .update({
          key: field.key,
          field_type: field.field_type,
          label: field.label,
          description: field.description || '',
          placeholder: field.placeholder || '',
          default_value: field.default_value || null,
          options: field.options || null,
          validation_rules: field.validation_rules || null,
          price_impact: field.price_impact || null,
          conditional_logic: field.conditional_logic || null,
          is_required: field.is_required,
          is_active: field.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      setFields(
        fields.map(f => 
          f.id === id ? { 
            ...f, 
            ...field,
            updated_at: new Date().toISOString() 
          } : f
        )
      );
      
      toast({
        title: "Succes",
        description: "Veld succesvol bijgewerkt",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update field';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteField = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from(tableNames.CONFIGURATOR_FIELDS)
        .delete()
        .eq('id', id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      setFields(fields.filter(f => f.id !== id));
      
      toast({
        title: "Succes",
        description: "Veld succesvol verwijderd",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete field';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };
  
  const reorderFields = async (reorderedItems: ConfiguratorField[]): Promise<void> => {
    try {
      setError(null);
      
      // Update the order of each field
      for (const [index, item] of reorderedItems.entries()) {
        await supabase
          .from(tableNames.CONFIGURATOR_FIELDS)
          .update({ sort_order: index + 1 })
          .eq('id', item.id);
      }
      
      // Update local state
      setFields(reorderedItems.map((item, index) => ({
        ...item,
        sort_order: index + 1
      })));
      
      toast({
        title: "Succes",
        description: "Velden succesvol herschikt",
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder fields';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      await fetchFields(); // Reload the original order
    }
  };

  const duplicateField = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      
      const fieldToDuplicate = fields.find(f => f.id === id);
      
      if (!fieldToDuplicate) {
        throw new Error('Veld niet gevonden');
      }
      
      // Get the highest order to place duplicated item at the end
      const highestOrder = Math.max(...fields.map(f => f.sort_order)) + 1;
      
      const { data, error } = await supabase
        .from(tableNames.CONFIGURATOR_FIELDS)
        .insert({
          step_id: fieldToDuplicate.step_id,
          key: `${fieldToDuplicate.key}_kopie`,
          field_type: fieldToDuplicate.field_type,
          label: `${fieldToDuplicate.label} (Kopie)`,
          description: fieldToDuplicate.description || '',
          placeholder: fieldToDuplicate.placeholder || '',
          default_value: fieldToDuplicate.default_value,
          options: fieldToDuplicate.options,
          validation_rules: fieldToDuplicate.validation_rules,
          price_impact: fieldToDuplicate.price_impact,
          conditional_logic: fieldToDuplicate.conditional_logic,
          is_required: fieldToDuplicate.is_required,
          is_active: fieldToDuplicate.is_active,
          sort_order: highestOrder
        })
        .select();
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Map the returned data to our Field interface
      const newField: ConfiguratorField = {
        id: data[0].id,
        step_id: data[0].step_id,
        key: data[0].key,
        field_type: data[0].field_type,
        label: data[0].label,
        description: data[0].description,
        placeholder: data[0].placeholder,
        default_value: data[0].default_value,
        options: data[0].options,
        validation_rules: data[0].validation_rules,
        price_impact: data[0].price_impact,
        conditional_logic: data[0].conditional_logic,
        is_required: data[0].is_required,
        is_active: data[0].is_active,
        sort_order: data[0].sort_order,
        created_at: data[0].created_at,
        updated_at: data[0].updated_at
      };
      
      setFields([...fields, newField]);
      
      toast({
        title: "Succes",
        description: "Veld succesvol gedupliceerd",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate field';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (stepId) {
      fetchFields();
    }
  }, [stepId]);

  return {
    fields,
    loading,
    error,
    fetchFields,
    createField,
    updateField,
    deleteField,
    duplicateField,
    reorderFields
  };
};

export type { ConfiguratorFieldFormValues };
