
import React from "react";
import { Card } from "@/components/ui/card";
import { ConfiguratorState } from "./types";
import ConfiguratorSummary from "./ConfiguratorSummary";
import { calculatePrice } from "@/utils/configuratorPricing";
import ProgressCard from "./ProgressCard";
import ConfiguratorAccordion from "./ConfiguratorAccordion";
import DisclaimerCard from "./DisclaimerCard";
import ContactPopup from "./contact/ContactPopup";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

interface ConfiguratorContentProps {
  state: ConfiguratorState;
  updateState: (updates: Partial<ConfiguratorState>) => void;
  step: number;
  progress: number;
  expandedSteps: string[];
  isStepVisible: (stepNumber: number) => boolean;
  onStepClick: (stepNumber: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  showContactPopup: boolean;
  setShowContactPopup: (show: boolean) => void;
}

const ConfiguratorContent = ({
  state,
  updateState,
  step,
  progress,
  expandedSteps,
  isStepVisible,
  onStepClick,
  onPrevious,
  onNext,
  showContactPopup,
  setShowContactPopup
}: ConfiguratorContentProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const price = calculatePrice(state);

  const handleContactSuccess = (contactData: Partial<ConfiguratorState>) => {
    updateState(contactData);
    
    // Move to the success step
    onStepClick(8);
    
    toast({
      title: "Offerte aangevraagd!",
      description: "We hebben uw configuratie ontvangen. U ontvangt spoedig een e-mail met uw offerte.",
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/4">
        <ProgressCard 
          progress={progress} 
          currentStep={step} 
          totalSteps={5} 
        />
        
        {!isMobile && (
          <DisclaimerCard />
        )}
      </div>
      
      <div className="w-full lg:w-1/2">
        <Card className="overflow-hidden shadow-lg border-0">
          <div className="p-4 sm:p-6">
            <ConfiguratorAccordion
              currentStep={step}
              expandedSteps={expandedSteps}
              isStepVisible={isStepVisible}
              updateState={updateState}
              state={state}
              onStepClick={onStepClick}
              onPrevious={onPrevious}
              onNext={onNext}
            />
          </div>
        </Card>
      </div>
      
      <div className="w-full lg:w-1/4">
        <ConfiguratorSummary 
          state={state} 
          price={price} 
        />
        
        {isMobile && (
          <DisclaimerCard />
        )}
      </div>

      <ContactPopup 
        open={showContactPopup} 
        onOpenChange={setShowContactPopup}
        state={state}
        onSuccess={handleContactSuccess}
      />
    </div>
  );
};

export default ConfiguratorContent;
