
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";

interface EmptyOptionsStateProps {
  onAddSampleData: () => void;
  isSaving: boolean;
}

const EmptyOptionsState = ({ onAddSampleData, isSaving }: EmptyOptionsStateProps) => {
  return (
    <div className="space-y-4">
      <Card className="bg-gray-50 p-4">
        <p className="text-sm text-gray-500 text-center">
          Geen extra opties gevonden.
        </p>
        <p className="text-xs text-gray-400 text-center mt-1">
          Gebruik het formulier hieronder om extra opties toe te voegen
          of voeg enkele voorbeeldopties toe.
        </p>
      </Card>
      
      <div className="flex justify-center">
        <Button 
          variant="outline"
          onClick={onAddSampleData}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Voorbeeldgegevens toevoegen
        </Button>
      </div>
    </div>
  );
};

export default EmptyOptionsState;
