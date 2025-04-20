
export enum tableNames {
  TILES = "tiles",
  TILE_OPTIONS = "tile_options",
  TILE_FORMATS = "tile_formats",
  TILE_STYLES = "tile_styles",
  TILE_TYPES = "tile_types",
  PROJECT_TYPES = "project_types",
  CONFIGURATOR_PROJECT_TYPES = "configurator_project_types",
  CONFIGURATOR_STEPS = "configurator_steps",
  CONFIGURATOR_FIELDS = "configurator_fields",
  WALL_TYPES = "wall_types",
  WALL_TILE_SIZES = "wall_tile_sizes",
  QUICK_CALCULATOR_TILES = "quick_calculator_tiles",
  CONTACT_SUBMISSIONS = "contact_submissions",
  ADMIN_SETTINGS = "admin_settings"
}

// Basic shared properties
interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Quick Calculator
export interface QuickCalculatorTile extends BaseEntity {
  label: string;
  value: string;
  price_per_sqm: number;
}

// Wall Types
export interface WallType extends BaseEntity {
  name: string;
  price_multiplier: number;
}

// Wall Tile Sizes
export interface WallTileSize extends BaseEntity {
  size_id: string;
  name: string;
  price_multiplier: number;
}

// Configurator Project Type
export interface ConfiguratorProjectType extends BaseEntity {
  name: string;
  key: string;
  description: string;
  icon: string;
  isActive: boolean;
  sort_order: number;
}

// Configurator Step
export interface ConfiguratorStep extends BaseEntity {
  project_type_id: string;
  title: string;
  key: string;
  description: string;
  is_active: boolean;
  sort_order: number;
}

// Configurator Field
export interface ConfiguratorField extends BaseEntity {
  step_id: string;
  key: string;
  field_type: string;
  label: string;
  description: string;
  placeholder: string;
  default_value: any;
  options: any;
  validation_rules: any;
  price_impact: any;
  conditional_logic: any;
  is_required: boolean;
  is_active: boolean;
  sort_order: number;
}

// Company Info
export interface CompanyInfo extends BaseEntity {
  company_name: string;
  company_vat: string;
  company_address: string;
  company_email: string;
  company_phone: string;
  privacy_policy_last_updated: string;
  terms_last_updated: string;
  showroom_visit_enabled: boolean;
  showroom_visit_text: string;
}

// Project Type
export interface ProjectType extends BaseEntity {
  name: string;
  key: string;
  description: string;
  icon: string;
  isActive: boolean;
  sort_order: number;
}
