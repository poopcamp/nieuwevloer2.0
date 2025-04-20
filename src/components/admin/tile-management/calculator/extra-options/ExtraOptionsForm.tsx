
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewOptionState } from "./hooks/useExtraOptions";
import { PROJECT_TYPES } from "./constants";

interface ExtraOptionsFormProps {
  newOption: NewOptionState;
  setNewOption: (option: NewOptionState) => void;
  onAddOption: () => void;
  isSaving: boolean;
}

const ExtraOptionsForm = ({ 
  newOption, 
  setNewOption, 
  onAddOption, 
  isSaving 
}: ExtraOptionsFormProps) => {
  return (
    <div className="pt-4 border-t">
      <h3 className="text-sm font-medium mb-4">Nieuwe extra optie toevoegen</h3>
      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex-grow min-w-[180px] md:min-w-0">
          <Label htmlFor="new-option-name">Optie naam</Label>
          <Input
            id="new-option-name"
            placeholder="bijv. Vloerverwarming"
            value={newOption.name}
            onChange={(e) => setNewOption({...newOption, name: e.target.value})}
          />
        </div>
        <div className="w-32">
          <Label htmlFor="new-option-price">Prijs</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
            <Input
              id="new-option-price"
              type="number"
              step="0.1"
              min="0"
              placeholder="0.00"
              className="pl-7"
              value={newOption.price}
              onChange={(e) => setNewOption({...newOption, price: e.target.value})}
            />
          </div>
        </div>
        <div className="w-40">
          <Label htmlFor="new-option-project-type">Project type</Label>
          <Select
            value={newOption.project_type}
            onValueChange={(value) => setNewOption({...newOption, project_type: value})}
          >
            <SelectTrigger id="new-option-project-type">
              <SelectValue placeholder="Projecttype" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={onAddOption}
          disabled={isSaving || !newOption.name || !newOption.price}
          className="flex-shrink-0 h-10"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Toevoegen
        </Button>
      </div>
    </div>
  );
};

export default ExtraOptionsForm;
