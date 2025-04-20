
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TileType {
  id: string;
  name: string;
  base_price: number;
  created_at: string;
  updated_at: string;
}

const TileTypeManager = () => {
  const [tileTypes, setTileTypes] = useState<TileType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTileType, setEditingTileType] = useState<TileType | null>(null);
  const [formValues, setFormValues] = useState({
    name: '',
    base_price: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTileTypes();
  }, []);

  const fetchTileTypes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tile_types')
        .select('*')
        .order('name');

      if (error) throw error;
      
      setTileTypes(data || []);
    } catch (error: any) {
      console.error('Error fetching tile types:', error);
      toast({
        title: "Fout bij ophalen",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (tileType?: TileType) => {
    if (tileType) {
      setEditingTileType(tileType);
      setFormValues({
        name: tileType.name,
        base_price: tileType.base_price
      });
    } else {
      setEditingTileType(null);
      setFormValues({ name: '', base_price: 0 });
    }
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: name === 'base_price' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formValues.name.trim()) {
      toast({
        title: "Validatiefout",
        description: "Naam is verplicht",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingTileType) {
        // Update existing tile type
        const { error } = await supabase
          .from('tile_types')
          .update({
            name: formValues.name,
            base_price: formValues.base_price
          })
          .eq('id', editingTileType.id);

        if (error) throw error;
        
        toast({
          title: "Tegelsoort bijgewerkt",
          description: "De tegelsoort is succesvol bijgewerkt."
        });
      } else {
        // Create new tile type
        const { error } = await supabase
          .from('tile_types')
          .insert({
            name: formValues.name,
            base_price: formValues.base_price
          });

        if (error) throw error;
        
        toast({
          title: "Tegelsoort toegevoegd",
          description: "De nieuwe tegelsoort is succesvol toegevoegd."
        });
      }
      
      // Refresh the list and close the dialog
      fetchTileTypes();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving tile type:', error);
      toast({
        title: "Fout bij opslaan",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze tegelsoort wilt verwijderen?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('tile_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Tegelsoort verwijderd",
        description: "De tegelsoort is succesvol verwijderd."
      });
      
      fetchTileTypes();
    } catch (error: any) {
      console.error('Error deleting tile type:', error);
      toast({
        title: "Fout bij verwijderen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tegelsoorten</CardTitle>
          <CardDescription>
            Beheer de beschikbare tegelsoorten en hun basisprijzen.
          </CardDescription>
        </div>
        <Button onClick={() => handleOpenDialog()} className="ml-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nieuwe Tegelsoort
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tileTypes.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            Geen tegelsoorten gevonden. Maak een nieuwe tegelsoort aan.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Naam</TableHead>
                <TableHead>Basisprijs (€/m²)</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tileTypes.map((tileType) => (
                <TableRow key={tileType.id}>
                  <TableCell className="font-medium">{tileType.name}</TableCell>
                  <TableCell>€{tileType.base_price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(tileType)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(tileType.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTileType ? 'Tegelsoort bewerken' : 'Nieuwe tegelsoort toevoegen'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Naam</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formValues.name}
                    onChange={handleInputChange}
                    placeholder="Vloertegel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="base_price">Basisprijs (€/m²)</Label>
                  <Input
                    id="base_price"
                    name="base_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formValues.base_price}
                    onChange={handleInputChange}
                    placeholder="45.00"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Annuleren
                  </Button>
                </DialogClose>
                <Button type="submit">
                  {editingTileType ? 'Bijwerken' : 'Toevoegen'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TileTypeManager;
