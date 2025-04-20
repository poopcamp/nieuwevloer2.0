
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ConfiguratorState } from "../types";
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { tableNames, WallType, WallTileSize } from "@/utils/supabase/customTypes";

interface KitchenWallStepProps {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
}

const KitchenWallStep = ({ state, updateState }: KitchenWallStepProps) => {
  const [wallTypeDialogOpen, setWallTypeDialogOpen] = useState(false);
  const [tileSizeDialogOpen, setTileSizeDialogOpen] = useState(false);
  
  // Fetch wall types and tile sizes from the database
  const { data: wallTypes = [], isLoading: isLoadingWallTypes } = useQuery({
    queryKey: ['wallTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(tableNames.WALL_TYPES)
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as WallType[];
    }
  });

  const { data: wallTileSizes = [], isLoading: isLoadingTileSizes } = useQuery({
    queryKey: ['wallTileSizes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(tableNames.WALL_TILE_SIZES)
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as WallTileSize[];
    }
  });
  
  // Set default selections if none are already set
  useEffect(() => {
    if (wallTypes.length > 0 && !state.wallType) {
      updateState({ wallType: wallTypes[0].id });
    }
    
    if (wallTileSizes.length > 0 && !state.wallTileSize) {
      updateState({ wallTileSize: wallTileSizes[0].size_id });
    }
  }, [wallTypes, wallTileSizes, state.wallType, state.wallTileSize, updateState]);
  
  // Get the selected options for display
  const getSelectedWallType = () => {
    return wallTypes.find(type => type.id === state.wallType) || 
      { id: "", name: "Selecteer type" };
  };
  
  const getSelectedTileSize = () => {
    return wallTileSizes.find(size => size.size_id === state.wallTileSize) || 
      { id: "", name: "Selecteer formaat" };
  };

  const selectedWallType = getSelectedWallType();
  const selectedTileSize = getSelectedTileSize();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Keukenwand Configureren
      </h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Welk type wandafwerking?</h3>
          
          {/* Wall Type Selector */}
          <div 
            onClick={() => setWallTypeDialogOpen(true)}
            className="p-4 border rounded-xl flex justify-between items-center cursor-pointer bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow mb-3"
          >
            <div className="flex items-center gap-3">
              <span className="font-medium">{selectedWallType.name}</span>
              <p className="text-xs text-gray-500">Klik om te wijzigen</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          
          {/* Wall Type Selection Dialog */}
          <Dialog open={wallTypeDialogOpen} onOpenChange={setWallTypeDialogOpen}>
            <DialogContent className="max-w-md p-6">
              <DialogHeader>
                <DialogTitle className="text-xl">Kies uw wandafwerking</DialogTitle>
              </DialogHeader>
              
              <div className="py-6">
                <div className="grid gap-4">
                  {isLoadingWallTypes ? (
                    <div className="p-4 text-center">Laden...</div>
                  ) : wallTypes.length === 0 ? (
                    <div className="p-4 text-center">Geen opties beschikbaar</div>
                  ) : (
                    wallTypes.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => {
                          updateState({ wallType: type.id });
                          setWallTypeDialogOpen(false);
                        }}
                        className={cn(
                          "p-6 border rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200",
                          state.wallType === type.id
                            ? "border-primary bg-primary/5 shadow-sm" 
                            : "border-gray-200 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
                        )}
                      >
                        <span className={cn(
                          "text-lg font-medium",
                          state.wallType === type.id 
                            ? "text-primary" 
                            : "text-gray-800"
                        )}>
                          {type.name}
                        </span>
                        
                        {state.wallType === type.id && (
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Welk formaat tegels?</h3>
          
          {/* Tile Size Selector */}
          <div 
            onClick={() => setTileSizeDialogOpen(true)}
            className="p-4 border rounded-xl flex justify-between items-center cursor-pointer bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow mb-3"
          >
            <div className="flex items-center gap-3">
              <span className="font-medium">{selectedTileSize.name}</span>
              <p className="text-xs text-gray-500">Klik om te wijzigen</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          
          {/* Tile Size Selection Dialog */}
          <Dialog open={tileSizeDialogOpen} onOpenChange={setTileSizeDialogOpen}>
            <DialogContent className="max-w-md p-6">
              <DialogHeader>
                <DialogTitle className="text-xl">Kies uw tegelformaat</DialogTitle>
              </DialogHeader>
              
              <div className="py-6">
                <div className="grid gap-4">
                  {isLoadingTileSizes ? (
                    <div className="p-4 text-center">Laden...</div>
                  ) : wallTileSizes.length === 0 ? (
                    <div className="p-4 text-center">Geen formaten beschikbaar</div>
                  ) : (
                    wallTileSizes.map((size) => (
                      <div
                        key={size.id}
                        onClick={() => {
                          updateState({ wallTileSize: size.size_id });
                          setTileSizeDialogOpen(false);
                        }}
                        className={cn(
                          "p-6 border rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200",
                          state.wallTileSize === size.size_id
                            ? "border-primary bg-primary/5 shadow-sm" 
                            : "border-gray-200 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
                        )}
                      >
                        <span className={cn(
                          "text-lg font-medium",
                          state.wallTileSize === size.size_id 
                            ? "text-primary" 
                            : "text-gray-800"
                        )}>
                          {size.name}
                        </span>
                        
                        {state.wallTileSize === size.size_id && (
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="bg-gray-50 p-5 rounded-lg">
          <div className="flex justify-between mb-2">
            <Label htmlFor="squareMeters" className="text-lg font-medium">Oppervlakte</Label>
            <span className="text-lg font-semibold text-primary">{state.squareMeters} m²</span>
          </div>
          <Slider
            id="squareMeters"
            min={1}
            max={500}
            step={1}
            value={[state.squareMeters]}
            onValueChange={(value) => updateState({ squareMeters: value[0] })}
            className="py-4"
          />
          <p className="text-sm text-gray-500 mt-1">Verschuif de slider om het aantal vierkante meters aan te geven</p>
        </div>
      </div>
    </div>
  );
};

export default KitchenWallStep;
