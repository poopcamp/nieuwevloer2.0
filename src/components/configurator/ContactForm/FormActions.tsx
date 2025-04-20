
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, SendIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

const FormActions = ({ isSubmitting, onCancel }: FormActionsProps) => {
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Reset success state when submission completes
  useEffect(() => {
    if (!isSubmitting && showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
    
    // Set success indicator when form submission completes
    if (!isSubmitting && !showSuccess) {
      setShowSuccess(true);
    }
  }, [isSubmitting, showSuccess]);

  const handleCancel = () => {
    if (isSubmitting) {
      toast({
        title: "Verzending is bezig",
        description: "Wacht alstublieft tot het formulier is verzonden of probeer het later opnieuw.",
        variant: "destructive",
      });
      return;
    }
    onCancel();
  };

  return (
    <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3 justify-end">
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleCancel}
        className="border-gray-300 w-full sm:w-auto"
        disabled={isSubmitting}
      >
        Later invullen
      </Button>
      
      <Button 
        type="submit" 
        className={`gap-2 transition-all duration-300 w-full sm:w-auto ${showSuccess ? "bg-green-600 hover:bg-green-700" : ""}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Bezig met versturen...</span>
          </>
        ) : showSuccess ? (
          <>
            <CheckCircle className="h-4 w-4" />
            <span>Verzonden!</span>
          </>
        ) : (
          <>
            <SendIcon className="h-4 w-4" />
            <span>Verstuur aanvraag</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default FormActions;
