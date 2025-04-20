
import { useState, useEffect } from "react";
import { InspirationTile } from "../types";
import { fetchInspirationTiles, saveInspirationTilesToDB, uploadImageToStorage } from "./api/inspirationTilesApi";
import { useToast } from "@/hooks/use-toast";
import { ImageUploadState } from "./useImageUpload";

export const useInspirationTiles = () => {
  const [inspirationTiles, setInspirationTiles] = useState<InspirationTile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState<ImageUploadState>({});
  const { toast } = useToast();
  
  // Load tiles from database on component mount
  useEffect(() => {
    const loadTiles = async () => {
      setLoading(true);
      try {
        const tiles = await fetchInspirationTiles();
        setInspirationTiles(tiles);
      } catch (error) {
        console.error("Error loading inspiration tiles:", error);
        toast({
          title: "Fout bij laden",
          description: "Er is een fout opgetreden bij het laden van de inspiratietegels.",
          variant: "destructive",
        });
        // Initialize with an empty array if loading fails
        setInspirationTiles([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadTiles();
  }, [toast]);
  
  // Handle input changes for any field
  const handleInputChange = (index: number, field: keyof InspirationTile, value: any) => {
    setInspirationTiles(prevTiles => {
      const updatedTiles = [...prevTiles];
      updatedTiles[index] = {
        ...updatedTiles[index],
        [field]: value
      };
      return updatedTiles;
    });
  };
  
  // Handle color palette changes
  const handleColorChange = (tileIndex: number, colorIndex: number, newColor: string) => {
    setInspirationTiles(prevTiles => {
      const updatedTiles = [...prevTiles];
      const currentColors = [...updatedTiles[tileIndex].colorPalette];
      currentColors[colorIndex] = newColor;
      updatedTiles[tileIndex].colorPalette = currentColors;
      return updatedTiles;
    });
  };
  
  // Add a color to a tile's palette
  const addColor = (tileIndex: number) => {
    setInspirationTiles(prevTiles => {
      const updatedTiles = [...prevTiles];
      updatedTiles[tileIndex].colorPalette = [...updatedTiles[tileIndex].colorPalette, '#FFFFFF'];
      return updatedTiles;
    });
  };
  
  // Remove a color from a tile's palette
  const removeColor = (tileIndex: number, colorIndex: number) => {
    setInspirationTiles(prevTiles => {
      const updatedTiles = [...prevTiles];
      const currentColors = [...updatedTiles[tileIndex].colorPalette];
      currentColors.splice(colorIndex, 1);
      updatedTiles[tileIndex].colorPalette = currentColors;
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
  
  // Handle image upload
  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const tileId = inspirationTiles[index].id;
    
    // Check if this is a manual URL input
    if (e.target.dataset?.manualUrl) {
      const manualUrl = e.target.dataset.manualUrl;
      console.log("Setting manual URL:", manualUrl);
      
      // Update the tile with the manual URL
      handleInputChange(index, 'image', manualUrl);
      
      toast({
        title: "URL toegepast",
        description: "De afbeelding URL is succesvol toegepast.",
      });
      
      return;
    }
    
    // Regular file upload
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    
    // Set the uploading state for this tile
    setImageUploading(prev => ({...prev, [tileId]: true}));
    
    try {
      const imageUrl = await uploadImageToStorage(file);
      
      // Update the tile with the new image URL
      handleInputChange(index, 'image', imageUrl);
      
      toast({
        title: "Afbeelding geüpload",
        description: "De afbeelding is succesvol geüpload.",
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      
      let errorMessage = error.message;
      if (errorMessage.includes('bucket') || errorMessage.includes('storage')) {
        errorMessage = "Er is een probleem met de opslagbucket. Neem contact op met de beheerder.";
      }
      
      toast({
        title: "Fout bij uploaden",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setImageUploading(prev => ({...prev, [tileId]: false}));
    }
  };
  
  // Save tiles to database
  const saveTiles = async () => {
    // Validate tiles before saving
    const invalidTiles = inspirationTiles.filter(tile => !tile.title || !tile.image);
    if (invalidTiles.length > 0) {
      toast({
        title: "Validatie fout",
        description: "Alle tegels moeten minimaal een titel en afbeelding hebben.",
        variant: "destructive",
      });
      return;
    }
    
    setSaving(true);
    try {
      await saveInspirationTilesToDB(inspirationTiles);
      toast({
        title: "Opgeslagen",
        description: `${inspirationTiles.length} inspiratietegels opgeslagen.`,
      });
    } catch (error) {
      console.error("Error saving tiles:", error);
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het opslaan van de tegels.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };
  
  return {
    inspirationTiles,
    loading,
    saving,
    imageUploading,
    handleInputChange,
    handleColorChange,
    addColor,
    removeColor,
    addTile,
    removeTile,
    handleImageUpload,
    saveTiles
  };
};
