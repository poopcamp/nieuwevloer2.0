
import { ConfiguratorState } from "@/components/configurator/types";

// Base pricing constants
const BASE_FLOOR_PRICE_PER_SQM = 65; // Base price per square meter for floor tiling
const BASE_WALL_PRICE_PER_SQM = 75; // Base price per square meter for wall tiling
const BASE_BATHROOM_PRICE_PER_SQM = 85; // Base price per square meter for bathroom tiling
const MINIMUM_PRICE = 500; // Minimum price for any project

// Tile size multipliers
const TILE_SIZE_MULTIPLIERS: Record<string, number> = {
  "30x30": 1.0,
  "45x45": 1.0,
  "60x60": 1.05,
  "80x80": 1.15,
  "90x90": 1.2,
  "120x120": 1.3,
  "60x120": 1.25,
  "romeins": 1.35, // Romeins verband (multiple sizes)
  "visgraat": 1.4, // Herringbone pattern
  "hexagon": 1.5, // Hexagon tiles
  "mozaiek": 1.6, // Mosaic tiles
};

// Wall type multipliers
const WALL_TYPE_MULTIPLIERS: Record<string, number> = {
  "bestaand": 1.0, // Existing wall
  "gipsplaat": 1.1, // Drywall
  "cellenbeton": 1.2, // Cellular concrete
  "baksteen": 1.3, // Brick
};

// Additional costs
const PLINTHS_PRICE_PER_METER = 15; // Price per meter for plinths
const CHAPE_PRICE_PER_SQM = 25; // Price per square meter for chape/leveling
const ELECTRICIAN_PRICE = 350; // Fixed price for electrician work
const SHOWER_NIS_PRICES: Record<string, number> = {
  "small": 250,
  "medium": 350,
  "large": 450,
  "custom": 500,
};

// Discount percentages
const HOLIDAY_DISCOUNT_PERCENTAGE = 0.05; // 5% holiday discount

// Helper functions
const calculateBaseFloorPrice = (squareMeters: number): number => {
  const price = squareMeters * BASE_FLOOR_PRICE_PER_SQM;
  return Math.max(price, MINIMUM_PRICE);
};

const calculateBaseWallPrice = (squareMeters: number): number => {
  const price = squareMeters * BASE_WALL_PRICE_PER_SQM;
  return Math.max(price, MINIMUM_PRICE);
};

const calculateBaseBathroomPrice = (squareMeters: number): number => {
  const price = squareMeters * BASE_BATHROOM_PRICE_PER_SQM;
  return Math.max(price, MINIMUM_PRICE);
};

const getTileSizeMultiplier = (tileSize: string): number => {
  return TILE_SIZE_MULTIPLIERS[tileSize] || 1.0;
};

const getWallTypeMultiplier = (wallType: string): number => {
  return WALL_TYPE_MULTIPLIERS[wallType] || 1.0;
};

const calculatePlinthsCost = (squareMeters: number): number => {
  // Estimate perimeter based on square meters (assuming square room)
  const estimatedPerimeter = Math.sqrt(squareMeters) * 4;
  return estimatedPerimeter * PLINTHS_PRICE_PER_METER;
};

const calculateChapeCost = (squareMeters: number): number => {
  return squareMeters * CHAPE_PRICE_PER_SQM;
};

const calculateShowerNisCost = (size: string): number => {
  return SHOWER_NIS_PRICES[size] || SHOWER_NIS_PRICES.medium;
};

const applyHolidayDiscount = (price: number): number => {
  return price * (1 - HOLIDAY_DISCOUNT_PERCENTAGE);
};

// Main calculation functions
export const calculateFloorPrice = (state: ConfiguratorState): number => {
  let basePrice = calculateBaseFloorPrice(state.squareMeters);
  
  // Apply multiplier based on tile size
  if (state.tileSize) {
    basePrice *= getTileSizeMultiplier(state.tileSize);
  }
  
  // Add costs for plinths if selected
  if (state.needsPlinths) {
    const plinthCost = calculatePlinthsCost(state.squareMeters);
    basePrice += plinthCost;
  }
  
  // Add chape/preparation costs if needed
  if (state.needsChape) {
    const chapeCost = calculateChapeCost(state.squareMeters);
    basePrice += chapeCost;
  }
  
  // Apply holiday discount if applicable
  if (state.hasHolidayDiscount) {
    basePrice = applyHolidayDiscount(basePrice);
  }
  
  return basePrice;
};

export const calculateKitchenWallPrice = (state: ConfiguratorState): number => {
  let basePrice = calculateBaseWallPrice(state.squareMeters);
  
  // Apply multiplier based on wall type
  if (state.wallType) {
    basePrice *= getWallTypeMultiplier(state.wallType);
  }
  
  // Apply multiplier based on tile size
  if (state.wallTileSize) {
    basePrice *= getTileSizeMultiplier(state.wallTileSize);
  }
  
  // Add electrician costs if needed
  if (state.needsElectrician) {
    basePrice += ELECTRICIAN_PRICE;
  }
  
  // Apply holiday discount if applicable
  if (state.hasHolidayDiscount) {
    basePrice = applyHolidayDiscount(basePrice);
  }
  
  return basePrice;
};

export const calculateBathroomPrice = (state: ConfiguratorState): number => {
  // For full bathroom renovation, return 0 to display "Price on request"
  if (state.fullBathroomRenovation) {
    return 0;
  }
  
  let basePrice = calculateBaseBathroomPrice(state.squareMeters);
  
  // Apply multiplier based on tile size
  if (state.bathroomTileSize) {
    basePrice *= getTileSizeMultiplier(state.bathroomTileSize);
  }
  
  // Add shower nis cost if selected
  if (state.showerNis && state.showerNisSize) {
    const showerNisCost = calculateShowerNisCost(state.showerNisSize);
    basePrice += showerNisCost;
  }
  
  // Add electrician costs if needed
  if (state.needsElectrician) {
    basePrice += ELECTRICIAN_PRICE;
  }
  
  // Apply holiday discount if applicable
  if (state.hasHolidayDiscount) {
    basePrice = applyHolidayDiscount(basePrice);
  }
  
  return basePrice;
};

export const calculateOtherPrice = (state: ConfiguratorState): number => {
  // Altijd 0 terugsturen voor "Andere Werken" om "Prijs op aanvraag" te tonen
  return 0;
};
