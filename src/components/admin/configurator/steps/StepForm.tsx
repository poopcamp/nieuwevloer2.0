
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ConfiguratorStep } from "@/utils/supabase/customTypes";
import { DialogFooter } from "@/components/ui/dialog";

const formSchema = z.object({
  title: z.string().min(2, "Titel moet minimaal 2 karakters bevatten"),
  key: z.string().min(2, "Sleutel moet minimaal 2 karakters bevatten")
    .regex(/^[a-z0-9_]+$/, "Sleutel mag alleen kleine letters, cijfers en underscores bevatten"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

export interface StepFormValues {
  title: string;
  key: string;
  description?: string;
  is_active: boolean;
}

interface StepFormProps {
  step?: ConfiguratorStep;
  projectTypeId: string;
  onSubmit: (values: StepFormValues & { project_type_id: string }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function StepForm({
  step,
  projectTypeId,
  onSubmit,
  onCancel,
  loading = false,
}: StepFormProps) {
  const isEditing = !!step;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: step?.title || "",
      key: step?.key || "",
      description: step?.description || "",
      is_active: step?.is_active ?? true,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    // Include the project_type_id in the form values
    const formValues: StepFormValues & { project_type_id: string } = {
      title: values.title,
      key: values.key,
      description: values.description,
      is_active: values.is_active,
      project_type_id: projectTypeId
    };
    
    await onSubmit(formValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titel</FormLabel>
              <FormControl>
                <Input placeholder="Bijv. Selecteer tegelformaat" {...field} />
              </FormControl>
              <FormDescription>
                De titel die wordt weergegeven in de configurator
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sleutel</FormLabel>
              <FormControl>
                <Input placeholder="bijv. tegelformaat_selectie" {...field} />
              </FormControl>
              <FormDescription>
                Een unieke identificatie (kleine letters, geen spaties)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beschrijving</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Beschrijving van deze stap"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Optionele beschrijving voor deze stap
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Actief</FormLabel>
                <FormDescription>
                  Toon deze stap in de configurator
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Annuleren
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Bezig..." : isEditing ? "Bijwerken" : "Aanmaken"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
