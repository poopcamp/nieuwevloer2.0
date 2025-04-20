
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ConfiguratorState } from "./types";
import { formatPrice, getPriceBreakdown } from "@/utils/configuratorPricing";
import SummaryHeader from "./summary/SummaryHeader";
import ProjectDetails from "./summary/ProjectDetails";
import PriceBreakdown from "./summary/PriceBreakdown";
import IncludedFeatures from "./summary/IncludedFeatures";
import TotalPrice from "./summary/TotalPrice";
import ConfiguratorAppointmentDialog from "./appointment/ConfiguratorAppointmentDialog";

interface ConfiguratorSummaryProps {
  state: ConfiguratorState;
  price: string;
}

const ConfiguratorSummary = ({ state, price }: ConfiguratorSummaryProps) => {
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const priceDisplay = formatPrice(price);
  const breakdown = getPriceBreakdown(state, price);
  const isRequestPrice = parseFloat(price) === 0 || state.fullBathroomRenovation;
  
  // Check if the user has made the necessary selections for calculating price
  const hasRequiredSelections = () => {
    if (!state.projectType) return false;
    
    switch(state.projectType) {
      case 'vloer':
        return !!state.floorType && !!state.tileSize;
      case 'keukenwand':
        return !!state.wallType && !!state.wallTileSize;
      case 'badkamer':
        return !!state.bathroomTileSize;
      case 'andere':
        return !!state.otherDescription;
      default:
        return false;
    }
  };
  
  // Calculate tile costs if applicable
  const squareMetersWithCuttingLoss = state.wantsToBuyTiles && state.squareMeters 
    ? state.squareMeters * 1.1 
    : 0;
    
  const tileCost = state.wantsToBuyTiles && state.tilePricePerSqm && state.squareMeters
    ? squareMetersWithCuttingLoss * state.tilePricePerSqm
    : 0;
  
  // Gebruik console.log om de state te bekijken en te debuggen
  console.log("ConfiguratorSummary state:", state);
  console.log("Has required selections:", hasRequiredSelections());
  
  return (
    <Card className="shadow-md border-0 overflow-hidden">
      <SummaryHeader />
      
      <div className="p-6">
        <ProjectDetails state={state} />
        
        {hasRequiredSelections() && (
          <PriceBreakdown 
            isRequestPrice={isRequestPrice} 
            breakdown={breakdown} 
          />
        )}
        
        {hasRequiredSelections() && (
          <IncludedFeatures 
            selectedTileSize={state.tileSize} 
            selectedPattern={state.tilePattern}
          />
        )}
        
        <TotalPrice 
          price={parseFloat(price)}
          priceDisplay={priceDisplay}
          isRequestPrice={isRequestPrice}
          state={state}
          onRequestAppointment={() => setAppointmentDialogOpen(true)}
          wantsToBuyTiles={state.wantsToBuyTiles}
          tilePricePerSqm={state.tilePricePerSqm}
          squareMetersWithCuttingLoss={squareMetersWithCuttingLoss}
          tileCost={tileCost}
          hasRequiredSelections={hasRequiredSelections()}
        />
      </div>

      <ConfiguratorAppointmentDialog 
        open={appointmentDialogOpen} 
        onOpenChange={setAppointmentDialogOpen}
        state={state}
        price={parseFloat(price)}
        wantsToBuyTiles={state.wantsToBuyTiles}
        tilePricePerSqm={state.tilePricePerSqm}
        squareMetersWithCuttingLoss={squareMetersWithCuttingLoss}
        tileCost={tileCost}
      />
    </Card>
  );
};

export default ConfiguratorSummary;
