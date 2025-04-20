
import { ConfiguratorState } from "@/components/configurator/types";

// Helper function to format prices with currency symbol
export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `€${numPrice.toFixed(2).replace('.', ',')}`;
};

// Calculate price based on configurator state
export const calculatePrice = (state: ConfiguratorState): string => {
  // If full bathroom renovation is selected, return "0" to indicate "price on request"
  if (state.fullBathroomRenovation) {
    return "0";
  }

  let basePrice = 0;
  let squareMeters = state.squareMeters || 0;

  // Don't calculate if square meters is 0
  if (squareMeters === 0) {
    return "0";
  }

  // Base pricing by project type
  switch (state.projectType) {
    case "vloer":
      basePrice = 35; // Base price per m² for floor
      
      // Adjust price based on floor type
      if (state.floorType === "bestaande-tegels") {
        basePrice += 10; // Additional work to remove existing tiles
      }
      
      // Adjust price based on tile size
      if (state.tileSize === "30x30" || state.tileSize === "kleine-tegels") {
        basePrice += 8; // Small tiles are more labor intensive
      } else if (state.tileSize === "120x120" || state.tileSize === "grote-tegels") {
        basePrice += 12; // Large tiles require more expertise
      }
      
      // Add for plinths if needed
      if (state.needsPlinths) {
        basePrice += 5;
      }
      break;
      
    case "keukenwand":
      basePrice = 45; // Base price per m² for kitchen wall
      
      // Adjust price based on wall type
      if (state.wallType === "bestaande-tegels") {
        basePrice += 10; // Additional work to remove existing tiles
      }
      
      // Adjust price based on tile size
      if (state.wallTileSize === "kleine-tegels" || state.wallTileSize === "mozaiek") {
        basePrice += 12; // Small tiles or mosaic are more labor intensive
      }
      break;
      
    case "badkamer":
      basePrice = 55; // Base price per m² for bathroom
      
      // Check bathroom options
      if (state.bathroomOptions?.walkInShower) {
        basePrice += 15; // Walk-in shower requires more work
      }
      
      // Remove the reference to bathtub which doesn't exist in the type
      // Instead check for shower option which does exist
      if (state.bathroomOptions?.shower) {
        basePrice += 10; // Standard shower area requires attention
      }
      
      // Adjust price based on tile size
      if (state.bathroomTileSize === "kleine-tegels" || state.bathroomTileSize === "mozaiek") {
        basePrice += 15; // Small tiles or mosaic are more labor intensive
      }
      
      // Add for shower nis if selected
      if (state.showerNis) {
        basePrice += 10;
      }
      break;
      
    case "andere":
      basePrice = 40; // Default base price for other projects
      break;
  }
  
  // Add for additional work
  if (state.needsChape) {
    basePrice += 10;
  }
  
  if (state.needsElectrician) {
    basePrice += 8;
  }
  
  // Calculate total price
  const totalPrice = basePrice * squareMeters;
  
  // Apply minimum price for very small projects
  const minimumPrice = 500;
  const finalPrice = Math.max(totalPrice, minimumPrice);
  
  return finalPrice.toString();
};

// Get price breakdown for display
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
    amount: formatPrice(materialCost) 
  });
  
  // Calculate labor costs (approximately 60% of total for most projects)
  const laborCost = priceNum * 0.6;
  breakdown.push({ 
    label: "Plaatsing (arbeidsloon)", 
    amount: formatPrice(laborCost) 
  });
  
  // Add additional costs like chape work
  if (state.needsChape) {
    const chapeCost = state.squareMeters * 25;
    breakdown.push({ 
      label: "Chapewerken", 
      amount: formatPrice(chapeCost) 
    });
  }
  
  // Add walk-in shower costs
  if (state.projectType === "badkamer" && state.bathroomOptions?.walkInShower) {
    breakdown.push({ 
      label: "Inloopdouche (extra chapewerk)", 
      amount: formatPrice(750) 
    });
  }
  
  // Add electrician costs
  if (state.needsElectrician) {
    breakdown.push({ 
      label: "Elektriciteitswerken", 
      amount: formatPrice(250) 
    });
  }
  
  return breakdown;
};
