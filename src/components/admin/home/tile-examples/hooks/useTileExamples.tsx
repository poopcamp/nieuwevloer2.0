import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TileExample } from "@/types/homeContent";
import { useToast } from "@/hooks/use-toast";

// Fallback examples if database returns no results
const fallbackExamples: TileExample[] = [
  {
    id: "porcelain-60x60",
    name: "Porselein tegels",
    size: "60x60 cm",
    image: "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/tiles/porcelain-60x60.jpg",
    description: "Uiterst duurzame porselein tegels met natuursteen look, ideaal voor vloeren met hoge belasting",
    finish: "Mat",
    suitable_for: ["Woonkamer", "Keuken", "Hal", "Commerciële ruimtes"]
  },
  {
    id: "ceramic-30x60",
    name: "Keramische wandtegels",
    size: "30x60 cm",
    image: "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/tiles/ceramic-wall-30x60.jpg",
    description: "Stijlvolle keramische wandtegels, perfect voor badkamers en keukens",
    finish: "Glanzend",
    suitable_for: ["Badkamer", "Keuken", "Toilet"]
  },
  {
    id: "natural-stone",
    name: "Natuursteen tegels",
    size: "60x60 cm",
    image: "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/tiles/natural-stone-60x60.jpg", 
    description: "Luxe natuursteen met unieke patronen en kleurnuances",
    finish: "Gepolijst",
    suitable_for: ["Woonkamer", "Badkamer", "Entree"]
  },
  {
    id: "wood-look",
    name: "Houtlook tegels",
    size: "20x120 cm",
    image: "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/tiles/wood-look-20x120.jpg",
    description: "Houtlook tegels combineren de uitstraling van hout met de voordelen van keramiek",
    finish: "Natuurhout structuur",
    suitable_for: ["Woonkamer", "Slaapkamer", "Keuken", "Badkamer"]
  }
];

export const useTileExamples = () => {
  const [tileExamples, setTileExamples] = useState<TileExample[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  // Function to save examples to the database
  const saveExamples = async (examples: TileExample[]) => {
    setSaving(true);
    try {
      // First upsert the examples to the tile_examples table
      for (const example of examples) {
        const { error } = await supabase
          .from('tile_examples')
          .upsert({
            id: example.id,
            name: example.name,
            size: example.size,
            image: example.image,
            description: example.description,
            finish: example.finish,
            suitable_for: example.suitable_for,
            featured: example.featured || false
          });
          
        if (error) {
          console.error("Error saving tile example:", error);
          toast({
            title: "Fout bij opslaan",
            description: `Kon ${example.name} niet opslaan: ${error.message}`,
            variant: "destructive"
          });
          throw error;
        }
      }
      
      // Fetch after saving to ensure we have the latest data
      fetchTileExamples();
      
      toast({
        title: "Opgeslagen",
        description: `${examples.length} tegelvoorbeelden opgeslagen.`
      });
    } catch (error) {
      console.error("Error saving examples:", error);
    } finally {
      setSaving(false);
    }
  };

  const fetchTileExamples = async () => {
    try {
      const { data, error } = await supabase
        .from('tile_examples')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      console.log("Opgehaalde tegelvoorbeelden:", data);
      setTileExamples(data || []);
    } catch (error) {
      console.error("Error fetching tile examples:", error);
      // Use fallback examples if fetch fails
      setTileExamples(fallbackExamples);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTileExamples();
  }, []);

  // Use fallback examples if no data from database
  const displayExamples = tileExamples.length > 0 ? tileExamples : fallbackExamples;
  
  return { 
    tileExamples: displayExamples, 
    setTileExamples,
    loading,
    saving,
    saveExamples
  };
};
