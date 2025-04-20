
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
import { WallType, tableNames } from "@/utils/supabase/customTypes";

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

const WallTypesManager = () => {
  const { toast } = useToast();
  const [wallTypes, setWallTypes] = useState<WallType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentWallType, setCurrentWallType] = useState<WallType | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price_multiplier: "1.0",
    },
  });

  // Fetch data
  const fetchWallTypes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableNames.WALL_TYPES)
        .select("*")
        .order("name");

      if (error) throw error;
      setWallTypes(data as WallType[] || []);
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
    fetchWallTypes();
  }, []);

  // Open dialog for adding or editing
  const openDialog = (wallType: WallType | null = null) => {
    setCurrentWallType(wallType);
    
    if (wallType) {
      form.reset({
        name: wallType.name,
        price_multiplier: wallType.price_multiplier.toString().replace('.', ','),
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
      
      if (currentWallType) {
        // Update existing wall type
        const { error } = await supabase
          .from(tableNames.WALL_TYPES)
          .update({
            name: data.name,
            price_multiplier: priceMultiplier,
          })
          .eq("id", currentWallType.id);

        if (error) throw error;
        
        toast({
          title: "Wandtype bijgewerkt",
          description: `${data.name} is succesvol bijgewerkt.`,
        });
      } else {
        // Add new wall type
        const { error } = await supabase
          .from(tableNames.WALL_TYPES)
          .insert({
            name: data.name,
            price_multiplier: priceMultiplier,
          });

        if (error) throw error;
        
        toast({
          title: "Wandtype toegevoegd",
          description: `${data.name} is succesvol toegevoegd.`,
        });
      }
      
      // Refresh the list
      fetchWallTypes();
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

  // Delete wall type
  const deleteWallType = async (id: string, name: string) => {
    if (!confirm(`Weet u zeker dat u ${name} wilt verwijderen?`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from(tableNames.WALL_TYPES)
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Wandtype verwijderd",
        description: `${name} is succesvol verwijderd.`,
      });
      
      // Refresh the list
      fetchWallTypes();
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
        <h2 className="text-xl font-semibold">Wandtypes</h2>
        <Button onClick={() => openDialog()} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Nieuw wandtype</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : wallTypes.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">Geen wandtypes gevonden. Voeg uw eerste wandtype toe.</p>
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
              {wallTypes.map((wallType) => (
                <TableRow key={wallType.id}>
                  <TableCell>{wallType.name}</TableCell>
                  <TableCell>× {wallType.price_multiplier.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openDialog(wallType)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteWallType(wallType.id, wallType.name)}>
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
              {currentWallType ? "Wandtype bewerken" : "Nieuw wandtype"}
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
                      <Input placeholder="bijv. Standaard tegels" {...field} />
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

export default WallTypesManager;
