
export interface InspirationTile {
  id: string;
  title: string;
  description: string;
  image: string;
  colorPalette: string[];
  popularity: number;
}

export interface ImageUploadState {
  [key: string]: boolean;
}

export interface InspirationTileFormProps {
  tile: InspirationTile;
  index: number;
  onRemove: (index: number) => void;
  onInputChange: (index: number, field: string, value: string | number) => void;
  onColorChange: (tileIndex: number, colorIndex: number, color: string) => void;
  onAddColor: (tileIndex: number) => void;
  onRemoveColor: (tileIndex: number, colorIndex: number) => void;
  onImageUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  imageUploading: ImageUploadState;
}
