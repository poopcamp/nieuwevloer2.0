
import { supabase } from "./supabaseClient.ts";

/**
 * Format a price to a nice string with comma as decimal separator
 */
export function formatPrice(price: number): string {
  return price.toFixed(2).replace(".", ",");
}

/**
 * Format a project type to a human-readable string
 */
export function formatProjectType(projectType: string): string {
  const projectTypes: Record<string, string> = {
    'vloer': 'Vloertegels',
    'wand': 'Wandtegels',
    'badkamer': 'Badkamer',
    'keukenwand': 'Keukenwand',
    'ander': 'Ander project',
    'quick_calculator': 'Snelle prijsindicatie',
    'contact_form': 'Contactaanvraag',
    'guide_download': 'Gids download',
    'test_email': 'Test e-mail'
  };

  return projectTypes[projectType] || projectType;
}

/**
 * Format tile size to a human-readable string
 */
export function formatTileSize(tileSize: string): string {
  if (!tileSize) return '';
  
  // If it's already in the format "30x60" just return it
  if (/^\d+x\d+$/.test(tileSize)) {
    return `${tileSize} cm`;
  }
  
  // For other formats like "small", "medium", "large"
  const tileSizes: Record<string, string> = {
    'small': 'Klein formaat',
    'medium': 'Middelgroot formaat',
    'large': 'Groot formaat',
    'xl': 'Extra groot formaat',
    'xxl': 'XXL formaat',
    'custom': 'Aangepast formaat'
  };

  return tileSizes[tileSize] || tileSize;
}

/**
 * Get wall type name from database
 */
export async function formatWallType(wallTypeId: string): Promise<string> {
  if (!wallTypeId) return '';
  
  // Common wall types that don't need database lookup
  const commonWallTypes: Record<string, string> = {
    'standard': 'Standaard wand',
    'standaard': 'Standaard wand',
    'uneven': 'Oneffen wand',
    'oneffen': 'Oneffen wand',
    'gyproc': 'Gyproc wand',
    'brick': 'Bakstenen wand',
    'concrete': 'Betonnen wand',
    'baksteen': 'Bakstenen wand',
    'beton': 'Betonnen wand'
  };
  
  // If it's a common type, return directly
  if (commonWallTypes[wallTypeId]) {
    return commonWallTypes[wallTypeId];
  }
  
  // If it looks like a UUID, try to look it up
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(wallTypeId)) {
    try {
      const { data, error } = await supabase
        .from('wall_types')
        .select('name')
        .eq('id', wallTypeId)
        .single();
        
      if (data && !error) {
        return data.name;
      }
    } catch (e) {
      console.error("Error fetching wall type:", e);
    }
  }
  
  // Return the original ID if we can't resolve it
  return wallTypeId;
}
