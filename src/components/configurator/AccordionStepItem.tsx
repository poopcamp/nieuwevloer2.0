
import React from "react";
import { 
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";
import { ConfiguratorState } from "./types";
import StepContent from "./StepContent";
import NavigationButtons from "./NavigationButtons";
import AccordionStepHeader from "./AccordionStepHeader";

interface AccordionStepItemProps {
  stepNumber: number;
  currentStep: number;
  value: string;
  isVisible: boolean;
  onStepClick: () => void;
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const getStepTitle = (stepNumber: number): string => {
  switch (stepNumber) {
    case 1: return "Projecttype";
    case 2: return "Vloerdetails";
    case 3: return "Wanddetails";
    case 4: return "Badkamerdetails";
    case 5: return "Project details";
    case 6: return "Extra werken";
    case 7: return "Contactgegevens";
    case 8: return "Bevestiging";
    default: return `Stap ${stepNumber}`;
  }
};

const AccordionStepItem = ({ 
  stepNumber,
  currentStep,
  value,
  isVisible,
  onStepClick,
  state,
  updateState,
  onPrevious,
  onNext
}: AccordionStepItemProps) => {
  if (!isVisible) return null;
  
  return (
    <AccordionItem 
      value={value}
      className={`border rounded-lg ${
        currentStep === stepNumber 
          ? 'bg-primary/5 border-primary/20' 
          : 'border-gray-200'
      } overflow-hidden mb-4`}
    >
      <AccordionTrigger 
        className={`px-4 py-0 ${currentStep === stepNumber ? 'text-primary font-medium' : ''} [&[data-state=open]>div>svg]:rotate-180 [&>div>svg]:transition-transform`}
        onClick={() => currentStep >= stepNumber && onStepClick()}
        disabled={currentStep < stepNumber}
      >
        <AccordionStepHeader 
          stepNumber={stepNumber}
          currentStep={currentStep}
          title={getStepTitle(stepNumber)}
          onClick={() => currentStep >= stepNumber && onStepClick()}
          disabled={currentStep < stepNumber}
        />
      </AccordionTrigger>
      <AccordionContent className="px-4 py-5 bg-white">
        <StepContent 
          step={stepNumber} 
          state={state} 
          updateState={updateState} 
        />
        
        {currentStep === stepNumber && (
          <NavigationButtons 
            currentStep={currentStep}
            isFirstStep={currentStep === 1}
            onPrevious={onPrevious}
            onNext={onNext}
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default AccordionStepItem;
