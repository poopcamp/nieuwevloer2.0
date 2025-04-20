
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TileFormatOption {
  value: string;
  label: string;
  selected?: boolean;
}

interface TileFormatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: TileFormatOption[];
  selectedFormat: string;
  onSelect: (format: string) => void;
}

const TileFormatDialog = ({
  open,
  onOpenChange,
  options,
  selectedFormat,
  onSelect
}: TileFormatDialogProps) => {
  const handleSelect = (format: string) => {
    onSelect(format);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">Kies tegelformaat</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-1 max-h-[60vh] overflow-y-auto">
          {options.map((option) => (
            <div 
              key={option.value}
              className={`p-4 flex items-center rounded-md cursor-pointer transition-colors ${
                selectedFormat === option.value ? 'bg-primary/10' : 'hover:bg-gray-100'
              }`}
              onClick={() => handleSelect(option.value)}
            >
              <div className={`w-5 h-5 mr-3 flex-shrink-0 rounded-full border-4 ${
                selectedFormat === option.value ? 'border-primary' : 'border-gray-300'
              }`} />
              <span className="text-sm font-medium">{option.label}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuleren
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TileFormatDialog;
