
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormFooterProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

const FormFooter = ({ isSubmitting, onCancel }: FormFooterProps) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-gray-300"
          disabled={isSubmitting}
        >
          Annuleren
        </Button>
        <Button 
          type="submit"
          className="gap-2" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Bezig met versturen...
            </>
          ) : (
            "Verstuur aanvraag"
          )}
        </Button>
      </div>
      
      <div className="text-xs text-gray-500 pt-4 border-t border-gray-100 mt-4">
        <p>Door te verzenden gaat u akkoord met onze <a href="/privacy" className="text-primary hover:underline">privacyverklaring</a>. Uw gegevens worden maximaal 12 maanden bewaard, enkel intern gebruikt en nooit gedeeld met derden zonder uw toestemming.</p>
      </div>
    </>
  );
};

export default FormFooter;
