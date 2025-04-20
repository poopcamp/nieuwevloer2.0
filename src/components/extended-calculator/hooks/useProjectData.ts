
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  ExtendedProject,
  TileStyle,
  TileFormat,
  CalculatorOption,
  CalculatorQuestion,
  ProjectPricing,
  ExtendedCalculatorState,
} from '../types';

export const useProjectData = (
  state: ExtendedCalculatorState,
  setState: React.Dispatch<React.SetStateAction<ExtendedCalculatorState>>
) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ExtendedProject[]>([]);
  const [tileStyles, setTileStyles] = useState<TileStyle[]>([]);
  const [tileFormats, setTileFormats] = useState<TileFormat[]>([]);
  const [options, setOptions] = useState<CalculatorOption[]>([]);
  const [questions, setQuestions] = useState<CalculatorQuestion[]>([]);
  const [pricing, setPricing] = useState<ProjectPricing | null>(null);
  
  const fetchProjects = async (initialProjectType?: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('extended_calculator_projects')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
  
      if (error) throw error;
      
      const typedData = data as unknown as ExtendedProject[];
      setProjects(typedData);
      
      if (typedData.length > 0) {
        if (initialProjectType) {
          const initialProject = typedData.find(p => p.key === initialProjectType);
          if (initialProject) {
            selectProject(initialProject);
          } else {
            selectProject(typedData[0]);
          }
        } else if (typedData.length === 1) {
          selectProject(typedData[0]);
        }
      }
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Fout",
        description: `Kon projecten niet laden: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectData = async (projectId: string) => {
    try {
      setLoading(true);
      
      const stylesResponse = await supabase
        .from('extended_calculator_tile_styles')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_active', true)
        .order('sort_order');
      
      if (stylesResponse.error) throw stylesResponse.error;
      setTileStyles(stylesResponse.data as unknown as TileStyle[]);
      
      const formatsResponse = await supabase
        .from('extended_calculator_tile_formats')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_active', true)
        .order('sort_order');
      
      if (formatsResponse.error) throw formatsResponse.error;
      setTileFormats(formatsResponse.data as unknown as TileFormat[]);
      
      const optionsResponse = await supabase
        .from('extended_calculator_options')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_active', true)
        .order('sort_order');
      
      if (optionsResponse.error) throw optionsResponse.error;
      setOptions(optionsResponse.data as unknown as CalculatorOption[]);
      
      const questionsResponse = await supabase
        .from('extended_calculator_questions')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_active', true)
        .order('sort_order');
      
      if (questionsResponse.error) throw questionsResponse.error;
      setQuestions(questionsResponse.data as unknown as CalculatorQuestion[]);
      
      const pricingResponse = await supabase
        .from('extended_calculator_pricing')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();
      
      if (pricingResponse.error && pricingResponse.error.code !== 'PGRST116') {
        throw pricingResponse.error;
      }
      
      if (pricingResponse.data) {
        setPricing(pricingResponse.data as unknown as ProjectPricing);
      } else {
        setPricing({
          id: '',
          project_id: projectId,
          base_price_per_sqm: 45,
          internal_base_cost_per_sqm: 30,
          cutting_loss_percentage: 10,
          minimum_price: 500,
          display_settings: null,
          created_at: '',
          updated_at: ''
        });
      }
      
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Fout",
        description: `Kon projectgegevens niet laden: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const selectProject = (project: ExtendedProject) => {
    setState({
      ...state,
      selectedProject: project,
      selectedTileStyle: null,
      selectedTileFormat: null,
      selectedOptions: [],
      questionResponses: {}
    });
    fetchProjectData(project.id);
  };

  return {
    loading,
    error,
    projects,
    tileStyles,
    tileFormats,
    options,
    questions,
    pricing,
    fetchProjects,
    selectProject,
  };
};
