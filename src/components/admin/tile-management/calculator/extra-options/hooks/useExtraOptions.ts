
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { extraOptionsService } from "@/services/extraOptionsService";

export interface ExtraOption {
  id: string;
  name: string;
  price: number;
  project_type?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface NewOptionState {
  name: string;
  price: string;
  project_type: string;
}

export const useExtraOptions = (category?: string) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [extraOptions, setExtraOptions] = useState<ExtraOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newOption, setNewOption] = useState<NewOptionState>({
    name: "",
    price: "",
    project_type: "all"
  });

  // Fetch extra options from the database
  const fetchExtraOptions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('extra_options')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log(`Retrieved ${data?.length || 0} extra options:`, data);
      setExtraOptions(data || []);
    } catch (error: any) {
      console.error(`Error fetching extra options:`, error);
      setError(`Fout bij ophalen van extra opties: ${error.message}`);
      toast({
        variant: "destructive",
        title: "Fout bij ophalen extra opties",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add new extra option
  const addOption = async () => {
    if (!newOption.name || !newOption.price) {
      toast({
        variant: "destructive",
        title: "Ongeldige gegevens",
        description: "Vul een geldige naam en prijs in."
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const priceValue = parseFloat(newOption.price.replace(',', '.'));
      
      if (isNaN(priceValue)) {
        throw new Error("Ongeldige prijs ingevoerd");
      }
      
      // Voeg direct in vanuit de component
      const { data, error } = await supabase
        .from('extra_options')
        .insert([
          { 
            name: newOption.name, 
            price: priceValue,
            project_type: newOption.project_type !== "all" ? newOption.project_type : null
          }
        ])
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data && data.length > 0) {
        console.log("Added new extra option:", data[0]);
        setExtraOptions([...extraOptions, data[0]]);
        
        // Reset the form
        setNewOption({
          name: "",
          price: "",
          project_type: "all"
        });
        
        toast({
          title: "Extra optie toegevoegd",
          description: `${newOption.name} is toegevoegd aan de extra opties.`
        });
      }
    } catch (error: any) {
      console.error("Error adding extra option:", error);
      setError(`Fout bij toevoegen van extra optie: ${error.message}`);
      toast({
        variant: "destructive",
        title: "Fout bij toevoegen",
        description: error.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Update extra option
  const updateOption = async (id: string, field: string, value: string | number) => {
    try {
      console.log(`Updating option ${id}, field ${field} to ${value}`);
      const { error } = await supabase
        .from('extra_options')
        .update({ [field]: value })
        .eq('id', id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Update the local state
      setExtraOptions(extraOptions.map(option => 
        option.id === id ? { ...option, [field]: value } : option
      ));
      
      toast({
        title: "Extra optie bijgewerkt",
        description: "De optie is succesvol bijgewerkt."
      });
    } catch (error: any) {
      console.error("Error updating extra option:", error);
      setError(`Fout bij bijwerken van extra optie: ${error.message}`);
      toast({
        variant: "destructive",
        title: "Fout bij bijwerken",
        description: error.message
      });
    }
  };

  // Delete extra option
  const deleteOption = async (id: string, name: string) => {
    if (!confirm(`Weet u zeker dat u '${name}' wilt verwijderen?`)) {
      return;
    }
    
    try {
      console.log(`Deleting option with ID: ${id}`);
      const { error } = await supabase
        .from('extra_options')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Remove from local state
      setExtraOptions(extraOptions.filter(option => option.id !== id));
      
      toast({
        title: "Extra optie verwijderd",
        description: `'${name}' is verwijderd.`
      });
    } catch (error: any) {
      console.error("Error deleting extra option:", error);
      setError(`Fout bij verwijderen van extra optie: ${error.message}`);
      toast({
        variant: "destructive",
        title: "Fout bij verwijderen",
        description: error.message
      });
    }
  };

  // Add sample data if none exists
  const addSampleData = async () => {
    if (extraOptions.length > 0) {
      toast({
        title: "Opties bestaan al",
        description: "Er zijn al extra opties aanwezig in de database."
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log("Adding sample extra options");
      
      // Voeg één voor één toe om te voorkomen dat de RLS-fout optreedt
      const sampleOptions = [
        { name: "Vloerverwarming", price: 15.0, project_type: "vloer" },
        { name: "Anti-slip coating", price: 8.5, project_type: null },
        { name: "Waterdichte voeg", price: 5.0, project_type: null },
        { name: "Spotjes installeren", price: 45.0, project_type: "keukenwand" },
        { name: "Ontkoppelingsmat", price: 12.0, project_type: "vloer" }
      ];
      
      const addedOptions = [];
      
      for (const option of sampleOptions) {
        const { data, error } = await supabase
          .from('extra_options')
          .insert([option])
          .select();
          
        if (error) {
          console.error("Error adding sample option:", error);
          continue;
        }
        
        if (data && data.length > 0) {
          addedOptions.push(data[0]);
        }
      }
      
      console.log(`Added ${addedOptions.length} sample options`);
      
      if (addedOptions.length > 0) {
        setExtraOptions(addedOptions);
        
        toast({
          title: "Voorbeeldgegevens toegevoegd",
          description: `${addedOptions.length} extra opties zijn toegevoegd.`
        });
      } else {
        throw new Error("Geen voorbeeldopties konden worden toegevoegd");
      }
    } catch (error: any) {
      console.error("Error adding sample data:", error);
      setError(`Fout bij toevoegen van voorbeeldgegevens: ${error.message}`);
      toast({
        variant: "destructive",
        title: "Fout bij toevoegen voorbeeldgegevens",
        description: error.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchExtraOptions();
  }, []);

  return {
    extraOptions,
    isLoading,
    isSaving,
    error,
    newOption,
    setNewOption,
    fetchExtraOptions,
    addSampleData,
    updateOption,
    deleteOption,
    addOption
  };
};
