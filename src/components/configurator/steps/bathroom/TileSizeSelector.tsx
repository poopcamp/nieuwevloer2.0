
import { ConfiguratorState } from "../../types";
import { cn } from "@/lib/utils";
import { Grid3X3, Square, RectangleHorizontal, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TileSizeSelectorProps {
  tileSizes: Array<{ id: string, name: string }>;
  selectedSize: string | null;
  onSizeChange: (size: string) => void;
}

const TileSizeSelector = ({ 
  tileSizes, 
  selectedSize, 
  onSizeChange 
}: TileSizeSelectorProps) => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  
  // Get appropriate icon for each tile format
  const getTileIcon = (id: string) => {
    if (id.includes("30")) return <Grid3X3 className="h-5 w-5" />;
    if (id.includes("60")) return <Square className="h-5 w-5" />;
    if (id.includes("90")) return <Square className="h-5 w-5" />;
    if (id.includes("120")) return <RectangleHorizontal className="h-5 w-5" />;
    if (id === "XXL") return <RectangleHorizontal className="h-5 w-5" />;
    return <Square className="h-5 w-5" />;
  };

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
    <div>
      <h3 className="text-lg font-medium mb-4">Welk formaat tegels?</h3>
      
      {/* Current selection display (clickable) */}
      <div 
        onClick={() => setSelectorOpen(true)}
        className="p-4 border rounded-xl flex justify-between items-center cursor-pointer bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow mb-3"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full",
            selectedSize ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"
          )}>
            {getTileIcon(selectedOption.id)}
          </div>
          <div>
            <span className="font-medium">{selectedOption.name}</span>
            <p className="text-xs text-gray-500 mt-0.5">Klik om te wijzigen</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
      
      {/* Display information about large format tiles if selected */}
      {(selectedSize === "XXL" || selectedSize === "120x120" || selectedSize === "120x240") && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 animate-fadeIn mb-3">
          <p className="text-sm text-blue-800 font-medium">
            Voor grootformaat tegels ({selectedOption.name}):
          </p>
          <ul className="text-sm text-blue-700 mt-2 list-disc pl-5 space-y-1">
            <li>Primer van chape is inbegrepen</li>
            <li>Ontkoppelingsmat wordt standaard geïnstalleerd</li>
            <li>Gespecialiseerde plaatsing voor optimale afwerking</li>
          </ul>
        </div>
      )}
      
      {/* Display information about Romeins Verband if selected */}
      {isRomeinsVerband && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 animate-fadeIn mb-3">
          <p className="text-sm text-amber-800 font-medium">
            Let op: Romeins Verband gebruikt verschillende tegelformaten.
          </p>
          <p className="text-sm text-amber-700 mt-1">
            Dit patroon is alleen beschikbaar voor vloer- en badkamertegels.
          </p>
        </div>
      )}

      {/* Tile Format Selection Dialog */}
      <Dialog open={selectorOpen} onOpenChange={setSelectorOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Kies uw tegelformaat</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid gap-3">
              {allTileSizes.map((size) => (
                <div
                  key={size.id}
                  onClick={() => {
                    onSizeChange(size.id);
                    setSelectorOpen(false);
                  }}
                  className={cn(
                    "p-4 border rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-200",
                    selectedSize === size.id
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-gray-200 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full",
                    selectedSize === size.id 
                      ? "bg-primary text-white" 
                      : "bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary/70"
                  )}>
                    {getTileIcon(size.id)}
                  </div>
                  
                  <span className={cn(
                    "text-base font-medium",
                    selectedSize === size.id 
                      ? "text-primary" 
                      : "text-gray-800"
                  )}>
                    {size.name}
                  </span>
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
