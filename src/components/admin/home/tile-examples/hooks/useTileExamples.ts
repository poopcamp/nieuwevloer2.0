
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TileExample } from "@/types/homeContent";

export const useTileExamples = () => {
  const [tileExamples, setTileExamples] = useState<TileExample[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchTileExamples = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tile_examples')
        .select('*')
        .order('id');

      if (error) throw error;
      
      console.log("Opgehaalde tegelvoorbeelden:", data);
      
      // Ensure data format is correct
      const formattedData = (data || []).map(example => ({
        ...example,
        image: example.image || '',
        suitable_for: example.suitable_for || []
      }));
      
      setTileExamples(formattedData);
    } catch (error: any) {
      console.error('Error fetching tile examples:', error);
      toast({
        title: "Fout bij ophalen",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveExamples = async (examples: TileExample[]) => {
    setSaving(true);
    try {
      console.log("Opslaan van tegelvoorbeelden:", examples);
      
      // Valideer alle gegevens voordat we gaan opslaan
      const validatedExamples = examples.map(example => ({
        ...example,
        // Zorg voor een lege string als image niet bestaat
        image: example.image || '',
        suitable_for: example.suitable_for || []
      }));
      
      // First delete all existing examples
      const { error: deleteError } = await supabase
        .from('tile_examples')
        .delete()
        .not('id', 'eq', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (deleteError) throw deleteError;

      // Prepare examples with created_at and updated_at timestamps
      const now = new Date().toISOString();
      const preparedExamples = validatedExamples.map(example => ({
        ...example,
        created_at: now,
        updated_at: now
      }));

      // Then insert all examples
      const { data, error: insertError } = await supabase
        .from('tile_examples')
        .insert(preparedExamples)
        .select();

      if (insertError) throw insertError;
      
      console.log("Opgeslagen tegelvoorbeelden:", data);

      toast({
        title: "Opgeslagen",
        description: "Tegelvoorbeelden zijn succesvol bijgewerkt.",
      });
      
      // Refresh the data after saving
      await fetchTileExamples();
    } catch (error: any) {
      console.error('Error saving tile examples:', error);
      toast({
        title: "Fout bij opslaan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchTileExamples();
  }, []);

  return {
    tileExamples,
    setTileExamples,
    loading,
    saving,
    saveExamples,
    fetchTileExamples
  };
};
