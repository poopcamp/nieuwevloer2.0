
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TileExample } from "@/types/homeContent";

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
  const [examples, setExamples] = useState<TileExample[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTileExamples = async () => {
      try {
        const { data, error } = await supabase
          .from('tile_examples')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setExamples(data || []);
      } catch (error) {
        console.error("Error fetching tile examples:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTileExamples();
  }, []);

  // Use fallback examples if no data from database
  const displayExamples = examples.length > 0 ? examples : fallbackExamples;
  
  return { 
    examples: displayExamples, 
    loading 
  };
};
