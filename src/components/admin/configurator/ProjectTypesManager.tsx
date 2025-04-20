
import React, { useState } from "react";
import { useConfiguratorProjectTypes } from "./hooks/useConfiguratorProjectTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Copy, 
  Check, 
  X,
  MoveUp,
  MoveDown,
  ArrowUpRight
} from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { getIconComponent } from "../utils/icon-utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfiguratorProjectType } from "@/utils/supabase/customTypes";
import type { ConfiguratorProjectTypeFormValues } from "./hooks/useConfiguratorProjectTypes";

interface ProjectTypesManagerProps {
  onSelectProjectType?: (projectTypeId: string, projectTypeName: string) => void;
}

export function ProjectTypesManager({ onSelectProjectType }: ProjectTypesManagerProps) {
  const {
    projectTypes,
    loading,
    error,
    fetchProjectTypes,
    createProjectType,
    updateProjectType,
    deleteProjectType,
    duplicateProjectType,
    reorderProjectTypes,
  } = useConfiguratorProjectTypes();

  const [selectedProjectType, setSelectedProjectType] = useState<ConfiguratorProjectType | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [formData, setFormData] = useState({
    name: "",
    key: "",
    description: "",
    icon: "",
    isActive: true
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectTypeToDelete, setProjectTypeToDelete] = useState<ConfiguratorProjectType | null>(null);

  const handleAddNew = () => {
    setSelectedProjectType(undefined);
    setIsFormOpen(true);
    setActiveTab("form");
    setFormData({
      name: "",
      key: "",
      description: "",
      icon: "",
      isActive: true
    });
  };

  const handleEdit = (projectType: ConfiguratorProjectType) => {
    setSelectedProjectType(projectType);
    setFormData({
      name: projectType.name,
      key: projectType.key,
      description: projectType.description || "",
      icon: projectType.icon || "",
      isActive: projectType.isActive
    });
    setIsFormOpen(true);
    setActiveTab("form");
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setSelectedProjectType(undefined);
    setActiveTab("list");
    setFormData({
      name: "",
      key: "",
      description: "",
      icon: "",
      isActive: true
    });
    setFormError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    try {
      setFormSubmitting(true);
      
      // Validate form
      if (!formData.name || !formData.key) {
        setFormError("Naam en sleutel zijn verplicht");
        return;
      }
      
      const values: ConfiguratorProjectTypeFormValues = {
        name: formData.name,
        key: formData.key.trim().toLowerCase().replace(/\s+/g, '_'),
        description: formData.description,
        icon: formData.icon,
        isActive: formData.isActive
      };
      
      if (selectedProjectType) {
        await updateProjectType(selectedProjectType.id, values);
      } else {
        await createProjectType(values);
      }
      
      handleCancelForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Onbekende fout bij opslaan';
      setFormError(errorMessage);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isActive: checked
    });
  };

  const confirmDelete = (projectType: ConfiguratorProjectType) => {
    setProjectTypeToDelete(projectType);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!projectTypeToDelete) return;
    await deleteProjectType(projectTypeToDelete.id);
    setDeleteDialogOpen(false);
    setProjectTypeToDelete(null);
  };

  const handleDuplicate = async (id: string) => {
    await duplicateProjectType(id);
  };

  const handleMoveUp = async (index: number) => {
    if (index <= 0) return;
    
    const updatedProjectTypes = [...projectTypes];
    const current = updatedProjectTypes[index];
    const previous = updatedProjectTypes[index - 1];
    
    // Swap positions in the array
    updatedProjectTypes[index] = previous;
    updatedProjectTypes[index - 1] = current;
    
    await reorderProjectTypes(updatedProjectTypes);
  };

  const handleMoveDown = async (index: number) => {
    if (index >= projectTypes.length - 1) return;
    
    const updatedProjectTypes = [...projectTypes];
    const current = updatedProjectTypes[index];
    const next = updatedProjectTypes[index + 1];
    
    // Swap positions in the array
    updatedProjectTypes[index] = next;
    updatedProjectTypes[index + 1] = current;
    
    await reorderProjectTypes(updatedProjectTypes);
  };

  const handleManageSteps = (projectType: ConfiguratorProjectType) => {
    if (onSelectProjectType) {
      onSelectProjectType(projectType.id, projectType.name);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Error loading project types</h3>
        <p className="mt-1 text-sm text-red-700">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => fetchProjectTypes()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-medium">Projecttypes</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nieuw projecttype
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedProjectType ? 'Projecttype bewerken' : 'Nieuw projecttype'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
              {formError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4">
                  {formError}
                </div>
              )}
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Naam</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Badkamer, Vloer, Terras, etc."
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="key">Sleutel (uniek)</Label>
                  <Input
                    id="key"
                    name="key"
                    value={formData.key}
                    onChange={handleInputChange}
                    placeholder="badkamer, vloer, terras, etc."
                  />
                  <span className="text-xs text-gray-500">
                    Een unieke identificatie zonder spaties of speciale tekens
                  </span>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Beschrijving</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Beschrijving van dit projecttype"
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="icon">Icoon</Label>
                  <Input
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    placeholder="Lucide icoon naam, bv. 'Bath'"
                  />
                  <span className="text-xs text-gray-500">
                    Naam van een Lucide icoon (zonder "Icon") of emoji
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Actief</Label>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancelForm}
                  disabled={formSubmitting}
                >
                  Annuleren
                </Button>
                <Button type="submit" disabled={formSubmitting}>
                  {formSubmitting ? "Bezig..." : "Opslaan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {projectTypes.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">
              Er zijn nog geen projecttypes aangemaakt. Klik op "Nieuw projecttype" om te beginnen.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
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
              {projectTypes.map((projectType, index) => {
                const IconComponent = projectType.icon ? getIconComponent(projectType.icon) : null;
                
                return (
                  <TableRow key={projectType.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {IconComponent && (
                          <div className="mr-2">
                            <IconComponent className="h-4 w-4" />
                          </div>
                        )}
                        {projectType.name}
                      </div>
                    </TableCell>
                    <TableCell>{projectType.key}</TableCell>
                    <TableCell>
                      {projectType.isActive ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Check className="h-3 w-3 mr-1" /> Actief
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          <X className="h-3 w-3 mr-1" /> Inactief
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === projectTypes.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <span className="ml-2 text-sm">{projectType.sort_order}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Stappen beheren"
                          onClick={() => handleManageSteps(projectType)}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Projecttype bewerken"
                          onClick={() => handleEdit(projectType)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Dupliceren"
                          onClick={() => handleDuplicate(projectType.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Verwijderen"
                          onClick={() => confirmDelete(projectType)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Projecttype verwijderen</AlertDialogTitle>
            <AlertDialogDescription>
              Weet u zeker dat u "{projectTypeToDelete?.name}" wilt verwijderen? 
              Deze actie kan niet ongedaan worden gemaakt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Verwijderen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
