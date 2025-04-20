
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { ProjectType, ProjectTypeFormValues } from "./types";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  key: z.string().min(2, "Key must be at least 2 characters").regex(/^[a-z0-9_]+$/, "Key must contain only lowercase letters, numbers, and underscores"),
  description: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
});

interface ProjectTypeFormProps {
  projectType?: ProjectType;
  onSubmit: (values: ProjectTypeFormValues) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ProjectTypeForm({
  projectType,
  onSubmit,
  onCancel,
  loading = false,
}: ProjectTypeFormProps) {
  const isEditing = !!projectType;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: projectType?.name || "",
      key: projectType?.key || "",
      description: projectType?.description || "",
      icon: projectType?.icon || "",
      isActive: projectType?.isActive ?? true,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    // Make sure we're always providing required fields for ProjectTypeFormValues
    const formValues: ProjectTypeFormValues = {
      name: values.name,
      key: values.key,
      description: values.description || "",
      icon: values.icon || "",
      isActive: values.isActive
    };
    
    await onSubmit(formValues);
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bathroom Tiles" {...field} />
                  </FormControl>
                  <FormDescription>
                    The display name for this project type
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
                  <FormLabel>Key</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., bathroom_tiles" {...field} />
                  </FormControl>
                  <FormDescription>
                    A unique identifier (lowercase, no spaces)
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short description of this project type"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Lucide icon name (e.g., 'Bath')" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Name of a Lucide icon or emoji
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Show this project type in the configurator
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

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
