export interface ConfiguratorState {
  // Project type
  projectType: string;
  
  // Floor configuration
  floorType?: string;
  tileSize?: string;
  tileStyle?: string;
  tilePattern?: string;
  squareMeters: number;
  needsPlinths?: boolean;
  needsChape?: boolean;
  
  // Wall configuration for kitchen
  wallType?: string;
  wallTileSize?: string;
  
  // Bathroom configuration
  bathRenovation?: boolean;
  fullBathroomRenovation?: boolean;
  bathroomTileSize?: string;
  bathroomOptions?: {
    walkInShower: boolean;
    shower: boolean;
    floor: boolean;
    showerWall: boolean;
    walls: boolean;
    toilet: boolean;
    sink: boolean;
  };
  
  // Shower niche options
  showerNis?: boolean;
  showerNisSize?: string;
  showerNisCustomSize?: string;
  
  // Other project
  otherDescription?: string;
  
  // Additional work
  needsElectrician?: boolean;
  
  // User details
  name: string;
  email: string;
  phone: string;
  additionalNotes?: string;
  addressStreet?: string;
  addressCity?: string;
  
  // Options
  wantsSiteVisit?: boolean;
  wantsShowroomVisit?: boolean;
  hasHolidayDiscount?: boolean;
  
  // Pricing
  tileCost?: number;
  tilePrice?: number;
  
  // Tile purchase options
  wantsToBuyTiles?: boolean;
  tilePricePerSqm?: number;
  
  // Inspiration
  selectedInspirationStyle?: any;
  projectImageUrl?: string;
  selectedTileExample?: any;
}

export const DEFAULT_STATE: ConfiguratorState = {
  projectType: 'floor',
  squareMeters: 20,
  name: '',
  email: '',
  phone: '',
  wantsSiteVisit: false,
  wantsShowroomVisit: false,
  needsPlinths: false,
  needsChape: false,
  showerNis: false,
  fullBathroomRenovation: false,
  wantsToBuyTiles: false,
  bathroomOptions: {
    walkInShower: false,
    shower: false,
    floor: false,
    showerWall: false,
    walls: false,
    toilet: false,
    sink: false
  }
};

export interface PriceBreakdownItem {
  label: string;
  amount: number;
}

// Export DEFAULT_STATE as initialConfiguratorState for backward compatibility
export const initialConfiguratorState = DEFAULT_STATE;
