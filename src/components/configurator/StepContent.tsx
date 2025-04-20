
import { ConfiguratorState } from "./types";
import ProjectTypeStep from "./steps/ProjectTypeStep";
import FloorStep from "./steps/FloorStep";
import KitchenWallStep from "./steps/KitchenWallStep";
import BathroomStep from "./steps/BathroomStep";
import OtherStep from "./steps/OtherStep";
import AdditionalWorkStep from "./steps/AdditionalWorkStep";
import ContactInformationStep from "./steps/ContactInformationStep";
import SuccessStep from "./steps/SuccessStep";

interface StepContentProps {
  step: number;
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
}

interface StepComponentProps {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
}

// Step component mapping with proper typing
const STEP_COMPONENTS: Record<number, React.ComponentType<StepComponentProps>> = {
  1: ProjectTypeStep,
  2: FloorStep,
  3: KitchenWallStep,
  4: BathroomStep,
  5: OtherStep,
  6: AdditionalWorkStep,
  7: ContactInformationStep,
};

const StepContent = ({ step, state, updateState }: StepContentProps) => {
  // For success step (step 8), we need to pass specific props
  if (step === 8) {
    return (
      <SuccessStep 
        email={state.email || ''} 
        inspirationStyle={state.selectedInspirationStyle} 
      />
    );
  }
  
  // Get the component for the current step or default to ProjectTypeStep
  const StepComponent = STEP_COMPONENTS[step] || ProjectTypeStep;
  
  // For all other steps, pass state and updateState
  return <StepComponent state={state} updateState={updateState} />;
};

export default StepContent;
