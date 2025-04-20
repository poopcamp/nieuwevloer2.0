
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FullBathroomOptionProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onSiteVisitRequest: () => void;
  onResetOtherOptions?: () => void;
}

const FullBathroomOption = ({ 
  checked, 
  onCheckedChange, 
  onSiteVisitRequest,
  onResetOtherOptions
}: FullBathroomOptionProps) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleChange = (checked: boolean) => {
    if (checked) {
      // Reset other options when full bathroom renovation is selected
      if (onResetOtherOptions) {
        onResetOtherOptions();
      }
      
      // Show dialog
      setShowDialog(true);
    }
    
    onCheckedChange(checked);
  };

  return (
    <>
      <div className="flex items-start space-x-3 p-4 border-2 border-primary rounded-md bg-primary/5 hover:bg-primary/10 transition-all">
        <Checkbox 
          id="fullBathroomRenovation" 
          checked={checked}
          onCheckedChange={(checked) => handleChange(!!checked)}
          className="mt-1"
        />
        <div>
          <Label 
            htmlFor="fullBathroomRenovation"
            className="font-medium cursor-pointer"
          >
            Wil je een volledige badkamerrenovatie?
          </Label>
          <p className="text-sm text-gray-600 mt-1">
            Inclusief sanitair, leidingen, elektriciteit en afwerking
          </p>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Volledige badkamerrenovatie</DialogTitle>
            <DialogDescription>
              Volledige badkamerrenovaties zijn maatwerk. We plannen hiervoor graag een plaatsbezoek in zodat we alles correct kunnen inschatten. We werken daarbij samen met betrouwbare sanitairs en elektriciens zodat jij één aanspreekpunt hebt en volledig ontzorgd wordt.
            </DialogDescription>
          </DialogHeader>
          
          <div className="pt-4">
            <Button 
              onClick={() => {
                onSiteVisitRequest();
                setShowDialog(false);
              }}
              className="w-full"
            >
              Plaatsbezoek aanvragen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FullBathroomOption;
