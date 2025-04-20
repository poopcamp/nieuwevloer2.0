
export interface InspirationTile {
  id: number;
  title: string;
  description: string;
  image: string;
  colorPalette: string[];
  popularity: number;
}

export interface TileColor {
  id: number;
  color: string;
  name: string;
}
