
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface HolidayDiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: () => void;
}

const HolidayDiscountDialog = ({ 
  open, 
  onOpenChange, 
  onApply 
}: HolidayDiscountDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Speciale Vakantie Aanbieding</DialogTitle>
          <DialogDescription>
            Profiteer nu van onze speciale vakantiekorting op tegelwerken!
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-lg font-semibold text-primary">5% korting</p>
          <p className="mt-2">
            Boek nu uw tegelwerken en geniet van deze beperkte aanbieding.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Later
          </Button>
          <Button onClick={onApply}>
            Korting toepassen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HolidayDiscountDialog;
