
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import ExtraOptionsForm from "./extra-options/ExtraOptionsForm";
import ExtraOptionsList from "./extra-options/ExtraOptionsList";
import EmptyOptionsState from "./extra-options/EmptyOptionsState";
import { useExtraOptions } from "./extra-options/hooks/useExtraOptions";

interface ExtraOptionsManagerProps {
  category?: string;
}

const ExtraOptionsManager = ({ category }: ExtraOptionsManagerProps) => {
  const { toast } = useToast();
  const {
    extraOptions,
    isLoading,
    isSaving,
    error,
    fetchExtraOptions,
    addSampleData,
    updateOption,
    deleteOption,
    addOption,
    newOption,
    setNewOption
  } = useExtraOptions(category);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Extra Opties Beheer</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin text-primary border-2 border-current border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* List of existing extra options */}
            {extraOptions.length === 0 ? (
              <EmptyOptionsState 
                onAddSampleData={addSampleData} 
                isSaving={isSaving}
              />
            ) : (
              <ExtraOptionsList 
                extraOptions={extraOptions} 
                onUpdate={updateOption} 
                onDelete={deleteOption} 
              />
            )}

            {/* Form for adding a new extra option */}
            <ExtraOptionsForm
              newOption={newOption}
              setNewOption={setNewOption}
              onAddOption={addOption}
              isSaving={isSaving}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExtraOptionsManager;
