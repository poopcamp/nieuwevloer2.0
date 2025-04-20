
import React from "react";
import { 
  Collapsible, 
  CollapsibleTrigger, 
  CollapsibleContent 
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface StepInfo {
  stepNumber: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface CollapsibleStepsTrackerProps {
  steps: StepInfo[];
  currentStep: number;
  onStepClick: (stepNumber: number) => void;
}

const CollapsibleStepsTracker = ({
  steps,
  currentStep,
  onStepClick
}: CollapsibleStepsTrackerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Filter to only show visible steps
  const visibleSteps = steps.filter(step => 
    step.isActive || step.isCompleted || step.stepNumber === currentStep
  );
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="lg:hidden mb-4 bg-white rounded-lg shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between p-4">
        <span className="font-medium">Huidige stap: {currentStep}. {steps.find(s => s.stepNumber === currentStep)?.title}</span>
        <CollapsibleTrigger className="p-1.5 rounded-md hover:bg-gray-100">
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="border-t">
        <div className="p-4 space-y-2">
          {visibleSteps.map((step) => (
            <div 
              key={step.stepNumber}
              onClick={() => {
                if (step.isCompleted || step.stepNumber === currentStep) {
                  onStepClick(step.stepNumber);
                  setIsOpen(false);
                }
              }}
              className={`flex items-center p-2 rounded-md ${
                step.stepNumber === currentStep 
                  ? 'bg-primary/10 text-primary' 
                  : step.isCompleted
                    ? 'text-gray-900 hover:bg-gray-100 cursor-pointer' 
                    : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                step.isCompleted 
                  ? 'bg-primary text-white' 
                  : step.stepNumber === currentStep
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-gray-100 text-gray-500'
              }`}>
                {step.stepNumber}
              </div>
              <span>{step.title}</span>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleStepsTracker;
