
import { useState } from 'react';
import { ExtendedCalculatorState, CalculatorOption } from '../types';

export const useStateManagement = () => {
  const [state, setState] = useState<ExtendedCalculatorState>({
    selectedProject: null,
    squareMeters: 10,
    selectedTileStyle: null,
    selectedTileFormat: null,
    selectedOptions: [],
    questionResponses: {},
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: '',
    wantsSiteVisit: false,
    wantsShowroomVisit: false,
    receivesNewsletter: false,
    uploadedImage: null,
    uploadedImageUrl: null,
    addressStreet: '',
    addressCity: ''
  });

  const updateState = (updates: Partial<ExtendedCalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const toggleOption = (option: CalculatorOption) => {
    setState(prev => {
      const isSelected = prev.selectedOptions.some(o => o.id === option.id);
      let updatedOptions;
      
      if (isSelected) {
        updatedOptions = prev.selectedOptions.filter(o => o.id !== option.id);
      } else {
        updatedOptions = [...prev.selectedOptions, option];
      }
      
      return { ...prev, selectedOptions: updatedOptions };
    });
  };

  return {
    state,
    setState,
    updateState,
    toggleOption
  };
};
