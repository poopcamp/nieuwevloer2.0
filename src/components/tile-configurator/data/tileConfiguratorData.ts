
import { TileType, TileSize, TileStyle, ExtraOption } from '../types';

export const tileTypes: TileType[] = [
  { id: "1", name: "Vloertegel", basePrice: 45 },
  { id: "2", name: "Wandtegel", basePrice: 40 },
  { id: "3", name: "Parketvloer", basePrice: 60 }
];

export const tileSizes: TileSize[] = [
  { id: "1", name: "30x30 cm", price_multiplier: 0.9 },
  { id: "2", name: "60x60 cm", price_multiplier: 1.0 },
  { id: "3", name: "80x80 cm", price_multiplier: 1.2 },
  { id: "4", name: "120x120 cm", price_multiplier: 2.5 }
];

export const tileStyles: TileStyle[] = [
  { id: "1", name: "Mat", price_multiplier: 1.0 },
  { id: "2", name: "Glans", price_multiplier: 1.1 },
  { id: "3", name: "Hout-look", price_multiplier: 1.2 },
  { id: "4", name: "Terrazzo-look", price_multiplier: 1.4 }
];

export const extraOptions: ExtraOption[] = [
  { id: "1", name: "Chapewerken", price: 12 },
  { id: "2", name: "Ontkoppelingsmat", price: 8 },
  { id: "3", name: "Plinten", price: 15 },
  { id: "4", name: "Speciale voegkleur", price: 5 }
];
