
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { QuickCalculatorTile } from "@/utils/supabase/customTypes";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface TileOptionFormProps {
  onSubmit: (data: Omit<QuickCalculatorTile, "id" | "created_at" | "updated_at">) => Promise<void>;
  initialData?: QuickCalculatorTile;
  isSubmitting: boolean;
  onCancel?: () => void;
  isEditing?: boolean;
}

const formSchema = z.object({
  value: z.string().min(1, "Waarde is verplicht"),
  label: z.string().min(1, "Label is verplicht"),
  price_per_sqm: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Prijs moet een positief getal zijn" }
  ),
});

type FormValues = z.infer<typeof formSchema>;

const TileOptionForm = ({ 
  onSubmit, 
  initialData, 
  isSubmitting,
  onCancel,
  isEditing = false
}: TileOptionFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      value: initialData.value,
      label: initialData.label,
      price_per_sqm: initialData.price_per_sqm.toString()
    } : {
      value: "",
      label: "",
      price_per_sqm: ""
    }
  });

  const handleSubmit = async (data: FormValues) => {
    await onSubmit({
      value: data.value,
      label: data.label,
      price_per_sqm: parseFloat(data.price_per_sqm)
    });
    if (!isEditing) {
      form.reset({
        value: "",
        label: "",
        price_per_sqm: ""
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waarde</FormLabel>
                <FormControl>
                  <Input placeholder="bijv. 60x60" {...field} disabled={isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input placeholder="bijv. 60 x 60 cm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price_per_sqm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prijs per m²</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    <Input placeholder="45.00" {...field} className="pl-7" type="number" step="0.01" min="0" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuleren
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Bijwerken" : "Toevoegen"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TileOptionForm;
