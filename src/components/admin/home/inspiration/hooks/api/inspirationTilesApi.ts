
import { supabase } from "@/integrations/supabase/client";
import { InspirationTile } from "../../types";
import { ensureClientPhotosBucketExists } from "@/utils/createBucket";

/**
 * Fetches all inspiration tiles from the database
 */
export async function fetchInspirationTiles(): Promise<InspirationTile[]> {
  const { data, error } = await supabase
    .from('inspiration_tiles')
    .select('*')
    .order('id');
  
  if (error) {
    console.error('Error fetching inspiration tiles:', error);
    throw new Error('Fout bij het ophalen van inspiratietegels');
  }
  
  // Map the database fields to the expected TypeScript interface
  const formattedTiles: InspirationTile[] = (data || []).map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image: item.image,
    colorPalette: item.colorpalette || [],  // Map colorpalette (DB) to colorPalette (TypeScript)
    popularity: item.popularity
  }));
  
  return formattedTiles;
}

/**
 * Saves all inspiration tiles to the database
 */
export async function saveInspirationTilesToDB(tiles: InspirationTile[]): Promise<void> {
  // Transform the tiles to match the database schema
  const dbTiles = tiles.map(tile => ({
    id: tile.id,
    title: tile.title,
    description: tile.description,
    image: tile.image,
    colorpalette: tile.colorPalette,  // Map colorPalette (TypeScript) to colorpalette (DB)
    popularity: tile.popularity
  }));

  // First delete all existing tiles
  const { error: deleteError } = await supabase
    .from('inspiration_tiles')
    .delete()
    .neq('id', 'placeholder'); // This ensures we delete everything
  
  if (deleteError) {
    console.error('Error deleting existing inspiration tiles:', deleteError);
    throw new Error('Fout bij het verwijderen van bestaande inspiratietegels');
  }
  
  // Then insert all new tiles if we have any
  if (dbTiles.length > 0) {
    const { error: insertError } = await supabase
      .from('inspiration_tiles')
      .insert(dbTiles);
    
    if (insertError) {
      console.error('Error inserting inspiration tiles:', insertError);
      throw new Error('Fout bij het opslaan van inspiratietegels');
    }
  }
}

/**
 * Uploads an image to the Supabase storage bucket
 */
export async function uploadImageToStorage(file: File): Promise<string> {
  try {
    // First make sure the bucket exists
    await ensureClientPhotosBucketExists();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('customer-uploads')
      .upload(`inspiration/${fileName}`, file);
      
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from('customer-uploads')
      .getPublicUrl(`inspiration/${fileName}`);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image to storage:', error);
    throw new Error('Fout bij het uploaden van de afbeelding. Probeer het opnieuw.');
  }
}
