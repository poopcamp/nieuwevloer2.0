
import { ConfiguratorState } from "./types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import ContactFormContent from "./ContactForm/ContactFormContent";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<ConfiguratorState>) => void;
  initialData: ConfiguratorState;
}

const ContactDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData 
}: ContactDialogProps) => {
  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = (data: Partial<ConfiguratorState>) => {
    onSubmit(data);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Laatste stap: uw gegevens
          </DialogTitle>
          <DialogDescription>
            Vul uw contactgegevens in om uw offerte te ontvangen en een afspraak te maken.
          </DialogDescription>
        </DialogHeader>
        
        <ContactFormContent 
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
