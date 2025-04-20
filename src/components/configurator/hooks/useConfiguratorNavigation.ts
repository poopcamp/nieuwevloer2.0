
import { useState, useEffect } from "react";
import { ConfiguratorState } from "../types";
import { validateCurrentStep } from "@/utils/configuratorValidation";
import { getNextStep, getPreviousStep } from "@/utils/configuratorNavigation";
import { useToast } from "@/hooks/use-toast";

export function useConfiguratorNavigation(state: ConfiguratorState) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [expandedSteps, setExpandedSteps] = useState<string[]>(["step-1"]);
  const [progress, setProgress] = useState(0);
  const [showContactPopup, setShowContactPopup] = useState(false);
  
  useEffect(() => {
    const maxSteps = getMaxStepsForProjectType(state.projectType);
    const currentProgress = Math.min(100, (step / maxSteps) * 100);
    setProgress(currentProgress);
  }, [step, state.projectType]);

  const getMaxStepsForProjectType = (projectType: ConfiguratorState["projectType"]) => {
    const baseSteps = 6; // Changed from 7 to 6 (removed contact information step)
    return baseSteps + 1;
  };
  
  const nextStep = () => {
    const validation = validateCurrentStep(step, state);
    
    if (!validation.isValid) {
      if (validation.toast) {
        toast(validation.toast);
      }
      return;
    }
    
    // For specific steps in the flow, show contact popup
    if (step === 2 && state.projectType === "vloer") {
      setShowContactPopup(true);
      return;
    }
    
    if (step === 3 && state.projectType === "keukenwand") {
      setShowContactPopup(true);
      return;
    }
    
    if (step === 4 && state.projectType === "badkamer") {
      setShowContactPopup(true);
      return;
    }
    
    // After additional works (step 6), always show contact popup regardless of project type
    if (step === 6) {
      setShowContactPopup(true);
      return;
    }
    
    const nextStepNumber = getNextStep(step, state.projectType);
    setStep(nextStepNumber);
    
    setExpandedSteps([`step-${nextStepNumber}`]);
  };
  
  const prevStep = () => {
    const previousStepNumber = getPreviousStep(step, state.projectType);
    setStep(previousStepNumber);
    
    setExpandedSteps([`step-${previousStepNumber}`]);
  };
  
  const isStepVisible = (stepNumber: number): boolean => {
    if (stepNumber === 1) return true;
    if (stepNumber === 6 || stepNumber === 8) return step >= stepNumber;
    
    // Remove step 7 from visibility
    if (stepNumber === 7) return false;
    
    // Fix for the project type visibility
    if (state.projectType === "vloer" && stepNumber === 2) return true;
    if (state.projectType === "keukenwand" && stepNumber === 3) return true;
    if (state.projectType === "badkamer" && stepNumber === 4) return true;
    if (state.projectType === "andere" && stepNumber === 5) return true;
    
    return false;
  };

  const handleStepClick = (stepNumber: number) => {
    if (step >= stepNumber) {
      setExpandedSteps([`step-${stepNumber}`]);
      setStep(stepNumber);
    }
  };

  return {
    step,
    setStep,
    expandedSteps,
    setExpandedSteps,
    progress,
    showContactPopup,
    setShowContactPopup,
    nextStep,
    prevStep,
    isStepVisible,
    handleStepClick
  };
}
