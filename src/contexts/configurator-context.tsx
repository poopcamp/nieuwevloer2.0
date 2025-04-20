
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ConfiguratorState } from '@/components/configurator/types';
import { configurationService } from '@/services/configurationService';

interface ConfiguratorContextValue {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
  resetState: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  navigateToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  calculatePrice: () => string;
  isStepVisible: (step: number) => boolean;
  progress: number;
  expandedSteps: string[];
  isContactDialogOpen: boolean;
  setIsContactDialogOpen: (isOpen: boolean) => void;
  hasChangesSinceLastSave: boolean;
}

// Default state values
const initialState: ConfiguratorState = {
  projectType: undefined,
  squareMeters: 10,
  floorType: undefined,
  tileSize: undefined,
  needsPlinths: false,
  wallType: undefined,
  wallTileSize: undefined,
  bathroomOptions: {
    walkInShower: false,
    shower: false,
    floor: false,
    showerWall: false,
    walls: false,
    toilet: false,
    sink: false,
  },
  bathroomTileSize: undefined,
  otherDescription: '',
  needsChape: false,
  needsElectrician: false,
  name: '',
  email: '',
  phone: '',
  addressStreet: '',
  addressCity: '',
  additionalNotes: '',
  wantsShowroomVisit: false,
  wantsSiteVisit: false,
  showerNis: false,
  showerNisSize: undefined,
  showerNisCustomSize: undefined,
  fullBathroomRenovation: false,
  hasHolidayDiscount: false,
  tilePattern: 'recht',
  wantsToBuyTiles: false,
  tilePricePerSqm: null,
};

const ConfiguratorContext = createContext<ConfiguratorContextValue | undefined>(undefined);

export const ConfiguratorProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ConfiguratorState>(initialState);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [expandedSteps, setExpandedSteps] = useState<string[]>(['step-1']);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [lastSavedState, setLastSavedState] = useState<ConfiguratorState | null>(null);
  
  // Load saved configuration from local storage on initial render
  useEffect(() => {
    const loadSavedConfig = () => {
      try {
        const savedConfig = localStorage.getItem('configuratorState');
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig) as ConfiguratorState;
          setState(parsedConfig);
          setLastSavedState(parsedConfig);
        }
      } catch (error) {
        console.error('Error loading saved configuration:', error);
      } finally {
        setInitialLoadDone(true);
      }
    };

    loadSavedConfig();
  }, []);
  
  // Save configuration to local storage when it changes
  useEffect(() => {
    if (initialLoadDone) {
      try {
        localStorage.setItem('configuratorState', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving configuration:', error);
      }
    }
  }, [state, initialLoadDone]);
  
  // Update state with new values
  const updateState = (updates: Partial<ConfiguratorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };
  
  // Reset state to initial values
  const resetState = () => {
    setState(initialState);
    setCurrentStep(1);
    setExpandedSteps(['step-1']);
    setLastSavedState(null);
    localStorage.removeItem('configuratorState');
  };
  
  // Calculate if a step should be visible based on project type selection
  const isStepVisible = (stepNumber: number): boolean => {
    // Step 1 (project type) is always visible
    if (stepNumber === 1) return true;
    
    // Need project type for any other step
    if (!state.projectType) return false;
    
    switch (stepNumber) {
      case 2: // Floor details
        return state.projectType === 'vloer';
      case 3: // Wall details
        return state.projectType === 'keukenwand';
      case 4: // Bathroom details
        return state.projectType === 'badkamer';
      case 5: // Other project details
        return state.projectType === 'andere';
      case 6: // Additional options
        return !!state.projectType;
      case 7: // Contact details
        return !!state.projectType;
      case 8: // Success
        return !!state.email;
      default:
        return false;
    }
  };
  
  // Navigate to a specific step
  const navigateToStep = (step: number) => {
    if (isStepVisible(step)) {
      setCurrentStep(step);
      setExpandedSteps([`step-${step}`]);
    }
  };
  
  // Go to next step
  const nextStep = () => {
    const nextStepNumber = currentStep + 1;
    
    // Find the next visible step
    for (let step = nextStepNumber; step <= 8; step++) {
      if (isStepVisible(step)) {
        navigateToStep(step);
        return;
      }
    }
  };
  
  // Go to previous step
  const prevStep = () => {
    const prevStepNumber = currentStep - 1;
    
    // Find the previous visible step
    for (let step = prevStepNumber; step >= 1; step--) {
      if (isStepVisible(step)) {
        navigateToStep(step);
        return;
      }
    }
  };
  
  // Calculate progress percentage
  const calculateProgress = (): number => {
    if (!state.projectType) return 0;
    
    const visibleSteps = [1, 2, 3, 4, 5, 6, 7].filter(isStepVisible);
    const currentStepIndex = visibleSteps.indexOf(currentStep);
    
    if (currentStepIndex === -1) return 0;
    return (currentStepIndex / (visibleSteps.length - 1)) * 100;
  };
  
  // Calculate if there are unsaved changes
  const hasChangesSinceLastSave = lastSavedState 
    ? JSON.stringify(state) !== JSON.stringify(lastSavedState) 
    : true;
  
  // Calculate price based on current configuration
  const calculatePrice = (): string => {
    return configurationService.calculatePrice(state);
  };
  
  return (
    <ConfiguratorContext.Provider
      value={{
        state,
        updateState,
        resetState,
        currentStep,
        setCurrentStep,
        navigateToStep,
        nextStep,
        prevStep,
        calculatePrice,
        isStepVisible,
        progress: calculateProgress(),
        expandedSteps,
        isContactDialogOpen,
        setIsContactDialogOpen,
        hasChangesSinceLastSave
      }}
    >
      {children}
    </ConfiguratorContext.Provider>
  );
};

// Custom hook to use the configurator context
export const useConfigurator = (): ConfiguratorContextValue => {
  const context = useContext(ConfiguratorContext);
  
  if (context === undefined) {
    throw new Error('useConfigurator must be used within a ConfiguratorProvider');
  }
  
  return context;
};
