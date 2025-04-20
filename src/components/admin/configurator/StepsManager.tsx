
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useConfiguratorSteps } from "./hooks/useConfiguratorSteps";
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
  MoveUp,
  MoveDown,
  ArrowLeftCircle,
  ArrowUpRight,
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
import { ConfiguratorStep } from "@/utils/supabase/customTypes";
import { StepForm } from "./steps/StepForm";

interface StepsManagerProps {
  projectTypeId: string;
  projectTypeName: string;
}

export function StepsManager({ projectTypeId, projectTypeName }: StepsManagerProps) {
  const {
    steps,
    loading,
    error,
    fetchSteps,
    createStep,
    updateStep,
    deleteStep,
    duplicateStep,
    reorderSteps,
  } = useConfiguratorSteps(projectTypeId);

  const [selectedStep, setSelectedStep] = useState<ConfiguratorStep | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stepToDelete, setStepToDelete] = useState<ConfiguratorStep | null>(null);
  const navigate = useNavigate();

  const handleAddNew = () => {
    setSelectedStep(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (step: ConfiguratorStep) => {
    setSelectedStep(step);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setSelectedStep(undefined);
  };

  const handleFormSubmit = async (values: any) => {
    try {
      setFormSubmitting(true);
      
      if (selectedStep) {
        await updateStep(selectedStep.id, values);
      } else {
        await createStep(values);
      }
      setIsFormOpen(false);
      setSelectedStep(undefined);
    } finally {
      setFormSubmitting(false);
    }
  };

  const confirmDelete = (step: ConfiguratorStep) => {
    setStepToDelete(step);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!stepToDelete) return;
    await deleteStep(stepToDelete.id);
    setDeleteDialogOpen(false);
    setStepToDelete(null);
  };

  const handleDuplicate = async (id: string) => {
    await duplicateStep(id);
  };

  const handleMoveUp = async (index: number) => {
    if (index <= 0) return;
    
    const updatedSteps = [...steps];
    const current = updatedSteps[index];
    const previous = updatedSteps[index - 1];
    
    // Swap positions in the array
    updatedSteps[index] = previous;
    updatedSteps[index - 1] = current;
    
    await reorderSteps(updatedSteps);
  };

  const handleMoveDown = async (index: number) => {
    if (index >= steps.length - 1) return;
    
    const updatedSteps = [...steps];
    const current = updatedSteps[index];
    const next = updatedSteps[index + 1];
    
    // Swap positions in the array
    updatedSteps[index] = next;
    updatedSteps[index + 1] = current;
    
    await reorderSteps(updatedSteps);
  };

  const handleManageFields = (step: ConfiguratorStep) => {
    navigate(`/admin/configurator-builder/fields/${step.id}`);
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
        <h3 className="text-lg font-medium text-red-800">Fout bij laden van stappen</h3>
        <p className="mt-1 text-sm text-red-700">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => fetchSteps()}
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
          <h2 className="text-lg font-medium">Stappen voor {projectTypeName}</h2>
          <p className="text-sm text-gray-500">
            Beheer de stappen die gebruikers doorlopen in de configurator
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nieuwe stap
        </Button>
      </div>
      
      {steps.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">
              Er zijn nog geen stappen aangemaakt voor dit projecttype. Klik op "Nieuwe stap" om te beginnen.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titel</TableHead>
                <TableHead>Sleutel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Volgorde</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {steps.map((step, index) => (
                <TableRow key={step.id}>
                  <TableCell className="font-medium">
                    {step.title}
                  </TableCell>
                  <TableCell>{step.key}</TableCell>
                  <TableCell>
                    {step.is_active ? (
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
                        disabled={index === steps.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <span className="ml-2 text-sm">{step.sort_order}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Velden beheren"
                        onClick={() => handleManageFields(step)}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Bewerken"
                        onClick={() => handleEdit(step)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Dupliceren"
                        onClick={() => handleDuplicate(step.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Verwijderen"
                        onClick={() => confirmDelete(step)}
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedStep ? 'Stap bewerken' : 'Nieuwe stap'}
            </DialogTitle>
          </DialogHeader>
          <StepForm
            step={selectedStep}
            projectTypeId={projectTypeId}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            loading={formSubmitting}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Stap verwijderen</AlertDialogTitle>
            <AlertDialogDescription>
              Weet u zeker dat u "{stepToDelete?.title}" wilt verwijderen? 
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
