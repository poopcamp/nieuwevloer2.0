
import React from "react";
import { Accordion } from "@/components/ui/accordion";
import AccordionStepItem from "./AccordionStepItem";
import CollapsibleStepsTracker from "./CollapsibleStepsTracker";
import { ConfiguratorState } from "./types";
import { useStepManagement } from "./hooks/useStepManagement";

interface ConfiguratorAccordionProps {
  currentStep: number;
  expandedSteps: string[];
  isStepVisible: (stepNumber: number) => boolean;
  updateState: (updates: Partial<ConfiguratorState>) => void;
  state: ConfiguratorState;
  onStepClick: (stepNumber: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const ConfiguratorAccordion = ({
  currentStep,
  expandedSteps,
  isStepVisible,
  updateState,
  state,
  onStepClick,
  onPrevious,
  onNext
}: ConfiguratorAccordionProps) => {
  // Use the improved step management hook - exclude step 7 (contact details)
  const { stepInfo } = useStepManagement(currentStep, isStepVisible, [7]);

  return (
    <>
      {/* Mobile Steps Tracker */}
      <CollapsibleStepsTracker 
        steps={stepInfo}
        currentStep={currentStep}
        onStepClick={onStepClick}
      />

      {/* Main Accordion */}
      <Accordion
        type="single"
        collapsible
        value={expandedSteps[0]}
        className="space-y-4"
      >
        {/* Map through stepInfo to render accordion items */}
        {stepInfo.map(({ stepNumber }) => (
          <AccordionStepItem
            key={`step-${stepNumber}`}
            stepNumber={stepNumber}
            currentStep={currentStep}
            value={`step-${stepNumber}`}
            isVisible={isStepVisible(stepNumber)}
            onStepClick={() => onStepClick(stepNumber)}
            state={state}
            updateState={updateState}
            onPrevious={onPrevious}
            onNext={onNext}
          />
        ))}
      </Accordion>
    </>
  );
};

export default ConfiguratorAccordion;
