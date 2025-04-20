
import { useState, useEffect, useCallback } from 'react';
import { calculatorService, TileFormat } from '@/services/calculatorService';
import { useToast } from '@/hooks/use-toast';

export function useTileFormats(type: 'floor' | 'wall') {
  const [formats, setFormats] = useState<TileFormat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const { toast } = useToast();

  const fetchFormats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await calculatorService.getTileFormats(type);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setIsUsingFallback(result.usingFallback || false);
      setFormats(result.data || []);
      
      console.info(`Successfully fetched ${result.data?.length || 0} ${type} formats from database`);
      
    } catch (err: any) {
      console.error(`Error fetching ${type} formats:`, err);
      setError(err.message);
      
      // Use fallback data if fetch fails
      setIsUsingFallback(true);
      setFormats(
        type === 'floor'
          ? [
              { id: 'fallback-1', format_name: '60x60 cm', price_multiplier: 45, rate_key: 'fallback-60x60', type },
              { id: 'fallback-2', format_name: '80x80 cm', price_multiplier: 55, rate_key: 'fallback-80x80', type },
              { id: 'fallback-3', format_name: '90x90 cm', price_multiplier: 65, rate_key: 'fallback-90x90', type }
            ]
          : [
              { id: 'fallback-1', format_name: '30x60 cm', price_multiplier: 42, rate_key: 'fallback-30x60', type },
              { id: 'fallback-2', format_name: '60x60 cm', price_multiplier: 48, rate_key: 'fallback-60x60', type }
            ]
      );
      
      toast({
        title: 'Kon geen formaten ophalen',
        description: 'Tijdelijke dataweergave gebruikt. Probeer het later opnieuw.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [type, toast]);

  // Update an existing format's price per square meter
  const updateTileFormat = useCallback(async (id: string, pricePerSqm: number) => {
    try {
      const result = await calculatorService.updateTileFormat(id, pricePerSqm);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setFormats(prev => 
        prev.map(format => 
          format.id === id ? { ...format, price_multiplier: pricePerSqm } : format
        )
      );

      toast({
        title: 'Formaat bijgewerkt',
        description: 'De prijs is succesvol bijgewerkt',
        duration: 3000,
      });
      
      return true;
    } catch (err: any) {
      console.error('Error updating format price:', err);
      
      toast({
        title: 'Fout bij bijwerken',
        description: err.message,
        variant: 'destructive',
      });
      
      return false;
    }
  }, [toast]);

  // Add a new format
  const addTileFormat = useCallback(async (formatName: string, pricePerSqm: number) => {
    setIsSubmitting(true);
    
    try {
      const result = await calculatorService.createTileFormat(type, formatName, pricePerSqm);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      if (!result.data) {
        throw new Error('Geen gegevens ontvangen bij het aanmaken van format');
      }
      
      setFormats(prev => [...prev, result.data!]);
      
      toast({
        title: 'Formaat toegevoegd',
        description: `${formatName} is succesvol toegevoegd met prijs €${pricePerSqm}/m²`,
        duration: 3000,
      });
      
      return true;
    } catch (err: any) {
      console.error('Error adding format:', err);
      
      toast({
        title: 'Fout bij toevoegen',
        description: err.message,
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [type, toast]);

  // Delete a format
  const deleteTileFormat = useCallback(async (id: string, formatName: string) => {
    // Confirmation dialog
    if (!window.confirm(`Weet u zeker dat u het formaat "${formatName}" wilt verwijderen?`)) {
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await calculatorService.deleteTileFormat(id);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setFormats(prev => prev.filter(format => format.id !== id));
      
      toast({
        title: 'Formaat verwijderd',
        description: `${formatName} is succesvol verwijderd`,
        duration: 3000,
      });
      
      return true;
    } catch (err: any) {
      console.error('Error deleting format:', err);
      
      toast({
        title: 'Fout bij verwijderen',
        description: err.message,
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [toast]);

  // Add sample formats
  const addSampleFormats = useCallback(async () => {
    setIsSubmitting(true);
    
    try {
      const result = await calculatorService.createSampleFormats(type);
      
      if (result.error) {
        if (result.count > 0) {
          toast({
            title: 'Let op',
            description: result.error,
            duration: 5000,
          });
          await fetchFormats(); // Refresh the formats
          return true;
        }
        throw new Error(result.error);
      }
      
      if (result.count === 0) {
        toast({
          title: 'Geen formaten toegevoegd',
          description: 'Er zijn geen formaten toegevoegd. Mogelijk bestaan ze al.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Voorbeeldformaten toegevoegd',
          description: `Er zijn ${result.count} formaten succesvol toegevoegd`,
          duration: 3000,
        });
        
        await fetchFormats(); // Refresh the formats
      }
      
      return true;
    } catch (err: any) {
      console.error('Error adding sample formats:', err);
      
      toast({
        title: 'Fout bij toevoegen voorbeelden',
        description: err.message,
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [type, toast, fetchFormats]);

  // Retry database connection
  const retryConnection = useCallback(async () => {
    setConnectionAttempts(prev => prev + 1);
    setError(null);
    
    toast({
      title: 'Opnieuw verbinden...',
      description: 'Bezig met opnieuw verbinden met de database',
      duration: 3000,
    });
    
    await fetchFormats();
  }, [fetchFormats, toast]);

  // Initial data fetch
  useEffect(() => {
    fetchFormats();
  }, [fetchFormats, connectionAttempts]);

  return {
    formats,
    isLoading,
    isSubmitting,
    error,
    isUsingFallback,
    connectionAttempts, 
    updateTileFormat,
    addTileFormat,
    deleteTileFormat,
    addSampleFormats,
    retryConnection
  };
}
