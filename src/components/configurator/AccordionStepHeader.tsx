
import React from "react";
import { Check, ChevronDown } from "lucide-react";

interface AccordionStepHeaderProps {
  stepNumber: number;
  currentStep: number;
  title: string;
  onClick: () => void;
  disabled: boolean;
}

const AccordionStepHeader = ({ 
  stepNumber, 
  currentStep, 
  title, 
  onClick, 
  disabled 
}: AccordionStepHeaderProps) => {
  const isCompleted = currentStep > stepNumber;
  const isActive = currentStep === stepNumber;
  
  // Display number for the UI (accounting for the gap at step 7)
  const displayNumber = stepNumber > 7 ? stepNumber - 1 : stepNumber;
  
  return (
    <div 
      className={`flex items-center w-full py-3 ${!disabled && 'cursor-pointer'}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
        isCompleted 
          ? 'bg-primary text-white' 
          : isActive
            ? 'bg-white text-primary border-2 border-primary' 
            : 'bg-gray-100 text-gray-400 border border-gray-200'
      }`}>
        {isCompleted ? (
          <Check className="h-5 w-5" />
        ) : (
          displayNumber
        )}
      </div>
      <span className={`font-medium ${
        isActive ? 'text-primary' : isCompleted ? 'text-gray-800' : 'text-gray-400'
      }`}>
        {title}
      </span>
      {isActive && (
        <span className="ml-auto text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-md">
          Huidige stap
        </span>
      )}
      
      <ChevronDown className={`ml-4 h-5 w-5 text-gray-400 transition-transform ${isActive ? 'rotate-180' : ''}`} />
    </div>
  );
};

export default AccordionStepHeader;
