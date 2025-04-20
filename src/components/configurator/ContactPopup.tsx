
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ContactForm from "./contact/ContactForm";

interface ContactPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: any;
  onSuccess: (contactData: any) => void;
}

const ContactPopup = ({ 
  open, 
  onOpenChange, 
  state, 
  onSuccess 
}: ContactPopupProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col overflow-hidden p-0">
        <ScrollArea className="flex-1 overflow-auto">
          <div className="p-6">
            <ContactForm 
              formData={state} 
              onSuccess={onSuccess}
              onCancel={() => onOpenChange(false)}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ContactPopup;
