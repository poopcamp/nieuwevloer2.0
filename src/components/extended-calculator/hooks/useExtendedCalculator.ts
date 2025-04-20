
import { useEffect } from 'react';
import { useStateManagement } from './useStateManagement';
import { useProjectData } from './useProjectData';
import { usePriceCalculation } from './usePriceCalculation';
import { useFormSubmission } from './useFormSubmission';

export const useExtendedCalculator = (initialProjectType?: string) => {
  const { state, setState, updateState, toggleOption } = useStateManagement();
  
  const {
    loading,
    error,
    projects,
    tileStyles,
    tileFormats,
    options,
    questions,
    pricing,
    fetchProjects,
    selectProject
  } = useProjectData(state, setState);

  const { calculatePriceBreakdown } = usePriceCalculation();
  
  const {
    submitting,
    submissionSuccess,
    handleSubmit,
    resetForm
  } = useFormSubmission(
    state, 
    setState, 
    () => calculatePriceBreakdown(state, pricing)
  );

  // Calculate price breakdown with current state and pricing
  const getPriceBreakdown = () => calculatePriceBreakdown(state, pricing);

  useEffect(() => {
    fetchProjects(initialProjectType);
  }, [initialProjectType]);

  return {
    state,
    loading,
    submitting,
    error,
    projects,
    tileStyles,
    tileFormats,
    options,
    questions,
    pricing,
    updateState,
    selectProject,
    toggleOption,
    calculatePriceBreakdown: getPriceBreakdown,
    handleSubmit,
    submissionSuccess,
    resetForm
  };
};
