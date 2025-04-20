
export interface ExtendedProject {
  id: string;
  name: string;
  key: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TileStyle {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price_multiplier: number;
  internal_cost_per_sqm: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TileFormat {
  id: string;
  project_id: string;
  name: string;
  dimensions: string;
  description: string | null;
  image_url: string | null;
  price_multiplier: number;
  internal_cost_per_sqm: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CalculatorOption {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  option_type: string;
  price_addition: number;
  internal_cost: number;
  is_active: boolean;
  conditional_logic: any | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  selected?: boolean;
}

export interface CalculatorQuestion {
  id: string;
  project_id: string;
  question_text: string;
  help_text: string | null;
  field_type: string;
  options: any | null;
  default_value: string | null;
  is_required: boolean;
  conditional_logic: any | null;
  affects_price: boolean;
  price_impact: any | null;
  internal_cost_impact: any | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  answer?: string | number | boolean | null;
}

export interface ProjectPricing {
  id: string;
  project_id: string;
  base_price_per_sqm: number;
  internal_base_cost_per_sqm: number;
  cutting_loss_percentage: number;
  minimum_price: number;
  display_settings: any | null;
  created_at: string;
  updated_at: string;
}

export interface CalculatorSubmission {
  id?: string;
  project_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  square_meters: number;
  selected_tile_style_id: string | null;
  selected_tile_format_id: string | null;
  selected_options: any;
  question_responses: any;
  calculated_price: number;
  internal_cost: number;
  notes: string | null;
  project_image_url: string | null;
  wants_site_visit: boolean;
  wants_showroom_visit: boolean;
  receives_newsletter: boolean;
  lead_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ExtendedCalculatorState {
  selectedProject: ExtendedProject | null;
  squareMeters: number;
  selectedTileStyle: TileStyle | null;
  selectedTileFormat: TileFormat | null;
  selectedOptions: CalculatorOption[];
  questionResponses: Record<string, any>;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
  wantsSiteVisit: boolean;
  wantsShowroomVisit: boolean;
  receivesNewsletter: boolean;
  uploadedImage: File | null;
  uploadedImageUrl: string | null;
  addressStreet?: string;
  addressCity?: string;
}

export interface PriceBreakdown {
  basePricePerSqm: number;
  squareMeters: number;
  subtotalBase: number;
  optionsCost: number;
  totalCustomerPrice: number;
  internalBasePrice: number;
  internalOptionsCost: number;
  internalTotalCost: number;
  squareMetersWithCuttingLoss: number;
  cuttingLossPercentage: number;
}
