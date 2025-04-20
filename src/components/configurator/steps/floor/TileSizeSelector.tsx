
import { ConfiguratorState } from "../../types";
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

interface TileSizeSelectorProps {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
}

interface TileSize {
  id: string;
  name: string;
}

const TileSizeSelector = ({ state, updateState }: TileSizeSelectorProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tileSizes, setTileSizes] = useState<TileSize[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [useDefaultSizes, setUseDefaultSizes] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  // Default tile sizes to use as fallback
  const getDefaultTileSizes = (): TileSize[] => {
    return [
      { id: "60x60", name: "60 x 60 cm" },
      { id: "80x80", name: "80 x 80 cm" },
      { id: "90x90", name: "90 x 90 cm" },
      { id: "120x60", name: "120 x 60 cm" },
      { id: "120x120", name: "120 x 120 cm" },
    ];
  };

  // Fetch tile sizes from the database
  useEffect(() => {
    const fetchTileSizes = async () => {
      try {
        setLoading(true);
        setError(null);
        // Determine which section_id to use based on floor type
        const sectionId = 'formaten'; // This is for floor tiles
        const projectType = 'vloer';
        
        console.log(`Fetching tile sizes for ${projectType} with section_id: ${sectionId}`);
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timed out')), 5000);
        });
        
        // The actual fetch request
        const fetchPromise = supabase
          .from('calculator_rates')
          .select('id, name')
          .eq('project_type', projectType)
          .eq('section_id', sectionId)
          .order('name');
        
        // Race between timeout and actual fetch
        const { data, error } = await Promise.race([
          fetchPromise,
          timeoutPromise.then(() => { throw new Error('Request timed out') })
        ]) as any;
          
        if (error) {
          throw error;
        }
        
        console.log("Fetched tile sizes from database:", data);
        
        if (data && data.length > 0) {
          // Map database results to TileSize format
          const fetchedSizes: TileSize[] = data.map((item: any) => ({
            id: item.name.replace(/\s/g, '').toLowerCase(),
            name: item.name
          }));
          
          setTileSizes(fetchedSizes);
          setUseDefaultSizes(false);
          
          // If we have sizes but nothing is selected, set the first one as default
          if (fetchedSizes.length > 0 && !state.tileSize) {
            updateState({ tileSize: fetchedSizes[0].id });
          }
        } else {
          console.log("No tile sizes found in database, using fallback");
          // Use fallback sizes if no data found
          const defaultSizes = getDefaultTileSizes();
          setTileSizes(defaultSizes);
          setUseDefaultSizes(true);
          
          // If we have default sizes but nothing is selected, set the first one as default
          if (!state.tileSize) {
            updateState({ tileSize: defaultSizes[0].id });
          }
        }
      } catch (error: any) {
        console.error("Failed to fetch tile sizes:", error);
        setError(`Error fetching tile sizes: ${error.message}`);
        // Fallback to hardcoded formats if fetch fails
        const defaultSizes = getDefaultTileSizes();
        setTileSizes(defaultSizes);
        setUseDefaultSizes(true);
        
        // If we have default sizes but nothing is selected, set the first one as default
        if (!state.tileSize) {
          updateState({ tileSize: defaultSizes[0].id });
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchTileSizes();
  }, [connectionAttempts]);

  // Function to retry connection
  const retryConnection = () => {
    setConnectionAttempts(prev => prev + 1);
  };

  const getTileSizes = () => {
    // If terracotta, we could use a different set in the future
    if (state.floorType === "terracotta") {
      // This could be fetched from database in a similar way
      return [
        { id: "5.3x30", name: "5,3 x 30 cm" },
        { id: "15x15", name: "15 x 15 cm" },
        { id: "15x30", name: "15 x 30 cm" },
        { id: "20x20", name: "20 x 20 cm" },
        { id: "30x30", name: "30 x 30 cm" },
        { id: "45x45", name: "45 x 45 cm" },
        { id: "60x60", name: "60 x 60 cm" },
      ];
    }
    return tileSizes;
  };

  const getSelectedSize = () => {
    return getTileSizes().find(size => size.id === state.tileSize) || 
      { id: "", name: "Selecteer formaat" };
  };

  const selectedSize = getSelectedSize();

  // Don't show the size selector for Romeins verband since it uses multiple sizes
  if (state.tilePattern === "romeins") {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Welk formaat tegels?</h3>
      
      <div 
        onClick={() => setDialogOpen(true)}
        className="p-4 border rounded-xl flex justify-between items-center cursor-pointer bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium">{selectedSize.name}</span>
          <p className="text-xs text-gray-500">Klik om te wijzigen</p>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Kies uw tegelformaat</DialogTitle>
          </DialogHeader>
          
          <div className="py-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : error && useDefaultSizes ? (
              <Alert variant="default" className="mb-4 border-amber-200 bg-amber-50 text-amber-700">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription>
                  Gebruikend standaard tegelformaten (database verbinding niet beschikbaar)
                </AlertDescription>
              </Alert>
            ) : null}
            
            <div className="grid gap-4">
              {getTileSizes().map((size) => (
                <div
                  key={size.id}
                  onClick={() => {
                    updateState({ tileSize: size.id });
                    setDialogOpen(false);
                  }}
                  className={cn(
                    "p-7 border rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200",
                    state.tileSize === size.id
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-gray-200 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
                  )}
                >
                  <span className={cn(
                    "text-lg font-medium",
                    state.tileSize === size.id 
                      ? "text-primary" 
                      : "text-gray-800"
                  )}>
                    {size.name}
                  </span>
                  
                  {state.tileSize === size.id && (
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TileSizeSelector;
