
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProjectType, ProjectTypeFormValues } from "../types";
import { tableNames } from "@/utils/supabase/customTypes";

export const useProjectTypes = () => {
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProjectTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from(tableNames.PROJECT_TYPES)
        .select('*')
        .order('sort_order');
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Map database model to our ProjectType interface
      const mappedData = data.map(item => ({
        id: item.id,
        name: item.name,
        key: item.key,
        description: item.description || '',
        icon: item.icon || '',
        isActive: item.is_active,
        sort_order: item.sort_order,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      
      setProjectTypes(mappedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch project types';
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

  const createProjectType = async (projectType: ProjectTypeFormValues): Promise<boolean> => {
    try {
      setError(null);
      
      // Get the highest order to place new item at the end
      const highestOrder = projectTypes.length > 0 
        ? Math.max(...projectTypes.map(pt => pt.sort_order)) + 1 
        : 1;
      
      const { data, error } = await supabase
        .from(tableNames.PROJECT_TYPES)
        .insert({
          name: projectType.name,
          key: projectType.key,
          description: projectType.description || '',
          icon: projectType.icon || '',
          is_active: projectType.isActive,
          sort_order: highestOrder
        })
        .select();
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Map the returned data to our ProjectType interface
      const newProjectType: ProjectType = {
        id: data[0].id,
        name: data[0].name,
        key: data[0].key,
        description: data[0].description,
        icon: data[0].icon,
        isActive: data[0].is_active,
        sort_order: data[0].sort_order,
        created_at: data[0].created_at,
        updated_at: data[0].updated_at
      };
      
      setProjectTypes([...projectTypes, newProjectType]);
      
      toast({
        title: "Success",
        description: "Project type created successfully",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project type';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateProjectType = async (id: string, projectType: ProjectTypeFormValues): Promise<boolean> => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from(tableNames.PROJECT_TYPES)
        .update({
          name: projectType.name,
          key: projectType.key,
          description: projectType.description || '',
          icon: projectType.icon || '',
          is_active: projectType.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      setProjectTypes(
        projectTypes.map(pt => 
          pt.id === id ? { 
            ...pt, 
            ...projectType, 
            isActive: projectType.isActive,
            updated_at: new Date().toISOString() 
          } : pt
        )
      );
      
      toast({
        title: "Success",
        description: "Project type updated successfully",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project type';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteProjectType = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from(tableNames.PROJECT_TYPES)
        .delete()
        .eq('id', id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      setProjectTypes(projectTypes.filter(pt => pt.id !== id));
      
      toast({
        title: "Success",
        description: "Project type deleted successfully",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project type';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };
  
  const reorderProjectTypes = async (reorderedItems: ProjectType[]): Promise<void> => {
    try {
      setError(null);
      
      // Update the order of each project type
      for (const [index, item] of reorderedItems.entries()) {
        await supabase
          .from(tableNames.PROJECT_TYPES)
          .update({ sort_order: index + 1 })
          .eq('id', item.id);
      }
      
      // Update local state
      setProjectTypes(reorderedItems.map((item, index) => ({
        ...item,
        sort_order: index + 1
      })));
      
      toast({
        title: "Success",
        description: "Project types reordered successfully",
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder project types';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      await fetchProjectTypes(); // Reload the original order
    }
  };

  const duplicateProjectType = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      
      const projectTypeToDuplicate = projectTypes.find(pt => pt.id === id);
      
      if (!projectTypeToDuplicate) {
        throw new Error('Project type not found');
      }
      
      // Get the highest order to place duplicated item at the end
      const highestOrder = Math.max(...projectTypes.map(pt => pt.sort_order)) + 1;
      
      const { data, error } = await supabase
        .from(tableNames.PROJECT_TYPES)
        .insert({
          name: `${projectTypeToDuplicate.name} (Copy)`,
          key: `${projectTypeToDuplicate.key}_copy`,
          description: projectTypeToDuplicate.description || '',
          icon: projectTypeToDuplicate.icon || '',
          is_active: projectTypeToDuplicate.isActive,
          sort_order: highestOrder
        })
        .select();
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Map the returned data to our ProjectType interface
      const newProjectType: ProjectType = {
        id: data[0].id,
        name: data[0].name,
        key: data[0].key,
        description: data[0].description,
        icon: data[0].icon,
        isActive: data[0].is_active,
        sort_order: data[0].sort_order,
        created_at: data[0].created_at,
        updated_at: data[0].updated_at
      };
      
      setProjectTypes([...projectTypes, newProjectType]);
      
      toast({
        title: "Success",
        description: "Project type duplicated successfully",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate project type';
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
    fetchProjectTypes();
  }, []);

  return {
    projectTypes,
    loading,
    error,
    fetchProjectTypes,
    createProjectType,
    updateProjectType,
    deleteProjectType,
    duplicateProjectType,
    reorderProjectTypes
  };
};
