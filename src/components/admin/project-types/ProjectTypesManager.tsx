
import React, { useState } from "react";
import { useProjectTypes } from "./hooks/useProjectTypes";
import { ProjectTypeForm } from "./ProjectTypeForm";
import { ProjectTypesList } from "./ProjectTypesList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectType, ProjectTypeFormValues } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectTypesManager() {
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
  } = useProjectTypes();

  const [selectedProjectType, setSelectedProjectType] = useState<ProjectType | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("list");

  const handleAddNew = () => {
    setSelectedProjectType(undefined);
    setIsFormOpen(true);
    setActiveTab("form");
  };

  const handleEdit = (projectType: ProjectType) => {
    setSelectedProjectType(projectType);
    setIsFormOpen(true);
    setActiveTab("form");
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setSelectedProjectType(undefined);
    setActiveTab("list");
  };

  const handleFormSubmit = async (values: ProjectTypeFormValues) => {
    try {
      setFormSubmitting(true);
      if (selectedProjectType) {
        await updateProjectType(selectedProjectType.id, values);
      } else {
        await createProjectType(values);
      }
      setIsFormOpen(false);
      setSelectedProjectType(undefined);
      setActiveTab("list");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteProjectType(id);
  };

  const handleDuplicate = async (id: string) => {
    await duplicateProjectType(id);
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Project Types</h2>
        {!isFormOpen && (
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Project Type
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {isFormOpen && (
          <TabsList className="mb-4">
            <TabsTrigger value="list" onClick={() => {
              if (isFormOpen) {
                handleCancelForm();
              }
            }}>
              All Project Types
            </TabsTrigger>
            <TabsTrigger value="form">
              {selectedProjectType ? "Edit Project Type" : "Add Project Type"}
            </TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="list" className="space-y-4">
          {loading ? (
            <LoadingState />
          ) : (
            <ProjectTypesList
              projectTypes={projectTypes}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onReorder={reorderProjectTypes}
            />
          )}
        </TabsContent>

        <TabsContent value="form">
          {isFormOpen && (
            <ProjectTypeForm
              projectType={selectedProjectType}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              loading={formSubmitting}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LoadingState() {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </Card>
  );
}
