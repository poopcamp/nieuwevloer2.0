
export interface SendEmailOptions {
  from: string;
  to: string[];
  subject: string;
  html: string;
  reply_to?: string;
}

export interface EmailResponse {
  data: any;
  error: any;
}

export interface EmailConfirmationRequest {
  name?: string;
  email: string;
  phone?: string;
  projectType?: string;
  totalPrice?: number;
  squareMeters?: number;
  floorType?: string;
  tileSize?: string;
  wallType?: string;
  wallTileSize?: string;
  bathroomTileSize?: string;
  needsChape?: boolean;
  needsElectrician?: boolean;
  additionalNotes?: string;
  wantsSiteVisit?: boolean;
  wantsShowroomVisit?: boolean; // Add this property
  addressStreet?: string;
  addressCity?: string;
  showerNis?: boolean;
  showerNisSize?: string;
  showerNisCustomSize?: string;
  fullBathroomRenovation?: boolean;
  hasHolidayDiscount?: boolean;
  selectedInspirationStyle?: any;
  selectedInspirationStyleTitle?: string;
  selectedTileExample?: any;
  // Tile purchase options
  wantsToBuyTiles?: boolean;
  tilePricePerSqm?: number | null;
  squareMetersWithCuttingLoss?: number;
  tileCost?: number;
  imageUrl?: string;  // Added for project images
}
