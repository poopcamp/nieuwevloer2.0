
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { tableNames, ConfiguratorStep } from "@/utils/supabase/customTypes";

interface ConfiguratorStepFormValues {
  title: string;
  key: string;
  description?: string;
  is_active: boolean;
  project_type_id: string;
}

export const useConfiguratorSteps = (projectTypeId: string) => {
  const [steps, setSteps] = useState<ConfiguratorStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSteps = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from(tableNames.CONFIGURATOR_STEPS)
        .select('*')
        .eq('project_type_id', projectTypeId)
        .order('sort_order');
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Map database model to our Step interface
      const mappedData: ConfiguratorStep[] = data.map(item => ({
        id: item.id,
        project_type_id: item.project_type_id,
        title: item.title,
        key: item.key,
        description: item.description || '',
        is_active: item.is_active,
        sort_order: item.sort_order,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      
      setSteps(mappedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch steps';
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

  const createStep = async (step: ConfiguratorStepFormValues): Promise<boolean> => {
    try {
      setError(null);
      
      // Get the highest order to place new item at the end
      const highestOrder = steps.length > 0 
        ? Math.max(...steps.map(s => s.sort_order)) + 1 
        : 1;
      
      const { data, error } = await supabase
        .from(tableNames.CONFIGURATOR_STEPS)
        .insert({
          project_type_id: step.project_type_id,
          title: step.title,
          key: step.key,
          description: step.description || '',
          is_active: step.is_active,
          sort_order: highestOrder
        })
        .select();
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Map the returned data to our Step interface
      const newStep: ConfiguratorStep = {
        id: data[0].id,
        project_type_id: data[0].project_type_id,
        title: data[0].title,
        key: data[0].key,
        description: data[0].description,
        is_active: data[0].is_active,
        sort_order: data[0].sort_order,
        created_at: data[0].created_at,
        updated_at: data[0].updated_at
      };
      
      setSteps([...steps, newStep]);
      
      toast({
        title: "Succes",
        description: "Stap succesvol aangemaakt",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create step';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateStep = async (id: string, step: Partial<ConfiguratorStepFormValues>): Promise<boolean> => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from(tableNames.CONFIGURATOR_STEPS)
        .update({
          title: step.title,
          key: step.key,
          description: step.description || '',
          is_active: step.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      setSteps(
        steps.map(s => 
          s.id === id ? { 
            ...s, 
            ...step,
            updated_at: new Date().toISOString() 
          } : s
        )
      );
      
      toast({
        title: "Succes",
        description: "Stap succesvol bijgewerkt",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update step';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteStep = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      
      // First check if there are any fields associated with this step
      const { data: fields, error: fieldsError } = await supabase
        .from(tableNames.CONFIGURATOR_FIELDS)
        .select('id')
        .eq('step_id', id);
        
      if (fieldsError) {
        throw new Error(fieldsError.message);
      }
      
      if (fields && fields.length > 0) {
        throw new Error(`Deze stap bevat nog ${fields.length} velden. Verwijder eerst deze velden.`);
      }
      
      const { error } = await supabase
        .from(tableNames.CONFIGURATOR_STEPS)
        .delete()
        .eq('id', id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      setSteps(steps.filter(s => s.id !== id));
      
      toast({
        title: "Succes",
        description: "Stap succesvol verwijderd",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete step';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };
  
  const reorderSteps = async (reorderedItems: ConfiguratorStep[]): Promise<void> => {
    try {
      setError(null);
      
      // Update the order of each step
      for (const [index, item] of reorderedItems.entries()) {
        await supabase
          .from(tableNames.CONFIGURATOR_STEPS)
          .update({ sort_order: index + 1 })
          .eq('id', item.id);
      }
      
      // Update local state
      setSteps(reorderedItems.map((item, index) => ({
        ...item,
        sort_order: index + 1
      })));
      
      toast({
        title: "Succes",
        description: "Stappen succesvol herschikt",
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder steps';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      await fetchSteps(); // Reload the original order
    }
  };

  const duplicateStep = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      
      const stepToDuplicate = steps.find(s => s.id === id);
      
      if (!stepToDuplicate) {
        throw new Error('Stap niet gevonden');
      }
      
      // Get the highest order to place duplicated item at the end
      const highestOrder = Math.max(...steps.map(s => s.sort_order)) + 1;
      
      const { data, error } = await supabase
        .from(tableNames.CONFIGURATOR_STEPS)
        .insert({
          project_type_id: stepToDuplicate.project_type_id,
          title: `${stepToDuplicate.title} (Kopie)`,
          key: `${stepToDuplicate.key}_kopie`,
          description: stepToDuplicate.description || '',
          is_active: stepToDuplicate.is_active,
          sort_order: highestOrder
        })
        .select();
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Map the returned data to our Step interface
      const newStep: ConfiguratorStep = {
        id: data[0].id,
        project_type_id: data[0].project_type_id,
        title: data[0].title,
        key: data[0].key,
        description: data[0].description,
        is_active: data[0].is_active,
        sort_order: data[0].sort_order,
        created_at: data[0].created_at,
        updated_at: data[0].updated_at
      };
      
      setSteps([...steps, newStep]);
      
      toast({
        title: "Succes",
        description: "Stap succesvol gedupliceerd",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate step';
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
    if (projectTypeId) {
      fetchSteps();
    }
  }, [projectTypeId]);

  return {
    steps,
    loading,
    error,
    fetchSteps,
    createStep,
    updateStep,
    deleteStep,
    duplicateStep,
    reorderSteps
  };
};

export type { ConfiguratorStepFormValues };
