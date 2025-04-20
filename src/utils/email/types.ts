
export interface EmailSendOptions {
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
  imageUrl?: string;
}

export interface EmailResponse {
  success: boolean;
  error?: string;
  details?: any;
  customerEmail?: any;
  adminEmail?: any;
}

export interface EdgeFunctionResponse {
  success: boolean;
  error?: string;
  customerEmail?: any;
  adminEmail?: any;
  message?: string;
  diagnosticsSuccessful?: boolean;
}

export interface EmailRequestPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}
