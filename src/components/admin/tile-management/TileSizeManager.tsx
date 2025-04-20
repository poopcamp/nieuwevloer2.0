
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface TileType {
  id: string;
  name: string;
}

interface TileSize {
  id: string;
  tile_type_id: string;
  size_id: string;
  name: string;
  price_multiplier: number;
  created_at: string;
  tile_type_name?: string;
}

const formSchema = z.object({
  tile_type_id: z.string().min(1, "Selecteer een tegelsoort"),
  size_id: z.string().min(1, "Code is verplicht"),
  name: z.string().min(2, "Naam moet minimaal 2 karakters bevatten"),
  price_multiplier: z.string().refine(
    (val) => {
      const num = parseFloat(val.replace(',', '.'));
      return !isNaN(num) && num > 0;
    },
    { message: "Prijsmultiplier moet een positief getal zijn" }
  ),
});

type FormValues = z.infer<typeof formSchema>;

const TileSizeManager = () => {
  const { toast } = useToast();
  const [tileSizes, setTileSizes] = useState<TileSize[]>([]);
  const [tileTypes, setTileTypes] = useState<TileType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTileSize, setCurrentTileSize] = useState<TileSize | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tile_type_id: "",
      size_id: "",
      name: "",
      price_multiplier: "1.0",
    },
  });

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch tile types
      const { data: tileTypesData, error: tileTypesError } = await supabase
        .from("tile_types")
        .select("id, name")
        .order("name");

      if (tileTypesError) throw tileTypesError;
      setTileTypes(tileTypesData || []);

      // Fetch tile sizes with joined tile type names
      const { data: tileSizesData, error: tileSizesError } = await supabase
        .from("tile_sizes")
        .select(`
          *,
          tile_types(name)
        `)
        .order("name");

      if (tileSizesError) throw tileSizesError;
      
      // Process the joined data
      const processedTileSizes = tileSizesData.map(item => ({
        ...item,
        tile_type_name: item.tile_types ? (item.tile_types as any).name : 'Unknown'
      }));
      
      setTileSizes(processedTileSizes || []);
    } catch (error: any) {
      toast({
        title: "Fout bij ophalen gegevens",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open dialog for adding or editing
  const openDialog = (tileSize: TileSize | null = null) => {
    setCurrentTileSize(tileSize);
    
    if (tileSize) {
      form.reset({
        tile_type_id: tileSize.tile_type_id,
        size_id: tileSize.size_id,
        name: tileSize.name,
        price_multiplier: tileSize.price_multiplier.toString().replace('.', ','),
      });
    } else {
      form.reset({
        tile_type_id: "",
        size_id: "",
        name: "",
        price_multiplier: "1.0",
      });
    }
    
    setIsDialogOpen(true);
  };

  // Handle form submit
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const priceMultiplier = parseFloat(data.price_multiplier.replace(',', '.'));
      
      if (currentTileSize) {
        // Update existing tile size
        const { error } = await supabase
          .from("tile_sizes")
          .update({
            tile_type_id: data.tile_type_id,
            size_id: data.size_id,
            name: data.name,
            price_multiplier: priceMultiplier,
          })
          .eq("id", currentTileSize.id);

        if (error) throw error;
        
        toast({
          title: "Tegelformaat bijgewerkt",
          description: `${data.name} is succesvol bijgewerkt.`,
        });
      } else {
        // Check if combination already exists
        const { data: existingData, error: checkError } = await supabase
          .from("tile_sizes")
          .select("id")
          .eq("tile_type_id", data.tile_type_id)
          .eq("size_id", data.size_id)
          .maybeSingle();
        
        if (checkError) throw checkError;
        
        if (existingData) {
          throw new Error("Deze combinatie van tegelsoort en formaat bestaat al");
        }
        
        // Add new tile size
        const { error } = await supabase
          .from("tile_sizes")
          .insert({
            tile_type_id: data.tile_type_id,
            size_id: data.size_id,
            name: data.name,
            price_multiplier: priceMultiplier,
          });

        if (error) throw error;
        
        toast({
          title: "Tegelformaat toegevoegd",
          description: `${data.name} is succesvol toegevoegd.`,
        });
      }
      
      // Refresh the list
      fetchData();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Fout",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete tile size
  const deleteTileSize = async (id: string, name: string) => {
    if (!confirm(`Weet u zeker dat u ${name} wilt verwijderen?`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from("tile_sizes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Tegelformaat verwijderd",
        description: `${name} is succesvol verwijderd.`,
      });
      
      // Refresh the list
      fetchData();
    } catch (error: any) {
      toast({
        title: "Fout bij verwijderen",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Tegelformaten</h2>
        <Button onClick={() => openDialog()} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Nieuw tegelformaat</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : tileSizes.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">Geen tegelformaten gevonden. Voeg uw eerste tegelformaat toe.</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tegelsoort</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Naam</TableHead>
                <TableHead>Prijsmultiplier</TableHead>
                <TableHead className="w-24 text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tileSizes.map((tileSize) => (
                <TableRow key={tileSize.id}>
                  <TableCell>{tileSize.tile_type_name}</TableCell>
                  <TableCell>{tileSize.size_id}</TableCell>
                  <TableCell>{tileSize.name}</TableCell>
                  <TableCell>× {tileSize.price_multiplier.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openDialog(tileSize)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteTileSize(tileSize.id, tileSize.name)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentTileSize ? "Tegelformaat bewerken" : "Nieuw tegelformaat"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="tile_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tegelsoort</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!!currentTileSize} // Disable in edit mode
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer tegelsoort" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tileTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="size_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="bijv. 60x60" 
                        {...field} 
                        disabled={!!currentTileSize} // Disable in edit mode
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Naam</FormLabel>
                    <FormControl>
                      <Input placeholder="bijv. 60 x 60 cm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price_multiplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prijsmultiplier</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1,0"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Annuleren
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Opslaan...
                    </>
                  ) : (
                    "Opslaan"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TileSizeManager;
