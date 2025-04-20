
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash } from "lucide-react";
import { ServiceItem as ServiceItemType } from "./types";

interface ServiceItemProps {
  service: ServiceItemType;
  index: number;
  onInputChange: (index: number, field: keyof ServiceItemType, value: string) => void;
  onRemove: (index: number) => void;
}

const ServiceItem = ({ service, index, onInputChange, onRemove }: ServiceItemProps) => {
  return (
    <div className="border p-4 rounded-md space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="font-medium">Dienst {index + 1}</h3>
        <Button 
          variant="destructive" 
          size="icon" 
          onClick={() => onRemove(index)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`service-title-${index}`}>Titel</Label>
          <Input 
            id={`service-title-${index}`}
            value={service.title}
            onChange={(e) => onInputChange(index, 'title', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`service-link-${index}`}>Link URL</Label>
          <Input 
            id={`service-link-${index}`}
            value={service.linkUrl}
            onChange={(e) => onInputChange(index, 'linkUrl', e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`service-description-${index}`}>Beschrijving</Label>
        <Textarea 
          id={`service-description-${index}`}
          value={service.description}
          onChange={(e) => onInputChange(index, 'description', e.target.value)}
          rows={2}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`service-icon-${index}`}>Icoon (emoji)</Label>
        <Input 
          id={`service-icon-${index}`}
          value={service.icon}
          onChange={(e) => onInputChange(index, 'icon', e.target.value)}
          maxLength={2}
          className="w-20"
        />
      </div>
    </div>
  );
};

export default ServiceItem;
