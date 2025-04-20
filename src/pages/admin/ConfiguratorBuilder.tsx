
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, Route, Routes } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeftCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProjectTypesManager } from "@/components/admin/configurator/ProjectTypesManager";
import { StepsManager } from "@/components/admin/configurator/StepsManager";
import { FieldsManager } from "@/components/admin/configurator/FieldsManager";
import { useConfiguratorProjectTypes } from "@/components/admin/configurator/hooks/useConfiguratorProjectTypes";
import { supabase } from "@/integrations/supabase/client";
import { tableNames } from "@/utils/supabase/customTypes";

// Main configurator builder component
const ConfiguratorBuilder = () => {
  const [selectedProjectType, setSelectedProjectType] = useState<string | null>(null);
  const [selectedProjectTypeName, setSelectedProjectTypeName] = useState<string>("");
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [selectedStepTitle, setSelectedStepTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Get URL parameters
  const params = useParams();
  
  // Handle project type selection
  const handleProjectTypeSelect = async (projectTypeId: string, projectTypeName: string) => {
    setSelectedProjectType(projectTypeId);
    setSelectedProjectTypeName(projectTypeName);
    setSelectedStep(null);
    setSelectedStepTitle("");
  };

  // Handle step selection
  const handleStepSelect = async (stepId: string, stepTitle: string) => {
    setSelectedStep(stepId);
    setSelectedStepTitle(stepTitle);
  };

  // Load selected step or project type from URL params if available
  useEffect(() => {
    const loadStepDetails = async () => {
      if (params.stepId) {
        try {
          const { data, error } = await supabase
            .from(tableNames.CONFIGURATOR_STEPS)
            .select('id, title, project_type_id')
            .eq('id', params.stepId)
            .maybeSingle();

          if (error) throw error;
          if (data) {
            setSelectedStep(data.id);
            setSelectedStepTitle(data.title);

            // Load project type details
            const { data: projectTypeData, error: projectTypeError } = await supabase
              .from(tableNames.CONFIGURATOR_PROJECT_TYPES)
              .select('id, name')
              .eq('id', data.project_type_id)
              .maybeSingle();

            if (projectTypeError) throw projectTypeError;
            if (projectTypeData) {
              setSelectedProjectType(projectTypeData.id);
              setSelectedProjectTypeName(projectTypeData.name);
            }
          }
        } catch (err: any) {
          setError(`Fout bij laden van stap: ${err.message}`);
        }
      }
    };

    loadStepDetails();
  }, [params.stepId]);

  return (
    <>
      <Helmet>
        <title>Configurator Builder | Admin</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Configurator Builder</h1>
          <p className="text-gray-600 mt-1">
            Beheer alle aspecten van de modulaire configurator
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/admin">
            <ArrowLeftCircle className="mr-2 h-4 w-4" />
            Terug naar Dashboard
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Render different content based on URL path */}
      {params.stepId ? (
        <FieldsManager stepId={params.stepId} stepTitle={selectedStepTitle} />
      ) : selectedProjectType ? (
        <StepsManager 
          projectTypeId={selectedProjectType} 
          projectTypeName={selectedProjectTypeName} 
        />
      ) : (
        <ProjectTypesManager onSelectProjectType={handleProjectTypeSelect} />
      )}
    </>
  );
};

export default ConfiguratorBuilder;
