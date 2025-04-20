
// Configuration data type for forms and database
export interface ConfigurationData {
  name: string;
  email: string;
  phone: string;
  project_type?: string;
  square_meters?: number;
  tile_size?: string;
  floor_type?: string;
  wall_type?: string;
  wall_tile_size?: string;
  bathroom_tile_size?: string;
  bathroom_options?: {
    floor?: boolean;
    showerWall?: boolean;
    walkInShower?: boolean;
    shower?: boolean;
  };
  need_plinths?: boolean;
  needs_chape?: boolean;
  needs_electrician?: boolean;
  full_bathroom_renovation?: boolean;
  wants_showroom_visit?: boolean;
  wants_site_visit?: boolean;
  address_street?: string;
  address_city?: string;
  additional_notes?: string;
  project_image_url?: string;
  selected_inspiration_style_id?: number;
  selected_inspiration_style_title?: string;
  wants_to_buy_tiles?: boolean;
  tile_price_per_sqm?: number | null;
  tile_cost?: number;
  total_price?: number;
  lead_score?: number;
  laatste_contactmoment?: string;
  opvolging_gestopt?: boolean;
  shower_nis?: boolean;
  shower_nis_size?: string;
  shower_nis_custom_size?: string;
}

// Contact submission data type
export interface ContactSubmissionData {
  name: string;
  email: string;
  phone: string;
  project_type?: string;
  additional_notes?: string; 
  receives_newsletter?: boolean;
}
