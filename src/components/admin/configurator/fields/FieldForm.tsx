
import React, { useState } from "react";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ConfiguratorField } from "@/utils/supabase/customTypes";
import { fieldTypes, fieldTypeRequiresOptions } from "../utils/field-utils";
import { DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

// Define the form schema with zod
const formSchema = z.object({
  key: z.string().min(2, "Sleutel moet minimaal 2 karakters bevatten")
    .regex(/^[a-z0-9_]+$/, "Sleutel mag alleen kleine letters, cijfers en underscores bevatten"),
  field_type: z.string().min(1, "Selecteer een veldtype"),
  label: z.string().min(2, "Label moet minimaal 2 karakters bevatten"),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  is_required: z.boolean().default(false),
  is_active: z.boolean().default(true)
});

interface FieldFormProps {
  field?: ConfiguratorField;
  stepId: string;
  onSubmit: (values: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function FieldForm({
  field,
  stepId,
  onSubmit,
  onCancel,
  loading = false,
}: FieldFormProps) {
  const isEditing = !!field;
  const [activeTab, setActiveTab] = useState("basic");
  const [currentFieldType, setCurrentFieldType] = useState(field?.field_type || '');
  const [optionsString, setOptionsString] = useState(() => {
    if (field?.options && Array.isArray(field.options)) {
      return JSON.stringify(field.options, null, 2);
    }
    return "[\n  {\n    \"label\": \"Optie 1\",\n    \"value\": \"optie_1\"\n  },\n  {\n    \"label\": \"Optie 2\",\n    \"value\": \"optie_2\"\n  }\n]";
  });
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: field?.key || "",
      field_type: field?.field_type || "",
      label: field?.label || "",
      description: field?.description || "",
      placeholder: field?.placeholder || "",
      is_required: field?.is_required ?? false,
      is_active: field?.is_active ?? true,
    },
  });

  // Handle field type change
  const handleFieldTypeChange = (value: string) => {
    setCurrentFieldType(value);
    form.setValue("field_type", value);
    
    // Reset options if field type changed and doesn't require options
    if (!fieldTypeRequiresOptions(value)) {
      setOptionsString("[]");
    } else {
      // Set default options for the selected field type
      setOptionsString("[\n  {\n    \"label\": \"Optie 1\",\n    \"value\": \"optie_1\"\n  },\n  {\n    \"label\": \"Optie 2\",\n    \"value\": \"optie_2\"\n  }\n]");
    }
  };

  // Handle options text change
  const handleOptionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOptionsString(e.target.value);
    setOptionsError(null);
  };

  // Parse options from string to JSON
  const parseOptions = (): any => {
    if (!fieldTypeRequiresOptions(currentFieldType)) {
      return null;
    }
    
    try {
      return JSON.parse(optionsString);
    } catch (error) {
      setOptionsError("Ongeldige JSON-structuur");
      return null;
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    // Parse options if needed
    let options = null;
    if (fieldTypeRequiresOptions(values.field_type)) {
      options = parseOptions();
      if (optionsError) return; // Don't submit if options have errors
    }
    
    // Include the step_id and options in the form values
    const formValues = {
      ...values,
      step_id: stepId,
      options: options
    };
    
    await onSubmit(formValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basisinformatie</TabsTrigger>
            <TabsTrigger value="options">Opties</TabsTrigger>
            <TabsTrigger value="pricing">Prijsimpact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input placeholder="Bijv. Tegelformaat" {...field} />
                    </FormControl>
                    <FormDescription>
                      Het label dat wordt getoond aan de gebruiker
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
                      <Input placeholder="bijv. tegelformaat" {...field} />
                    </FormControl>
                    <FormDescription>
                      Een unieke identificatie (kleine letters, geen spaties)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="field_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Veldtype</FormLabel>
                  <Select 
                    onValueChange={handleFieldTypeChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer een veldtype" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fieldTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Het type invoerveld dat wordt getoond
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
                      placeholder="Beschrijving van dit veld"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Optionele beschrijving voor dit veld
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="placeholder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placeholder</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Bijv. Selecteer een optie" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Placeholder tekst voor het veld
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="is_required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Verplicht</FormLabel>
                      <FormDescription>
                        Gebruiker moet dit veld invullen
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
              
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Actief</FormLabel>
                      <FormDescription>
                        Toon dit veld in de configurator
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
            </div>
          </TabsContent>
          
          <TabsContent value="options" className="space-y-4 pt-4">
            <Card>
              <CardContent className="pt-6">
                {fieldTypeRequiresOptions(currentFieldType) ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Opties voor {currentFieldType}</h3>
                      <p className="text-sm text-gray-500">
                        Voer de opties in als JSON-array. Elke optie moet een label en waarde hebben.
                      </p>
                    </div>
                    
                    {optionsError && (
                      <Alert variant="destructive">
                        <Info className="h-4 w-4" />
                        <AlertDescription>{optionsError}</AlertDescription>
                      </Alert>
                    )}
                    
                    <Textarea 
                      value={optionsString} 
                      onChange={handleOptionsChange}
                      className="font-mono text-sm" 
                      rows={10}
                    />
                    
                    <div className="text-xs text-gray-500">
                      Voorbeeld: [{"{"} "label": "Optie 1", "value": "optie_1" {"}"}]
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">
                      Dit veldtype heeft geen configureerbare opties.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pricing" className="space-y-4 pt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="py-8 text-center">
                  <p className="text-gray-500">
                    Prijsimpact configuratie wordt binnenkort geïmplementeerd.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
