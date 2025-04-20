
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTileFormats } from "./hooks/useTileFormats";
import { useToast } from "@/hooks/use-toast";

interface TileFormatManagerProps {
  tileType: 'floor' | 'wall';
}

const TileFormatManager = ({ tileType }: TileFormatManagerProps) => {
  const { toast } = useToast();
  
  const {
    formats,
    isLoading,
    isSubmitting,
    error,
    isUsingFallback,
    addTileFormat,
    updateTileFormat,
    deleteTileFormat,
    addSampleFormats,
    retryConnection
  } = useTileFormats(tileType);
  
  const [newFormat, setNewFormat] = useState<{format_name: string, price_per_sqm: string}>({
    format_name: "",
    price_per_sqm: "45"
  });

  const handleAddFormat = async () => {
    if (!newFormat.format_name.trim()) {
      toast({
        title: "Fout",
        description: "Formaat naam is verplicht",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const price = parseFloat(newFormat.price_per_sqm);
      if (isNaN(price) || price <= 0) {
        toast({
          title: "Fout",
          description: "Prijs per m² moet een positief getal zijn",
          variant: "destructive"
        });
        return;
      }
      
      if (await addTileFormat(newFormat.format_name, price)) {
        setNewFormat({ format_name: "", price_per_sqm: "45" });
      }
    } catch (error) {
      console.error("Error adding format:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tileType === 'floor' ? 'Vloertegel' : 'Wandtegel'} Formaten</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-1">Database fout</div>
              <div>{error}</div>
              <div className="text-sm mt-2">
                De RLS policies zijn ingesteld, maar er lijkt nog een probleem te zijn met de database verbinding.
                Controleer de browser console voor meer informatie.
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Retry button for database connection */}
        {error && !isLoading && (
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={retryConnection}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Opnieuw verbinden met database
            </Button>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* List of existing tile formats */}
            {formats.length === 0 ? (
              <div className="space-y-4">
                <Card className="bg-gray-50 p-4">
                  <p className="text-sm text-gray-500 text-center">
                    Geen {tileType === 'floor' ? 'vloertegel' : 'wandtegel'} formaten gevonden in de database.
                  </p>
                  <p className="text-xs text-gray-400 text-center mt-1">
                    Gebruik het formulier hieronder om formaten toe te voegen of voeg voorbeeldgegevens toe.
                  </p>
                </Card>
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={addSampleFormats}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Voeg voorbeeld {tileType === 'floor' ? 'vloertegel' : 'wandtegel'} formaten toe
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Formaat Naam</TableHead>
                      <TableHead>Prijs per m²</TableHead>
                      <TableHead className="w-[100px]">Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formats.map((format) => (
                      <TableRow key={format.id}>
                        <TableCell>{format.format_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                              <Input
                                type="number"
                                step="0.1"
                                min="0.1"
                                className="w-24 pl-7"
                                value={format.price_multiplier}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  if (!isNaN(value) && value > 0) {
                                    updateTileFormat(format.id, value);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTileFormat(format.id, format.format_name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Form for adding a new tile format */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-4">Nieuw Tegelformaat Toevoegen</h3>
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <Label htmlFor="new-format-name">Formaat Naam</Label>
                  <Input
                    id="new-format-name"
                    className="w-full min-w-[200px]"
                    placeholder="bijv., 60x60 cm"
                    value={newFormat.format_name}
                    onChange={(e) => setNewFormat({...newFormat, format_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-format-price">Prijs per m²</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    <Input
                      id="new-format-price"
                      className="w-32 pl-7"
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="45"
                      value={newFormat.price_per_sqm}
                      onChange={(e) => setNewFormat({...newFormat, price_per_sqm: e.target.value})}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddFormat}
                  disabled={isSubmitting || !newFormat.format_name}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Format Toevoegen
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TileFormatManager;
