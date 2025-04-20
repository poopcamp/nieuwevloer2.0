
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface TileStyle {
  id: string;
  name: string;
  price_multiplier: number;
  created_at: string;
}

const formSchema = z.object({
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

const TileStyleManager = () => {
  const { toast } = useToast();
  const [tileStyles, setTileStyles] = useState<TileStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTileStyle, setCurrentTileStyle] = useState<TileStyle | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price_multiplier: "1.0",
    },
  });

  // Fetch tile styles
  const fetchTileStyles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("tile_styles")
        .select("*")
        .order("name");

      if (error) throw error;
      setTileStyles(data || []);
    } catch (error: any) {
      toast({
        title: "Fout bij ophalen tegelstijlen",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTileStyles();
  }, []);

  // Open dialog for adding or editing
  const openDialog = (tileStyle: TileStyle | null = null) => {
    setCurrentTileStyle(tileStyle);
    
    if (tileStyle) {
      form.reset({
        name: tileStyle.name,
        price_multiplier: tileStyle.price_multiplier.toString().replace('.', ','),
      });
    } else {
      form.reset({
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
      
      if (currentTileStyle) {
        // Update existing tile style
        const { error } = await supabase
          .from("tile_styles")
          .update({
            name: data.name,
            price_multiplier: priceMultiplier,
          })
          .eq("id", currentTileStyle.id);

        if (error) throw error;
        
        toast({
          title: "Tegelstijl bijgewerkt",
          description: `${data.name} is succesvol bijgewerkt.`,
        });
      } else {
        // Add new tile style
        const { error } = await supabase
          .from("tile_styles")
          .insert({
            name: data.name,
            price_multiplier: priceMultiplier,
          });

        if (error) throw error;
        
        toast({
          title: "Tegelstijl toegevoegd",
          description: `${data.name} is succesvol toegevoegd.`,
        });
      }
      
      // Refresh the list
      fetchTileStyles();
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

  // Delete tile style
  const deleteTileStyle = async (id: string, name: string) => {
    if (!confirm(`Weet u zeker dat u ${name} wilt verwijderen?`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from("tile_styles")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Tegelstijl verwijderd",
        description: `${name} is succesvol verwijderd.`,
      });
      
      // Refresh the list
      fetchTileStyles();
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
        <h2 className="text-xl font-semibold">Tegelstijlen</h2>
        <Button onClick={() => openDialog()} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Nieuwe tegelstijl</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : tileStyles.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">Geen tegelstijlen gevonden. Voeg uw eerste tegelstijl toe.</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Naam</TableHead>
                <TableHead>Prijsmultiplier</TableHead>
                <TableHead className="w-24 text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tileStyles.map((tileStyle) => (
                <TableRow key={tileStyle.id}>
                  <TableCell>{tileStyle.name}</TableCell>
                  <TableCell>× {tileStyle.price_multiplier.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openDialog(tileStyle)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteTileStyle(tileStyle.id, tileStyle.name)}>
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
              {currentTileStyle ? "Tegelstijl bewerken" : "Nieuwe tegelstijl"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Naam</FormLabel>
                    <FormControl>
                      <Input placeholder="Voer naam in" {...field} />
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

export default TileStyleManager;
