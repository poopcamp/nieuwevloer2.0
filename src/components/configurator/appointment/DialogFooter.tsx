
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, X, CheckCircle2 } from "lucide-react";

interface DialogFooterProps {
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const DialogFooter = ({ isSubmitting, onOpenChange, handleSubmit }: DialogFooterProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleSubmitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSubmit(e as unknown as React.FormEvent);
    
    // Reset success state when real submission happens
    if (!isSubmitting) {
      setShowSuccess(false);
    }
  };
  
  return (
    <div className="px-6 pb-6 pt-2 border-t border-gray-100 sticky bottom-0 bg-white z-20">
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => onOpenChange(false)}
          className="h-10 border-gray-300 w-full sm:w-auto"
          disabled={isSubmitting}
        >
          <X className="mr-2 h-4 w-4" />
          Annuleren
        </Button>
        
        <Button 
          type="submit"
          onClick={handleSubmitClick}
          className={`h-10 w-full sm:w-auto ${showSuccess ? "bg-green-600 hover:bg-green-700" : ""}`}
          disabled={isSubmitting || showSuccess}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Bezig met versturen...
            </>
          ) : showSuccess ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Verzonden!
            </>
          ) : (
            <>
              <Calendar className="mr-2 h-4 w-4" />
              Afspraak aanvragen
            </>
          )}
        </Button>
      </div>
      
      <p className="text-xs text-center text-gray-500 mt-4">
        Door te verzenden gaat u akkoord met onze <a href="/privacy" className="text-primary hover:underline">privacyvoorwaarden</a>
      </p>
    </div>
  );
};

export default DialogFooter;
