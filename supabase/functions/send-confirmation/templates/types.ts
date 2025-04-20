
export interface EmailData {
  name?: string;
  email: string;
  phone?: string;
  projectType?: string;
  totalPrice?: number;
  squareMeters?: number;
  floorType?: string;
  tileSize?: string;
  needsPlinths?: boolean;
  wallType?: string;
  wallTileSize?: string;
  bathroomOptions?: string[];
  bathroomTileSize?: string;
  otherDescription?: string;
  needsChape?: boolean;
  needsElectrician?: boolean;
  additionalNotes?: string;
  wantsSiteVisit?: boolean;
  wantsShowroomVisit?: boolean;
  addressStreet?: string;
  addressCity?: string;
  showerNis?: boolean;
  showerNisSize?: string;
  showerNisCustomSize?: string;
  fullBathroomRenovation?: boolean;
  wantsToBuyTiles?: boolean;
  tilePricePerSqm?: number;
  squareMetersWithCuttingLoss?: number;
  tileCost?: number;
  imageUrl?: string;
  selectedInspirationStyle?: string;
  selectedInspirationStyleTitle?: string;
  message?: string;
  [key: string]: any;
}

export interface EmailResponse {
  success: boolean;
  customerEmail: any;
  adminEmail: any;
  error?: string;
  message?: string;
}
