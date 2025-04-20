
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Save } from "lucide-react";

interface ActionButtonsProps {
  onAddExample: () => void;
  onSave: () => void;
  saving: boolean;
}

const ActionButtons = ({ onAddExample, onSave, saving }: ActionButtonsProps) => {
  return (
    <div className="flex justify-between pt-4">
      <Button 
        variant="outline" 
        onClick={onAddExample} 
        className="gap-2"
      >
        <PlusCircle className="h-4 w-4" />
        Voorbeeld Toevoegen
      </Button>
      
      <Button 
        onClick={onSave} 
        disabled={saving}
        className="gap-2"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Voorbeelden Opslaan
      </Button>
    </div>
  );
};

export default ActionButtons;
