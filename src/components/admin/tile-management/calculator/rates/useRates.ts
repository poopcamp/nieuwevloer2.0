
import { useState, useEffect } from "react";
import { getDefaultRates } from "./utils";
import { ProjectRates, DatabaseRateItem } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRates = (projectType: string = '') => {
  const [rates, setRates] = useState<ProjectRates>(getDefaultRates());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  // Load rates from Supabase when component mounts
  useEffect(() => {
    const loadRates = async () => {
      setIsLoading(true);
      
      try {
        let query = supabase
          .from('calculator_rates')
          .select('*');
          
        // Filter by project type if provided
        if (projectType) {
          query = query.eq('project_type', projectType);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error loading rates:", error);
          toast({
            title: "Fout bij laden tarieven",
            description: "Er is iets misgegaan bij het laden van de tarieven.",
            variant: "destructive",
          });
          return;
        }
        
        if (data && data.length > 0) {
          // Transform the flat database structure to our nested structure
          const transformedRates: ProjectRates = {};
          
          data.forEach((item: DatabaseRateItem) => {
            if (!transformedRates[item.section_id]) {
              transformedRates[item.section_id] = {};
            }
            
            transformedRates[item.section_id][item.rate_key] = {
              name: item.name,
              value: Number(item.value)
            };
          });
          
          setRates(transformedRates);
        } else {
          // Als er geen data is, gebruik de default rates
          setRates(getDefaultRates());
        }
      } catch (err) {
        console.error("Unexpected error loading rates:", err);
        // Bij een error ook de default rates gebruiken zodat de UI niet breekt
        setRates(getDefaultRates());
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRates();
  }, [projectType, toast]);
  
  // Handle rate update
  const handleRateChange = (section: string, key: string, value: number) => {
    setRates(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: {
          ...prev[section]?.[key],
          value
        }
      }
    }));
  };
  
  // Save rate changes to Supabase
  const saveRates = async () => {
    setIsSaving(true);
    
    try {
      const updates = [];
      
      // Prepare all updates
      for (const sectionId in rates) {
        for (const rateKey in rates[sectionId]) {
          const rateItem = rates[sectionId][rateKey];
          
          // Look for existing rate in the database
          const { data: existingRates, error: fetchError } = await supabase
            .from('calculator_rates')
            .select('id')
            .eq('section_id', sectionId)
            .eq('rate_key', rateKey)
            .eq('project_type', projectType || '');
            
          if (fetchError) {
            console.error(`Error checking for existing rate (${sectionId}.${rateKey}):`, fetchError);
            continue;
          }
          
          if (existingRates && existingRates.length > 0) {
            // Update existing rate
            const { error: updateError } = await supabase
              .from('calculator_rates')
              .update({
                value: rateItem.value,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingRates[0].id);
              
            if (updateError) {
              console.error(`Error updating rate (${sectionId}.${rateKey}):`, updateError);
            } else {
              updates.push(`updated ${sectionId}.${rateKey}`);
            }
          } else {
            // Insert new rate
            const { error: insertError } = await supabase
              .from('calculator_rates')
              .insert({
                section_id: sectionId,
                rate_key: rateKey,
                name: rateItem.name,
                value: rateItem.value,
                project_type: projectType || ''
              });
              
            if (insertError) {
              console.error(`Error inserting rate (${sectionId}.${rateKey}):`, insertError);
            } else {
              updates.push(`inserted ${sectionId}.${rateKey}`);
            }
          }
        }
      }
      
      console.log(`${updates.length} rates updated/inserted.`);
      return { success: true, message: `${updates.length} tarieven bijgewerkt.` };
    } catch (error) {
      console.error("Error saving rates:", error);
      return { success: false, error };
    } finally {
      setIsSaving(false);
    }
  };
  
  return {
    rates,
    isLoading,
    isSaving,
    handleRateChange,
    saveRates
  };
};
