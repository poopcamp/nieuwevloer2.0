
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { useExtraOptions } from './useExtraOptions';
import ExtraOptionsTable from './ExtraOptionsTable';
import ExtraOptionForm from './ExtraOptionForm';
import { ExtraOption, FormValues } from './types';

export interface ExtraOptionsManagerProps {
  category?: string; // Optional category filter
}

const ExtraOptionsManager = ({ category }: ExtraOptionsManagerProps) => {
  const {
    extraOptions,
    isLoading,
    addExtraOption,
    updateExtraOption,
    deleteExtraOption
  } = useExtraOptions(category);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<ExtraOption | null>(null);

  const handleOpenDialog = (option?: ExtraOption) => {
    if (option) {
      setEditingOption(option);
    } else {
      setEditingOption(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = async (values: FormValues) => {
    if (editingOption) {
      return await updateExtraOption(editingOption.id, values);
    } else {
      return await addExtraOption(values);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Extra Opties</CardTitle>
          <CardDescription>
            Beheer extra opties die klanten kunnen kiezen tijdens het configureren.
          </CardDescription>
        </div>
        <Button onClick={() => handleOpenDialog()} className="ml-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nieuwe Optie
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ExtraOptionsTable
            extraOptions={extraOptions}
            onEdit={handleOpenDialog}
            onDelete={deleteExtraOption}
          />
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingOption ? 'Extra optie bewerken' : 'Nieuwe extra optie toevoegen'}
              </DialogTitle>
            </DialogHeader>
            <ExtraOptionForm
              editingOption={editingOption}
              onSubmit={handleSubmit}
              onClose={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ExtraOptionsManager;
