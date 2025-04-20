
import { ConfiguratorState } from "../../types";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FloorTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const floorTypes = [
  { id: "ceramic", name: "Keramische tegels" },
  { id: "natural-stone", name: "Natuursteen" },
  { id: "parket", name: "Parket tegel" },
  { id: "terracotta", name: "Terracotta" },
];

const FloorTypeSelector = ({ selectedType, onTypeChange }: FloorTypeSelectorProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const getSelectedType = () => {
    return floorTypes.find(type => type.id === selectedType) || 
      { id: "", name: "Selecteer vloertype" };
  };

  const selectedOption = getSelectedType();

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Welk soort vloer?</h3>
      
      <div 
        onClick={() => setDialogOpen(true)}
        className="p-4 border rounded-xl flex justify-between items-center cursor-pointer bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow mb-3"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium">{selectedOption.name}</span>
          <p className="text-xs text-gray-500">Klik om te wijzigen</p>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Kies uw vloertype</DialogTitle>
          </DialogHeader>
          
          <div className="py-6">
            <div className="grid gap-4">
              {floorTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => {
                    onTypeChange(type.id);
                    setDialogOpen(false);
                  }}
                  className={cn(
                    "p-7 border rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200",
                    selectedType === type.id
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-gray-200 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
                  )}
                >
                  <span className={cn(
                    "text-lg font-medium",
                    selectedType === type.id 
                      ? "text-primary" 
                      : "text-gray-800"
                  )}>
                    {type.name}
                  </span>
                  
                  {selectedType === type.id && (
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

export default FloorTypeSelector;
