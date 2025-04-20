
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { extraOptionsService } from '@/services/extraOptionsService'; 
import { ExtraOption, FormValues } from './types';
import { getUserFriendlyErrorMessage } from '@/utils/errorHandling';

export const useExtraOptions = (category?: string) => {
  const [extraOptions, setExtraOptions] = useState<ExtraOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchExtraOptions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let options: ExtraOption[];
      
      // If category is provided, fetch options specific to that category
      if (category) {
        options = await extraOptionsService.fetchExtraOptionsByProjectType(category);
      } else {
        options = await extraOptionsService.fetchExtraOptions();
      }
      
      setExtraOptions(options);
    } catch (error: any) {
      const errorMessage = getUserFriendlyErrorMessage(error);
      setError(errorMessage);
      toast({
        title: "Fout bij ophalen",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [category, toast]);

  const addExtraOption = async (values: FormValues) => {
    try {
      // Pass project_type as null or empty string based on your requirement
      const projectType = values.projectType && values.projectType !== "all" 
        ? values.projectType 
        : null;
      
      await extraOptionsService.addExtraOption(values.name, values.price, projectType);
      
      toast({
        title: "Extra optie toegevoegd",
        description: "De nieuwe extra optie is succesvol toegevoegd."
      });
      
      await fetchExtraOptions();
      return true;
    } catch (error: any) {
      const errorMessage = getUserFriendlyErrorMessage(error);
      toast({
        title: "Fout bij toevoegen",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateExtraOption = async (id: string, values: FormValues) => {
    try {
      const projectType = values.projectType && values.projectType !== "all" 
        ? values.projectType 
        : null;
        
      await extraOptionsService.updateExtraOption(id, values.name, values.price, projectType);
      
      toast({
        title: "Extra optie bijgewerkt",
        description: "De extra optie is succesvol bijgewerkt."
      });
      
      await fetchExtraOptions();
      return true;
    } catch (error: any) {
      const errorMessage = getUserFriendlyErrorMessage(error);
      toast({
        title: "Fout bij bijwerken",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteExtraOption = async (id: string) => {
    try {
      await extraOptionsService.deleteExtraOption(id);
      
      toast({
        title: "Extra optie verwijderd",
        description: "De extra optie is succesvol verwijderd."
      });
      
      await fetchExtraOptions();
      return true;
    } catch (error: any) {
      const errorMessage = getUserFriendlyErrorMessage(error);
      toast({
        title: "Fout bij verwijderen",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchExtraOptions();
  }, [fetchExtraOptions]);

  return {
    extraOptions,
    isLoading,
    error,
    fetchExtraOptions,
    addExtraOption,
    updateExtraOption,
    deleteExtraOption
  };
};
