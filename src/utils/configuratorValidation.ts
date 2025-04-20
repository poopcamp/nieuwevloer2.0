
import { ConfiguratorState } from "@/components/configurator/types";
import { ToastAction } from "@/components/ui/toast";
import React from "react";

// Define the Toast type based on what the toast function expects
export type ValidationResult = {
  isValid: boolean;
  toast?: {
    title?: string;
    description?: React.ReactNode;
    action?: React.ReactElement<typeof ToastAction>;
    variant?: "default" | "destructive";
  };
};

export const validateCurrentStep = (
  step: number, 
  state: ConfiguratorState
): ValidationResult => {
  if (step === 1 && !state.projectType) {
    return {
      isValid: false,
      toast: {
        title: "Selecteer een projecttype",
        description: "Kies eerst het type project waarvoor u een offerte wilt.",
        variant: "destructive",
      }
    };
  }
  
  if (step === 2 && !state.floorType) {
    return {
      isValid: false,
      toast: {
        title: "Vloertype ontbreekt",
        description: "Selecteer het type vloer voordat u verdergaat.",
        variant: "destructive",
      }
    };
  }
  
  if (step === 3 && !state.wallType) {
    return {
      isValid: false,
      toast: {
        title: "Wandtype ontbreekt",
        description: "Selecteer het type wand voordat u verdergaat.",
        variant: "destructive",
      }
    };
  }
  
  if (step === 4 && state.projectType === "badkamer" && 
      state.bathroomOptions && 
      !Object.values(state.bathroomOptions).some(Boolean) && 
      !state.fullBathroomRenovation) {
    return {
      isValid: false,
      toast: {
        title: "Badkamer onderdelen ontbreken",
        description: "Selecteer minstens één badkameronderdeel of kies voor een volledige badkamerrenovatie voordat u verdergaat.",
        variant: "destructive",
      }
    };
  }
  
  // We don't need validation for step 7 anymore as it will be skipped
  // The contact data validation will happen in the ContactPopup component
  
  return { isValid: true };
};
