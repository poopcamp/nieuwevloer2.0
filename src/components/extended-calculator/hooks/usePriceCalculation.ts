
import { ExtendedCalculatorState, PriceBreakdown, ProjectPricing } from '../types';

export const usePriceCalculation = () => {
  const calculatePriceBreakdown = (
    state: ExtendedCalculatorState, 
    pricing: ProjectPricing | null
  ): PriceBreakdown => {
    const { squareMeters, selectedTileStyle, selectedTileFormat, selectedOptions } = state;
    
    if (!pricing) {
      return {
        basePricePerSqm: 0,
        squareMeters,
        subtotalBase: 0,
        optionsCost: 0,
        totalCustomerPrice: 0,
        internalBasePrice: 0,
        internalOptionsCost: 0,
        internalTotalCost: 0,
        squareMetersWithCuttingLoss: squareMeters,
        cuttingLossPercentage: 10
      };
    }
    
    let basePricePerSqm = pricing.base_price_per_sqm;
    let internalBaseCostPerSqm = pricing.internal_base_cost_per_sqm;
    
    if (selectedTileStyle) {
      basePricePerSqm *= selectedTileStyle.price_multiplier;
      internalBaseCostPerSqm = selectedTileStyle.internal_cost_per_sqm || internalBaseCostPerSqm;
    }
    
    if (selectedTileFormat) {
      basePricePerSqm *= selectedTileFormat.price_multiplier;
      internalBaseCostPerSqm = selectedTileFormat.internal_cost_per_sqm || internalBaseCostPerSqm;
    }
    
    const cuttingLossPercentage = pricing.cutting_loss_percentage;
    const squareMetersWithCuttingLoss = squareMeters * (1 + (cuttingLossPercentage / 100));
    
    const subtotalBase = basePricePerSqm * squareMeters;
    const internalBaseTotal = internalBaseCostPerSqm * squareMetersWithCuttingLoss;
    
    let optionsCost = 0;
    let internalOptionsCost = 0;
    selectedOptions.forEach(option => {
      optionsCost += option.price_addition;
      internalOptionsCost += option.internal_cost;
    });
    
    const totalCustomerPrice = Math.max(subtotalBase + optionsCost, pricing.minimum_price || 0);
    const internalTotalCost = internalBaseTotal + internalOptionsCost;
    
    return {
      basePricePerSqm,
      squareMeters,
      subtotalBase,
      optionsCost,
      totalCustomerPrice,
      internalBasePrice: internalBaseTotal,
      internalOptionsCost,
      internalTotalCost,
      squareMetersWithCuttingLoss,
      cuttingLossPercentage
    };
  };

  return {
    calculatePriceBreakdown
  };
};
