
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useConfiguratorFields } from "./hooks/useConfiguratorFields";
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
} from "@/components/ui/dialog";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Copy,
  MoveUp,
  MoveDown,
  ArrowLeftCircle,
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
import { Skeleton } from "@/components/ui/skeleton";
import { ConfiguratorField } from "@/utils/supabase/customTypes";
import { FieldForm } from "./fields/FieldForm";
import { getFieldTypeLabel } from "./utils/field-utils";

interface FieldsManagerProps {
  stepId: string;
  stepTitle: string;
}

export function FieldsManager({ stepId, stepTitle }: FieldsManagerProps) {
  const {
    fields,
    loading,
    error,
    fetchFields,
    createField,
    updateField,
    deleteField,
    duplicateField,
    reorderFields,
  } = useConfiguratorFields(stepId);

  const [selectedField, setSelectedField] = useState<ConfiguratorField | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<ConfiguratorField | null>(null);
  const navigate = useNavigate();

  const handleAddNew = () => {
    setSelectedField(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (field: ConfiguratorField) => {
    setSelectedField(field);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setSelectedField(undefined);
  };

  const handleFormSubmit = async (values: any) => {
    try {
      setFormSubmitting(true);
      
      if (selectedField) {
        await updateField(selectedField.id, values);
      } else {
        await createField(values);
      }
      setIsFormOpen(false);
      setSelectedField(undefined);
    } finally {
      setFormSubmitting(false);
    }
  };

  const confirmDelete = (field: ConfiguratorField) => {
    setFieldToDelete(field);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!fieldToDelete) return;
    await deleteField(fieldToDelete.id);
    setDeleteDialogOpen(false);
    setFieldToDelete(null);
  };

  const handleDuplicate = async (id: string) => {
    await duplicateField(id);
  };

  const handleMoveUp = async (index: number) => {
    if (index <= 0) return;
    
    const updatedFields = [...fields];
    const current = updatedFields[index];
    const previous = updatedFields[index - 1];
    
    // Swap positions in the array
    updatedFields[index] = previous;
    updatedFields[index - 1] = current;
    
    await reorderFields(updatedFields);
  };

  const handleMoveDown = async (index: number) => {
    if (index >= fields.length - 1) return;
    
    const updatedFields = [...fields];
    const current = updatedFields[index];
    const next = updatedFields[index + 1];
    
    // Swap positions in the array
    updatedFields[index] = next;
    updatedFields[index + 1] = current;
    
    await reorderFields(updatedFields);
  };

  const handleGoBack = () => {
    navigate(-1);
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
        <h3 className="text-lg font-medium text-red-800">Fout bij laden van velden</h3>
        <p className="mt-1 text-sm text-red-700">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => fetchFields()}
        >
          Opnieuw proberen
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div>
          <Button variant="outline" className="mb-2" onClick={handleGoBack}>
            <ArrowLeftCircle className="mr-2 h-4 w-4" />
            Terug naar stappen
          </Button>
          <h2 className="text-lg font-medium">Velden voor stap "{stepTitle}"</h2>
          <p className="text-sm text-gray-500">
            Beheer de velden die in deze configuratiestap worden getoond
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nieuw veld
        </Button>
      </div>
      
      {fields.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">
              Er zijn nog geen velden aangemaakt voor deze stap. Klik op "Nieuw veld" om te beginnen.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Veldtype</TableHead>
                <TableHead>Sleutel</TableHead>
                <TableHead>Verplicht</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Volgorde</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">
                    {field.label}
                  </TableCell>
                  <TableCell>{getFieldTypeLabel(field.field_type)}</TableCell>
                  <TableCell>{field.key}</TableCell>
                  <TableCell>
                    {field.is_required ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Verplicht
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Optioneel
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {field.is_active ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Actief
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Inactief
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
                        disabled={index === fields.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <span className="ml-2 text-sm">{field.sort_order}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Bewerken"
                        onClick={() => handleEdit(field)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Dupliceren"
                        onClick={() => handleDuplicate(field.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Verwijderen"
                        onClick={() => confirmDelete(field)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedField ? 'Veld bewerken' : 'Nieuw veld'}
            </DialogTitle>
          </DialogHeader>
          <FieldForm
            field={selectedField}
            stepId={stepId}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            loading={formSubmitting}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Veld verwijderen</AlertDialogTitle>
            <AlertDialogDescription>
              Weet u zeker dat u "{fieldToDelete?.label}" wilt verwijderen? 
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
