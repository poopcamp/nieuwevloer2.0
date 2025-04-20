import React, { useState } from "react";
import { ProjectType } from "./types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Pencil, 
  Trash2, 
  Copy, 
  AlertCircle, 
  MoveVertical,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { getIconComponent } from "../utils/icon-utils";

interface ProjectTypesListProps {
  projectTypes: ProjectType[];
  onEdit: (projectType: ProjectType) => void;
  onDelete: (id: string) => Promise<void>;
  onDuplicate: (id: string) => Promise<void>;
  onReorder?: (reorderedItems: ProjectType[]) => Promise<void>;
}

export function ProjectTypesList({
  projectTypes,
  onEdit,
  onDelete,
  onDuplicate,
  onReorder
}: ProjectTypesListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectTypeToDelete, setProjectTypeToDelete] = useState<ProjectType | null>(null);
  const [draggedItem, setDraggedItem] = useState<ProjectType | null>(null);
  
  const handleDelete = async () => {
    if (projectTypeToDelete) {
      await onDelete(projectTypeToDelete.id);
      setDeleteDialogOpen(false);
      setProjectTypeToDelete(null);
    }
  };

  const confirmDelete = (projectType: ProjectType) => {
    setProjectTypeToDelete(projectType);
    setDeleteDialogOpen(true);
  };
  
  const handleDragStart = (e: React.DragEvent, projectType: ProjectType) => {
    setDraggedItem(projectType);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e: React.DragEvent, projectType: ProjectType) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = async (e: React.DragEvent, targetProjectType: ProjectType) => {
    e.preventDefault();
    
    if (!draggedItem || !onReorder) return;
    
    if (draggedItem.id === targetProjectType.id) return;
    
    // Create a new array with the updated order
    const updatedItems = [...projectTypes];
    const draggedIndex = updatedItems.findIndex(item => item.id === draggedItem.id);
    const targetIndex = updatedItems.findIndex(item => item.id === targetProjectType.id);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Remove the dragged item
      updatedItems.splice(draggedIndex, 1);
      // Insert it at the new position
      updatedItems.splice(targetIndex, 0, draggedItem);
      
      // Update the order in the database
      await onReorder(updatedItems);
    }
    
    setDraggedItem(null);
  };

  return (
    <div>
      {projectTypes.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No project types found</h3>
          <p className="mt-1 text-sm text-gray-500">Create a new project type to get started.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {onReorder && <TableHead style={{ width: 50 }}></TableHead>}
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead style={{ width: 200 }} className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectTypes.map((projectType) => {
                const IconComponent = projectType.icon ? getIconComponent(projectType.icon) : null;
                
                return (
                  <TableRow 
                    key={projectType.id}
                    draggable={!!onReorder}
                    onDragStart={onReorder ? (e) => handleDragStart(e, projectType) : undefined}
                    onDragOver={onReorder ? (e) => handleDragOver(e, projectType) : undefined}
                    onDrop={onReorder ? (e) => handleDrop(e, projectType) : undefined}
                    className={onReorder ? "cursor-move hover:bg-gray-50" : ""}
                  >
                    {onReorder && (
                      <TableCell>
                        <MoveVertical className="h-5 w-5 text-gray-400" />
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center">
                        {IconComponent && (
                          <div className="mr-2">
                            <IconComponent className="h-5 w-5" />
                          </div>
                        )}
                        {projectType.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code>{projectType.key}</code>
                    </TableCell>
                    <TableCell>
                      {projectType.isActive ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(projectType)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDuplicate(projectType.id)}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Duplicate</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => confirmDelete(projectType)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete the project type "{projectTypeToDelete?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-700" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
