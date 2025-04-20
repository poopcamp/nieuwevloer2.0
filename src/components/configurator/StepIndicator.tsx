
import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  const stepNames = ["Type", "Details", "Extra", "Contact", "Overzicht"];
  
  return (
    <div className="w-full pb-2">
      <div className="flex items-center justify-between relative">
        {/* Horizontal line behind the steps */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
        
        {/* Steps */}
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index} 
            className="relative flex flex-col items-center z-10"
          >
            <div 
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-200 ${
                index + 1 < currentStep 
                  ? 'bg-primary text-white border-primary' 
                  : index + 1 === currentStep
                  ? 'bg-white text-primary border-primary' 
                  : 'bg-white text-gray-400 border-gray-200'
              }`}
            >
              {index + 1 < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                index + 1
              )}
            </div>
            <span className={`mt-2 text-xs truncate w-16 text-center ${
              index + 1 === currentStep ? 'text-primary' : 'text-gray-500'
            }`}>
              {stepNames[index] || `Stap ${index + 1}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
