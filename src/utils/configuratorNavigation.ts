
export const getNextStep = (currentStep: number, projectType: string): number => {
  if (currentStep === 1) {
    if (projectType === "vloer") return 2;
    else if (projectType === "keukenwand") return 3;
    else if (projectType === "badkamer") return 4;
    else if (projectType === "andere") return 5;
    else return 1; // Stay on current step if no project type selected
  } else if (currentStep === 6) {
    // Skip step 7 (contact form) and go straight to step 8 (success)
    return 8;
  } else if (currentStep < 8) {
    return currentStep + 1;
  }
  return 8; // Max step is 8
};

export const getPreviousStep = (currentStep: number, projectType: string): number => {
  if (currentStep === 2 || currentStep === 3 || currentStep === 4 || currentStep === 5) {
    return 1;
  } else if (currentStep === 6) {
    if (projectType === "vloer") return 2;
    else if (projectType === "keukenwand") return 3;
    else if (projectType === "badkamer") return 4;
    else if (projectType === "andere") return 5;
    else return 1;
  } else if (currentStep === 8) {
    // Skip step 7 (contact form) when going back from success step
    return 6;
  } else if (currentStep > 1) {
    return currentStep - 1;
  }
  return 1; // Min step is 1
};
