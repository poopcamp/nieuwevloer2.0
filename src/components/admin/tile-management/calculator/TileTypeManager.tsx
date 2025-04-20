
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { calculatorService } from "@/services/calculatorService";

interface TileType {
  id: string;
  type_name: string;
  price_multiplier: number;
  created_at?: string;
  updated_at?: string;
  category: 'floor' | 'wall';
  rate_key?: string;
}

const TileTypeManager = ({ category = 'floor' }: { category?: 'floor' | 'wall' }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [types, setTypes] = useState<TileType[]>([]);
  const [newType, setNewType] = useState<{type_name: string, price_multiplier: string}>({
    type_name: "",
    price_multiplier: "1.0"
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch tile types from the database
  useEffect(() => {
    const fetchTileTypes = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Use the calculatorService to fetch tile formats
        const { data, error, usingFallback } = await calculatorService.getTileFormats(category);
        
        if (error) {
          throw new Error(error);
        }
        
        console.log(`Retrieved ${data?.length || 0} ${category} tile types:`, data);
        
        // Transform the data to the right format if needed
        const transformedData = data?.map(item => ({
          id: item.id,
          type_name: item.format_name,
          price_multiplier: item.price_multiplier,
          rate_key: item.rate_key,
          created_at: item.created_at,
          updated_at: item.updated_at,
          category: category
        })) || [];
        
        setTypes(transformedData);
      } catch (error: any) {
        console.error(`Error fetching ${category} tile types:`, error);
        setError(`Fout bij ophalen van ${category === 'floor' ? 'vloer' : 'wand'}tegeltypes: ${error.message}`);
        toast({
          variant: "destructive",
          title: "Fout bij ophalen tegeltypes",
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTileTypes();
  }, [category, toast]);

  // Add new tile type
  const handleAddType = async () => {
    if (!newType.type_name || isNaN(parseFloat(newType.price_multiplier))) {
      toast({
        variant: "destructive",
        title: "Ongeldige gegevens",
        description: "Vul een geldige naam en prijsmultiplier in."
      });
      return;
    }
    
    setIsSaving(true);
    try {
      // Use the calculator service to create a new tile format
      const { data, error } = await calculatorService.createTileFormat(
        category,
        newType.type_name,
        parseFloat(newType.price_multiplier.replace(',', '.'))
      );
      
      if (error) {
        throw new Error(error);
      }
      
      // Add the new tile type to the local state
      if (data) {
        setTypes([...types, {
          id: data.id,
          type_name: data.format_name,
          price_multiplier: data.price_multiplier,
          created_at: data.created_at,
          updated_at: data.updated_at,
          category: category
        }]);
        
        // Reset the form
        setNewType({
          type_name: "",
          price_multiplier: "1.0"
        });
        
        toast({
          title: "Tegeltype toegevoegd",
          description: `${newType.type_name} is toegevoegd aan de ${category === 'floor' ? 'vloer' : 'wand'} tegeltypes.`
        });
      }
    } catch (error: any) {
      console.error("Error adding tile type:", error);
      setError(`Fout bij toevoegen van tegeltype: ${error.message}`);
      toast({
        variant: "destructive",
        title: "Fout bij toevoegen",
        description: error.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Update tile type
  const handleUpdateType = async (id: string, value: number) => {
    try {
      const { success, error } = await calculatorService.updateTileFormat(id, value);
        
      if (error) {
        throw new Error(error);
      }
      
      // Update the local state
      setTypes(types.map(type => 
        type.id === id ? { ...type, price_multiplier: value } : type
      ));
      
      toast({
        title: "Tegeltype bijgewerkt",
        description: "Prijsmultiplier succesvol bijgewerkt."
      });
    } catch (error: any) {
      console.error("Error updating tile type:", error);
      setError(`Fout bij bijwerken van tegeltype: ${error.message}`);
      toast({
        variant: "destructive",
        title: "Fout bij bijwerken",
        description: error.message
      });
    }
  };

  // Delete tile type
  const handleDeleteType = async (id: string, name: string) => {
    if (!confirm(`Weet u zeker dat u '${name}' wilt verwijderen?`)) {
      return;
    }
    
    try {
      const { success, error } = await calculatorService.deleteTileFormat(id);
        
      if (error) {
        throw new Error(error);
      }
      
      // Remove from local state
      setTypes(types.filter(type => type.id !== id));
      
      toast({
        title: "Tegeltype verwijderd",
        description: `'${name}' is verwijderd.`
      });
    } catch (error: any) {
      console.error("Error deleting tile type:", error);
      setError(`Fout bij verwijderen van tegeltype: ${error.message}`);
      toast({
        variant: "destructive",
        title: "Fout bij verwijderen",
        description: error.message
      });
    }
  };

  // Add sample data if none exists
  const handleAddSampleData = async () => {
    setIsSaving(true);
    
    try {
      const { success, count, error } = await calculatorService.createSampleFormats(category);
      
      if (error) {
        throw new Error(error);
      }
      
      if (count === 0) {
        toast({
          title: "Informatie",
          description: `Er bestaan al ${category === 'floor' ? 'vloertegel' : 'wandtegel'} types.`
        });
      } else {
        toast({
          title: "Voorbeeldgegevens toegevoegd",
          description: `${count} ${category === 'floor' ? 'vloertegel' : 'wandtegel'} types zijn toegevoegd.`
        });
        
        // Refresh the list
        const { data } = await calculatorService.getTileFormats(category);
        
        if (data) {
          const transformedData = data.map(item => ({
            id: item.id,
            type_name: item.format_name,
            price_multiplier: item.price_multiplier,
            rate_key: item.rate_key,
            created_at: item.created_at,
            updated_at: item.updated_at,
            category: category
          }));
          
          setTypes(transformedData);
        }
      }
    } catch (error: any) {
      console.error("Error adding sample data:", error);
      setError(`Fout bij toevoegen van voorbeeldgegevens: ${error.message}`);
      toast({
        variant: "destructive",
        title: "Fout bij toevoegen voorbeeldgegevens",
        description: error.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category === 'floor' ? 'Vloertegel' : 'Wandtegel'} Types</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* List of existing tile types */}
            <div className="space-y-4">
              {types.length === 0 ? (
                <div className="space-y-4">
                  <Card className="bg-gray-50 p-4">
                    <p className="text-sm text-gray-500 text-center">
                      Geen {category === 'floor' ? 'vloertegel' : 'wandtegel'}types gevonden.
                    </p>
                    <p className="text-xs text-gray-400 text-center mt-1">
                      Gebruik het formulier hieronder om tegeltypes toe te voegen
                      of voeg enkele voorbeeldtypes toe.
                    </p>
                  </Card>
                  
                  <div className="flex justify-center">
                    <Button 
                      variant="outline"
                      onClick={handleAddSampleData}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Voorbeeldgegevens toevoegen
                    </Button>
                  </div>
                </div>
              ) : (
                types.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2 flex-wrap gap-2">
                    <div className="flex-grow min-w-[180px]">
                      <Label>{type.type_name}</Label>
                    </div>
                    <div className="w-32">
                      <Input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={type.price_multiplier}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value) && value > 0) {
                            handleUpdateType(type.id, value);
                          }
                        }}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0"
                      onClick={() => handleDeleteType(type.id, type.type_name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Form for adding a new tile type */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-4">Nieuw tegeltype toevoegen</h3>
              <div className="flex flex-wrap gap-2 items-end">
                <div className="flex-grow min-w-[180px]">
                  <Label htmlFor="new-type-name">Type naam</Label>
                  <Input
                    id="new-type-name"
                    placeholder="bijv. Natuursteen"
                    value={newType.type_name}
                    onChange={(e) => setNewType({...newType, type_name: e.target.value})}
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor="new-type-multiplier">Prijsmultiplier</Label>
                  <Input
                    id="new-type-multiplier"
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="1.0"
                    value={newType.price_multiplier}
                    onChange={(e) => setNewType({...newType, price_multiplier: e.target.value})}
                  />
                </div>
                <Button
                  onClick={handleAddType}
                  disabled={isSaving || !newType.type_name}
                  className="flex-shrink-0 h-10"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Toevoegen
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TileTypeManager;
