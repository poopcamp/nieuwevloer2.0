
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TileSize } from "./types";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TileFormatSelectorProps {
  tileSizes: TileSize[];
  selectedSize: string;
  onSelect: (value: string) => void;
  label: string;
}

const TileFormatSelector = ({ tileSizes, selectedSize, onSelect, label }: TileFormatSelectorProps) => {
  const [selectorOpen, setSelectorOpen] = useState(false);

  // Get the selected option for display
  const getSelectedOption = () => {
    return tileSizes.find(size => size.id === selectedSize) || 
      { id: "", name: "Selecteer formaat" };
  };

  const selectedOption = getSelectedOption();

  // Handle special case for Romeins Verband
  const isRomeinsVerband = selectedSize === 'romeins';
  
  // Check if we need to add Romeins Verband option
  const allTileSizes = tileSizes.some(size => size.id === 'romeins') 
    ? tileSizes 
    : [...tileSizes, { id: 'romeins', name: 'Romeins Verband (verschillende formaten)' }];

  return (
    <div className="space-y-4">
      <Label htmlFor="tileSize" className="text-base font-semibold text-gray-800">{label}</Label>
      
      {/* Current selection display (clickable) */}
      <div 
        onClick={() => setSelectorOpen(true)}
        className="p-4 border rounded-xl flex justify-between items-center cursor-pointer bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
      >
        <div className="flex items-center gap-3">
          <div>
            <span className="font-medium">{selectedOption.name}</span>
            <p className="text-xs text-gray-500 mt-0.5">Klik om te wijzigen</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
      
      {/* Display information about Romeins Verband if selected */}
      {isRomeinsVerband && (
        <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 animate-fadeIn">
          <p className="text-sm text-amber-800 font-medium">
            Let op: Romeins Verband gebruikt verschillende tegelformaten.
          </p>
          <p className="text-sm text-amber-700 mt-2">
            Dit patroon is alleen beschikbaar voor vloer- en badkamertegels.
          </p>
        </div>
      )}

      {/* Tile Format Selection Dialog */}
      <Dialog open={selectorOpen} onOpenChange={setSelectorOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Kies uw tegelformaat</DialogTitle>
          </DialogHeader>
          
          <div className="py-6">
            <div className="grid gap-4">
              {allTileSizes.map((size) => (
                <div
                  key={size.id}
                  onClick={() => {
                    onSelect(size.id);
                    setSelectorOpen(false);
                  }}
                  className={cn(
                    "p-6 border rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200",
                    selectedSize === size.id
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-gray-200 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
                  )}
                >
                  <span className={cn(
                    "text-lg font-medium",
                    selectedSize === size.id 
                      ? "text-primary" 
                      : "text-gray-800"
                  )}>
                    {size.name}
                  </span>
                  
                  {selectedSize === size.id && (
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

export default TileFormatSelector;
