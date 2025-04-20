
import { ConfiguratorState } from "../../types";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RomeinsVerbandAlert from "./RomeinsVerbandAlert";

interface TilePatternSelectorProps {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
}

const tilePatterns = [
  { id: "recht", name: "Recht op recht" },
  { id: "halfsteens", name: "Half steens verband" },
  { id: "romeins", name: "Romeins verband" },
];

const parketPatterns = ["recht"];

const TilePatternSelector = ({ state, updateState }: TilePatternSelectorProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const getAvailablePatterns = () => {
    if (state.floorType === "parket") {
      return tilePatterns.filter(pattern => parketPatterns.includes(pattern.id));
    }
    if (state.floorType === "terracotta") {
      return tilePatterns.filter(pattern => pattern.id !== "romeins");
    }
    return tilePatterns;
  };

  const getSelectedPattern = () => {
    return tilePatterns.find(pattern => pattern.id === state.tilePattern) || 
      { id: "", name: "Selecteer patroon" };
  };

  const selectedPattern = getSelectedPattern();
  const isRomeinsVerband = state.tilePattern === "romeins";

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Welk tegelverband?</h3>
      
      <div 
        onClick={() => setDialogOpen(true)}
        className="p-4 border rounded-xl flex justify-between items-center cursor-pointer bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow mb-3"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium">{selectedPattern.name}</span>
          <p className="text-xs text-gray-500">Klik om te wijzigen</p>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Kies uw tegelverband</DialogTitle>
          </DialogHeader>
          
          <div className="py-6">
            <div className="grid gap-4">
              {getAvailablePatterns().map((pattern) => (
                <div
                  key={pattern.id}
                  onClick={() => {
                    updateState({ tilePattern: pattern.id });
                    setDialogOpen(false);
                  }}
                  className={cn(
                    "p-7 border rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200",
                    state.tilePattern === pattern.id
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-gray-200 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
                  )}
                >
                  <span className={cn(
                    "text-lg font-medium",
                    state.tilePattern === pattern.id 
                      ? "text-primary" 
                      : "text-gray-800"
                  )}>
                    {pattern.name}
                  </span>
                  
                  {state.tilePattern === pattern.id && (
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {isRomeinsVerband && (
        <RomeinsVerbandAlert isVisible={true} />
      )}
    </div>
  );
};

export default TilePatternSelector;
