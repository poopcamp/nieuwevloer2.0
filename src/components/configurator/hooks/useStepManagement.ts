
import { useMemo } from 'react';

interface StepInfo {
  stepNumber: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

/**
 * Hook for managing step information in multi-step configurator
 */
export function useStepManagement(
  currentStep: number,
  isStepVisible: (stepNumber: number) => boolean,
  excludeSteps: number[] = []
) {
  // Generate step titles for all steps
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

  // Create step info for all applicable steps
  const stepInfo = useMemo(() => {
    // Get all step numbers from 1 to 8 except excluded steps
    const stepNumbers = Array.from({ length: 8 }, (_, i) => i + 1)
      .filter(step => !excludeSteps.includes(step));
    
    return stepNumbers.map(stepNumber => ({
      stepNumber,
      title: getStepTitle(stepNumber),
      isActive: isStepVisible(stepNumber),
      isCompleted: currentStep > stepNumber
    }));
  }, [currentStep, isStepVisible, excludeSteps]);
  
  return {
    stepInfo,
    getStepTitle,
    totalSteps: stepInfo.length,
    currentStepIndex: stepInfo.findIndex(step => step.stepNumber === currentStep),
    progress: calculateProgress(currentStep, stepInfo.length)
  };
}

/**
 * Calculate progress percentage based on current step and total steps
 */
function calculateProgress(currentStep: number, totalSteps: number): number {
  // Ensure valid input
  if (totalSteps <= 0) return 0;
  if (currentStep <= 0) return 0;
  
  // Calculate percentage
  const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
  
  // Clamp between 0 and 100
  return Math.min(100, Math.max(0, percentage));
}
