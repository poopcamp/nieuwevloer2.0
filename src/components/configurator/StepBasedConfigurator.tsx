
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ConfiguratorState } from "./types";
import { calculatePrice } from "@/utils/configuratorPricing";
import ConfiguratorIntroWrapper from "./ConfiguratorIntroWrapper";
import ConfiguratorContent from "./ConfiguratorContent";
import { useSavedConfiguration } from "./hooks/useSavedConfiguration";
import { useConfiguratorNavigation } from "./hooks/useConfiguratorNavigation";
import { InspirationTile } from "../home/inspiration/types";
import { TileExample } from "@/types/homeContent";

interface StepBasedConfiguratorProps {
  initialProjectType?: string | null;
  selectedInspirationStyle?: InspirationTile | null;
  selectedTile?: TileExample | null;
}

const StepBasedConfigurator = ({ 
  initialProjectType, 
  selectedInspirationStyle,
  selectedTile
}: StepBasedConfiguratorProps) => {
  const [showIntro, setShowIntro] = useState(true);
  const { state, updateState, hasLoadedSavedConfig } = useSavedConfiguration();
  const {
    step,
    progress,
    expandedSteps,
    showContactPopup,
    setShowContactPopup,
    nextStep,
    prevStep,
    isStepVisible,
    handleStepClick
  } = useConfiguratorNavigation(state);
  
  // Set initial project type if provided or skip intro if saved config was loaded
  useEffect(() => {
    if (initialProjectType) {
      const validProjectTypes = ["vloer", "keukenwand", "badkamer", "andere"];
      if (validProjectTypes.includes(initialProjectType)) {
        updateState({ projectType: initialProjectType as ConfiguratorState["projectType"] });
        setShowIntro(false);
      }
    }
    
    // Skip intro if we loaded a saved configuration
    if (hasLoadedSavedConfig) {
      setShowIntro(false);
    }
    
    // Als er een inspiratiestijl is geselecteerd, sla deze op in de state
    if (selectedInspirationStyle) {
      updateState({ 
        selectedInspirationStyle: {
          id: selectedInspirationStyle.id,
          title: selectedInspirationStyle.title,
          image: selectedInspirationStyle.image
        }
      });
      setShowIntro(false);
    }
    
    // Als er een tegel is geselecteerd, sla deze op in de state
    if (selectedTile) {
      updateState({
        selectedTileExample: {
          id: selectedTile.id,
          name: selectedTile.name,
          size: selectedTile.size,
          description: selectedTile.description || ""
        }
      });
      setShowIntro(false);
    }
  }, [initialProjectType, updateState, hasLoadedSavedConfig, selectedInspirationStyle, selectedTile]);
  
  const handleStartConfigurator = () => {
    setShowIntro(false);
  };
  
  if (showIntro) {
    return <ConfiguratorIntroWrapper onStart={handleStartConfigurator} />;
  }
  
  return (
    <ConfiguratorContent
      state={state}
      updateState={updateState}
      step={step}
      progress={progress}
      expandedSteps={expandedSteps}
      isStepVisible={isStepVisible}
      onStepClick={handleStepClick}
      onPrevious={prevStep}
      onNext={nextStep}
      showContactPopup={showContactPopup}
      setShowContactPopup={setShowContactPopup}
    />
  );
};

export default StepBasedConfigurator;
