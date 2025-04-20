
import { useState } from "react";
import { Plus, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QuickCalculatorTile } from "@/utils/supabase/customTypes";
import { useQuickCalculatorTiles } from "./hooks/useQuickCalculatorTiles";
import TileOptionForm from "./components/TileOptionForm";
import TileOptionsTable from "./components/TileOptionsTable";
import QuickCalculatorPreview from "./components/QuickCalculatorPreview";
import { ScrollArea } from "@/components/ui/scroll-area";

const QuickCalculatorManager = () => {
  const {
    tileOptions,
    isLoading,
    isSubmitting,
    error,
    addTileOption,
    updateTileOption,
    deleteTileOption,
    retryConnection
  } = useQuickCalculatorTiles();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTileOption, setCurrentTileOption] = useState<QuickCalculatorTile | null>(null);

  // Open dialog for adding or editing
  const openDialog = (tileOption: QuickCalculatorTile | null = null) => {
    setCurrentTileOption(tileOption);
    setIsDialogOpen(true);
  };

  // Handle form submit
  const onSubmit = async (data: any) => {
    // Parse the price_per_sqm as a float directly
    let success = false;
    
    if (currentTileOption) {
      success = await updateTileOption(currentTileOption.id, data);
    } else {
      success = await addTileOption(data);
    }
    
    if (success) {
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Snelle Calculator Tegelopties</h2>
        <Button onClick={() => openDialog()} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Nieuwe tegeloptie</span>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-1">Database verbindingsfout</div>
            <div>{error}</div>
            <div className="text-sm mt-2">
              De RLS policies zijn mogelijk niet correct ingesteld voor de quick_calculator_tiles tabel.
              Controleer of de tabel bestaat en de juiste rechten heeft.
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Retry connection button */}
      {error && !isLoading && (
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={retryConnection}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Opnieuw verbinden met database
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TileOptionsTable 
            tileOptions={tileOptions}
            isLoading={isLoading}
            onEdit={openDialog}
            onDelete={deleteTileOption}
          />
        </div>

        <div className="md:col-span-1">
          <QuickCalculatorPreview tileOptions={tileOptions} />
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentTileOption ? "Tegeloptie bewerken" : "Nieuwe tegeloptie"}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            <TileOptionForm
              initialData={currentTileOption}
              isSubmitting={isSubmitting}
              onSubmit={onSubmit}
              onCancel={() => setIsDialogOpen(false)}
              isEditing={!!currentTileOption}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuickCalculatorManager;
