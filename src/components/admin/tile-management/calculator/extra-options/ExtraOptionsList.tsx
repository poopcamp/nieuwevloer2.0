
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExtraOption } from "./hooks/useExtraOptions";
import { PROJECT_TYPES } from "./constants";

interface ExtraOptionsListProps {
  extraOptions: ExtraOption[];
  onUpdate: (id: string, field: string, value: string | number) => void;
  onDelete: (id: string, name: string) => void;
}

const ExtraOptionsList = ({ extraOptions, onUpdate, onDelete }: ExtraOptionsListProps) => {
  return (
    <div className="space-y-4">
      {extraOptions.map((option) => (
        <div key={option.id} className="flex items-center space-x-2 flex-wrap gap-2">
          <div className="flex-grow min-w-[180px] md:min-w-0">
            <Label>Optie naam:</Label>
            <Input
              value={option.name}
              onChange={(e) => onUpdate(option.id, 'name', e.target.value)}
            />
          </div>
          <div className="w-32">
            <Label>Prijs:</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={option.price}
                className="pl-7"
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 0) {
                    onUpdate(option.id, 'price', value);
                  }
                }}
              />
            </div>
          </div>
          <div className="w-40">
            <Label>Project type:</Label>
            <Select
              value={option.project_type || "all"}
              onValueChange={(value) => onUpdate(option.id, 'project_type', value === 'all' ? null : value)}
            >
              <SelectTrigger>
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
          <div className="flex-shrink-0 mt-4 md:mt-6">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => onDelete(option.id, option.name)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExtraOptionsList;
