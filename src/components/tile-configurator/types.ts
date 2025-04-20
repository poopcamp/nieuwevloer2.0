
export interface TileType {
  id: string;
  name: string;
  basePrice: number;
}

export interface TileSize {
  id: string;
  name: string;
  price_multiplier: number;
}

export interface TileStyle {
  id: string;
  name: string;
  price_multiplier: number;
}

export interface ExtraOption {
  id: string;
  name: string;
  price: number;
}

export interface TileConfiguratorState {
  tileType: string;
  tileSize: string;
  tileStyle: string;
  squareMeters: number;
  extras: string[];
  name: string;
  email: string;
  phone: string;
}

export interface TileOption {
  id: string;
  value: string;
  label: string;
  price_per_sqm: number;
}
