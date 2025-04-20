
/**
 * Type definitions for Supabase responses and data structures
 */

// Generic database entity with basic fields
export interface DbEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Generic response structure for API calls
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
}

// Extra option from database
export interface DbExtraOption extends DbEntity {
  name: string;
  price: number;
  project_type: string | null;
}

// Configuration from database
export interface DbConfiguration extends DbEntity {
  name: string;
  email: string;
  phone: string;
  project_type?: string;
  square_meters?: number;
  floor_type?: string;
  tile_size?: string;
  need_plinths?: boolean;
  wall_type?: string;
  wall_tile_size?: string;
  bathroom_options?: any;
  bathroom_tile_size?: string;
  other_description?: string;
  needs_chape?: boolean;
  needs_electrician?: boolean;
  additional_notes?: string;
  wants_showroom_visit?: boolean;
  wants_site_visit?: boolean;
  address_street?: string;
  address_city?: string;
  shower_nis?: boolean;
  shower_nis_size?: string;
  shower_nis_custom_size?: string;
  full_bathroom_renovation?: boolean;
  project_image_url?: string;
  lead_score?: number;
  laatste_contactmoment?: string;
  total_price?: number;
}

// Generic service result with consistent error handling
export interface ServiceResult<T> {
  data: T | null;
  error: {
    message: string;
    code?: string;
  } | null;
  isSuccess: boolean;
}

// Define Database type structure for Supabase tables
export interface Database {
  public: {
    Tables: {
      admin_settings: {
        Row: any;
        Insert: any;
        Update: any;
      };
      blog_posts: {
        Row: any;
        Insert: any;
        Update: any;
      };
      calculator_rates: {
        Row: any;
        Insert: any;
        Update: any;
      };
      config_blocks: {
        Row: any;
        Insert: any;
        Update: any;
      };
      project_types: {
        Row: any;
        Insert: any;
        Update: any;
      };
      config_field_values: {
        Row: any;
        Insert: any;
        Update: any;
      };
      configurations: {
        Row: any;
        Insert: any;
        Update: any;
      };
      configurator_fields: {
        Row: any;
        Insert: any;
        Update: any;
      };
      configurator_steps: {
        Row: any;
        Insert: any;
        Update: any;
      };
      configurator_project_types: {
        Row: any;
        Insert: any;
        Update: any;
      };
      configurator_pricing: {
        Row: any;
        Insert: any;
        Update: any;
      };
      configurator_submissions: {
        Row: any;
        Insert: any;
        Update: any;
      };
      configurator_visit_options: {
        Row: any;
        Insert: any;
        Update: any;
      };
      contact_submissions: {
        Row: any;
        Insert: any;
        Update: any;
      };
      extra_options: {
        Row: any;
        Insert: any;
        Update: any;
      };
      gdpr_requests: {
        Row: any;
        Insert: any;
        Update: any;
      };
      holiday_discounts: {
        Row: any;
        Insert: any;
        Update: any;
      };
      inspiration_tiles: {
        Row: any;
        Insert: any;
        Update: any;
      };
      tile_examples: {
        Row: any;
        Insert: any;
        Update: any;
      };
      wall_types: {
        Row: any;
        Insert: any;
        Update: any;
      };
    };
  };
}

