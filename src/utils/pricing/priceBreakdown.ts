
/**
 * Functions for calculating and formatting price breakdowns
 */
import { ConfiguratorState } from "@/components/configurator/types";

// Format price for display
export const formatPrice = (price: string): string => {
  // Handle null, undefined, or empty string
  if (!price) {
    return "Prijs op aanvraag";
  }
  
  const priceNum = parseFloat(price);
  
  if (priceNum === 0 || isNaN(priceNum)) {
    return "Prijs op aanvraag";
  }
  
  return `€ ${priceNum.toLocaleString('nl-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Function to get breakdown of costs
export const getPriceBreakdown = (state: ConfiguratorState, totalPrice: string): { label: string, amount: string }[] => {
  // Handle null or empty price
  if (!totalPrice) {
    return [];
  }
  
  const priceNum = parseFloat(totalPrice);
  
  // If price is zero, NaN or full bathroom renovation is selected, return empty array
  if (priceNum === 0 || isNaN(priceNum) || state.fullBathroomRenovation) {
    return [];
  }
  
  const breakdown: { label: string, amount: string }[] = [];
  
  // Calculate material costs (approximately 40% of total for most projects)
  const materialCost = priceNum * 0.4;
  breakdown.push({ 
    label: "Materialen (tegels, lijm, voegsel)", 
    amount: `€ ${materialCost.toLocaleString('nl-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
  });
  
  // Calculate labor costs (approximately 60% of total for most projects)
  const laborCost = priceNum * 0.6;
  breakdown.push({ 
    label: "Plaatsing (arbeidsloon)", 
    amount: `€ ${laborCost.toLocaleString('nl-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
  });
  
  // Add additional costs like chape work
  if (state.needsChape) {
    const chapeCost = state.squareMeters * 25;
    breakdown.push({ 
      label: "Chapewerken", 
      amount: `€ ${chapeCost.toLocaleString('nl-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
    });
  }
  
  // Add walk-in shower costs
  if (state.projectType === "badkamer" && state.bathroomOptions?.walkInShower) {
    breakdown.push({ 
      label: "Inloopdouche (extra chapewerk)", 
      amount: `€ 750,00` 
    });
  }
  
  // Add electrician costs
  if (state.needsElectrician) {
    breakdown.push({ 
      label: "Elektriciteitswerken", 
      amount: `€ 250,00` 
    });
  }
  
  return breakdown;
};
