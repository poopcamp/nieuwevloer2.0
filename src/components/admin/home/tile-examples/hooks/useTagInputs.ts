
import { useState } from "react";
import { TileExample } from "@/types/homeContent";

export const useTagInputs = (initialExamples: TileExample[]) => {
  const [tagInputs, setTagInputs] = useState<{[key: string]: string}>(() => {
    const initialTagInputs: {[key: string]: string} = {};
    initialExamples.forEach(example => {
      initialTagInputs[example.id] = '';
    });
    return initialTagInputs;
  });

  const updateTagInput = (exampleId: string, value: string) => {
    setTagInputs(prev => ({...prev, [exampleId]: value}));
  };

  const addTagInput = (exampleId: string) => {
    setTagInputs(prev => ({...prev, [exampleId]: ''}));
  };

  const getTagInput = (exampleId: string) => {
    return tagInputs[exampleId] || '';
  };

  const clearTagInput = (exampleId: string) => {
    setTagInputs(prev => ({...prev, [exampleId]: ''}));
  };

  return {
    tagInputs,
    updateTagInput,
    addTagInput,
    getTagInput,
    clearTagInput
  };
};
