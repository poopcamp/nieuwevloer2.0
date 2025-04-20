
export interface InspirationTile {
  id: string;
  title: string;
  description: string;
  image: string;
  colorPalette: string[];
  popularity: number;
  created_at?: string;
  updated_at?: string;
}

export interface TileExample {
  id: string;
  name: string;
  size: string;
  image: string;
  description: string;
  featured?: boolean;
  price_per_sqm?: number;
  finish?: string;
  suitable_for?: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  linkUrl: string;
  icon: string;
  created_at?: string;
  updated_at?: string;
}

// Adding the PricingInfo interface that's missing
export interface PricingInfo {
  id: string;
  base_m2_price: number;
  base_bathroom_price: number;
  base_kitchen_price: number;
  ontkoppelingsmat_included: boolean;
  chape_primer_included: boolean;
  voegmiddel_included: boolean;
  lijm_included: boolean;
  kit_included: boolean;
  waterafstotende_voeg_included: boolean;
  vloerverwarming_included: boolean;
  discount_percentage: number;
  price_info_text: string;
}
