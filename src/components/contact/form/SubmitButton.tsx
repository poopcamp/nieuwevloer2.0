
import { Button } from "@/components/ui/button";
import { Loader2, SendIcon } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton = ({ isSubmitting }: SubmitButtonProps) => (
  <Button 
    type="submit" 
    className="w-full bg-primary hover:bg-primary/90 transition-colors gap-2 font-medium py-6"
    disabled={isSubmitting}
  >
    {isSubmitting ? (
      <>
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Bezig met verzenden...</span>
      </>
    ) : (
      <>
        <SendIcon className="h-5 w-5" />
        <span>Verstuur bericht</span>
      </>
    )}
  </Button>
);

export default SubmitButton;
