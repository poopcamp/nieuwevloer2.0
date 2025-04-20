
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import InspirationCarousel from "./inspiration/InspirationCarousel";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { InspirationTile } from "./inspiration/types";
import { inspirationTiles as fallbackData } from "./inspiration/inspirationData";

export default function InspirationCorner() {
  const [tiles, setTiles] = useState<InspirationTile[]>(fallbackData);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchInspirationTiles = async () => {
      try {
        const { data, error } = await supabase
          .from('inspiration_tiles')
          .select('*')
          .order('popularity', { ascending: false });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Map database fields to component fields
          const formattedTiles = data.map((item): InspirationTile => ({
            id: Number(item.id) || Math.random(), // Convert to number or use random as fallback
            title: item.title || '',
            description: item.description || '',
            image: item.image || '',
            colorPalette: Array.isArray(item.colorpalette) ? item.colorpalette : ['#F5F5F5', '#E0E0E0', '#BDBDBD'],
            popularity: item.popularity || 75
          }));
          
          setTiles(formattedTiles);
        }
      } catch (error) {
        console.error("Error fetching inspiration tiles:", error);
        // Use the fallback data if there's an error
      } finally {
        setLoading(false);
      }
    };
    
    fetchInspirationTiles();
  }, []);

  return (
    <section className="py-14 md:py-16 overflow-hidden bg-gradient-to-br from-primary-50 to-white relative">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary-100 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary-50 rounded-full opacity-30 blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center mb-3 gap-2 px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full font-medium text-sm">
            <Sparkles className="h-4 w-4" />
            <span>Laat u inspireren</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Inspiratiecorner</h2>
          <p className="text-gray-600">
            Ontdek populaire stijlen en kleurcombinaties voor uw vloer- of wandtegels. 
            Laat u inspireren door de laatste trends en tijdloze klassiekers.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <InspirationCarousel items={tiles} />
        </div>
        
        <div className="text-center mt-10">
          <Button asChild size="lg" className="min-h-11 px-8 text-base">
            <Link to="/configurator" className="flex items-center">
              Gebruik deze stijl in uw project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
