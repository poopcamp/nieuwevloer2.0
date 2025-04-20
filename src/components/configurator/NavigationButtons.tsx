
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

interface NavigationButtonsProps {
  currentStep: number;
  isFirstStep: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const NavigationButtons = ({ 
  currentStep, 
  isFirstStep, 
  onPrevious, 
  onNext 
}: NavigationButtonsProps) => {
  return (
    <div className="mt-10 flex justify-between">
      <Button
        onClick={onPrevious}
        variant="outline"
        size="lg"
        className={isFirstStep ? 'opacity-50 cursor-not-allowed' : ''}
        disabled={isFirstStep}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Vorige
      </Button>
      <Button
        onClick={onNext}
        variant="default"
        size="lg"
        className="shadow-md"
      >
        {currentStep < 7 ? (
          <>
            Volgende
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        ) : currentStep === 7 ? (
          <>
            Verstuur
            <Send className="ml-2 h-4 w-4" />
          </>
        ) : (
          "Afronden"
        )}
      </Button>
    </div>
  );
};

export default NavigationButtons;
