
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PartyPopper } from "lucide-react";
import { HolidayDiscount } from "./types";

interface DiscountItemProps {
  discount: HolidayDiscount;
  index: number;
  onInputChange: (index: number, field: keyof HolidayDiscount, value: any) => void;
}

const DiscountItem = ({ discount, index, onInputChange }: DiscountItemProps) => {
  return (
    <div className="border p-4 rounded-md space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <PartyPopper className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Feestdagkorting</h3>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor={`discount-enabled-${index}`} className="text-sm">
            {discount.enabled ? "Actief" : "Inactief"}
          </Label>
          <Switch
            id={`discount-enabled-${index}`}
            checked={discount.enabled}
            onCheckedChange={(checked) => onInputChange(index, 'enabled', checked)}
          />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`discount-name-${index}`}>Kortingsnaam</Label>
          <Input 
            id={`discount-name-${index}`}
            value={discount.name}
            onChange={(e) => onInputChange(index, 'name', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`discount-percentage-${index}`}>Kortingspercentage (%)</Label>
          <Input 
            id={`discount-percentage-${index}`}
            type="number"
            min="1"
            max="50"
            value={discount.discount_percentage}
            onChange={(e) => onInputChange(index, 'discount_percentage', parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`discount-from-${index}`}>Geldig vanaf</Label>
          <Input 
            id={`discount-from-${index}`}
            type="date"
            value={discount.valid_from}
            onChange={(e) => onInputChange(index, 'valid_from', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`discount-until-${index}`}>Geldig tot</Label>
          <Input 
            id={`discount-until-${index}`}
            type="date"
            value={discount.valid_until}
            onChange={(e) => onInputChange(index, 'valid_until', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default DiscountItem;
