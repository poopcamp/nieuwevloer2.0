
import { InspirationTile } from "@/types/homeContent";

export const useColorPalette = (
  inspirationTiles: InspirationTile[],
  setInspirationTiles: React.Dispatch<React.SetStateAction<InspirationTile[]>>
) => {
  const handleColorChange = (tileIndex: number, colorIndex: number, value: string) => {
    const updatedTiles = [...inspirationTiles];
    const colors = [...updatedTiles[tileIndex].colorPalette];
    colors[colorIndex] = value;
    updatedTiles[tileIndex].colorPalette = colors;
    setInspirationTiles(updatedTiles);
  };

  const addColor = (index: number) => {
    const updatedTiles = [...inspirationTiles];
    updatedTiles[index].colorPalette.push('#FFFFFF');
    setInspirationTiles(updatedTiles);
  };

  const removeColor = (tileIndex: number, colorIndex: number) => {
    const updatedTiles = [...inspirationTiles];
    updatedTiles[tileIndex].colorPalette.splice(colorIndex, 1);
    setInspirationTiles(updatedTiles);
  };

  return {
    handleColorChange,
    addColor,
    removeColor
  };
};
