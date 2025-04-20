
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProjectType {
  id: string;
  name: string;
  description: string | null;
  key: string;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const ProjectTypesManager = () => {
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProjectType, setEditingProjectType] = useState<ProjectType | null>(null);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    key: '',
    icon: '',
    is_active: true,
    sort_order: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProjectTypes();
  }, []);

  const fetchProjectTypes = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching project types...');
      const { data, error } = await supabase
        .from('extended_calculator_projects')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      
      console.log('Retrieved project types:', data);
      setProjectTypes(data || []);
    } catch (error: any) {
      console.error('Error fetching project types:', error);
      toast({
        title: "Fout bij ophalen",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (projectType?: ProjectType) => {
    if (projectType) {
      setEditingProjectType(projectType);
      setFormValues({
        name: projectType.name,
        description: projectType.description || '',
        key: projectType.key,
        icon: projectType.icon || '',
        is_active: projectType.is_active,
        sort_order: projectType.sort_order
      });
    } else {
      setEditingProjectType(null);
      setFormValues({ 
        name: '', 
        description: '', 
        key: '', 
        icon: '', 
        is_active: true, 
        sort_order: projectTypes.length 
      });
    }
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormValues({
      ...formValues,
      is_active: checked,
    });
  };

  const generateKey = (name: string) => {
    return name.toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!formValues.name.trim()) {
      toast({
        title: "Validatiefout",
        description: "Naam is verplicht",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const key = formValues.key.trim() || generateKey(formValues.name);

    try {
      if (editingProjectType) {
        const { error } = await supabase
          .from('extended_calculator_projects')
          .update({
            name: formValues.name,
            description: formValues.description || null,
            key: key,
            icon: formValues.icon || null,
            is_active: formValues.is_active,
            sort_order: formValues.sort_order
          })
          .eq('id', editingProjectType.id);

        if (error) throw error;
        
        toast({
          title: "Project Type bijgewerkt",
          description: "Het project type is succesvol bijgewerkt."
        });
      } else {
        const { error } = await supabase
          .from('extended_calculator_projects')
          .insert({
            name: formValues.name,
            description: formValues.description || null,
            key: key,
            icon: formValues.icon || null,
            is_active: formValues.is_active,
            sort_order: formValues.sort_order
          });

        if (error) throw error;
        
        toast({
          title: "Project Type toegevoegd",
          description: "Het nieuwe project type is succesvol toegevoegd."
        });
      }
      
      fetchProjectTypes();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving project type:', error);
      toast({
        title: "Fout bij opslaan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Weet je zeker dat je '${name}' wilt verwijderen?`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('extended_calculator_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Project Type verwijderd",
        description: `'${name}' is succesvol verwijderd.`
      });
      
      fetchProjectTypes();
    } catch (error: any) {
      console.error('Error deleting project type:', error);
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
          <CardTitle>Project Types</CardTitle>
          <CardDescription>
            Beheer de projecttypes voor de configurator zoals vloer, badkamer, keukenwand, etc.
          </CardDescription>
        </div>
        <Button onClick={() => handleOpenDialog()} className="ml-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nieuw Project Type
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : projectTypes.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            Geen project types gevonden. Maak een nieuw project type aan.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Naam</TableHead>
                <TableHead>Sleutel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Volgorde</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectTypes.map((projectType) => (
                <TableRow key={projectType.id}>
                  <TableCell className="font-medium">{projectType.name}</TableCell>
                  <TableCell>{projectType.key}</TableCell>
                  <TableCell>
                    <Badge variant={projectType.is_active ? "outline" : "secondary"}>
                      {projectType.is_active ? "Actief" : "Inactief"}
                    </Badge>
                  </TableCell>
                  <TableCell>{projectType.sort_order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(projectType)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(projectType.id, projectType.name)}
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProjectType ? 'Project Type bewerken' : 'Nieuw project type toevoegen'}
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
                    placeholder="bijv. Badkamer"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="key">Sleutel (automatisch gegenereerd indien leeg)</Label>
                  <Input
                    id="key"
                    name="key"
                    value={formValues.key}
                    onChange={handleInputChange}
                    placeholder="bijv. badkamer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Unieke identifier, kleine letters zonder spaties
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Beschrijving</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formValues.description}
                    onChange={handleInputChange}
                    placeholder="Beschrijf het project type"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (optioneel)</Label>
                  <Input
                    id="icon"
                    name="icon"
                    value={formValues.icon}
                    onChange={handleInputChange}
                    placeholder="bijv. lucide-icons naam of emoji"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sorteervolgorde</Label>
                  <Input
                    id="sort_order"
                    name="sort_order"
                    type="number"
                    min="0"
                    value={formValues.sort_order}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formValues.is_active}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="is_active">Actief</Label>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isSubmitting}>
                    Annuleren
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Opslaan...
                    </>
                  ) : (
                    editingProjectType ? 'Bijwerken' : 'Toevoegen'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ProjectTypesManager;
