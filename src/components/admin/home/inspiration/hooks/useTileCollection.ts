
import { useState, useEffect } from "react";
import { InspirationTile } from "@/types/homeContent";

export const useTileCollection = () => {
  const [inspirationTiles, setInspirationTiles] = useState<InspirationTile[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Safely handle input changes for any field
  const handleInputChange = (index: number, field: keyof InspirationTile, value: any) => {
    console.log(`Update tegel ${index}, veld: ${field}, waarde:`, value);
    setInspirationTiles(prevTiles => {
      const updatedTiles = [...prevTiles];
      updatedTiles[index] = {
        ...updatedTiles[index],
        [field]: value
      };
      return updatedTiles;
    });
  };
  
  // Add a new tile to the collection
  const addTile = () => {
    const newTile: InspirationTile = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      image: "",
      colorPalette: ["#F5F5F5", "#E0E0E0", "#BDBDBD"],
      popularity: 75
    };
    
    setInspirationTiles(prev => [...prev, newTile]);
  };
  
  // Remove a tile from the collection
  const removeTile = (index: number) => {
    setInspirationTiles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };
  
  // Validate the collection before saving
  const validate = (): boolean => {
    // Check for required fields
    const invalidTiles = inspirationTiles.filter(tile => 
      !tile.title || !tile.image || tile.colorPalette.length === 0
    );
    
    if (invalidTiles.length > 0) {
      setError(`${invalidTiles.length} tegel(s) missen verplichte velden. Vul alle verplichte velden in.`);
      return false;
    }
    
    setError(null);
    return true;
  };
  
  // Debugging: log state changes
  useEffect(() => {
    console.log("Updated inspirationTiles:", inspirationTiles);
  }, [inspirationTiles]);
  
  return {
    inspirationTiles,
    saving,
    setSaving,
    error,
    setError,
    setInspirationTiles,
    handleInputChange,
    addTile,
    removeTile,
    validate
  };
};
