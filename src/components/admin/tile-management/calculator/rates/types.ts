
// Define rate entry types
export interface RateEntry {
  name: string;
  value: number;
}

// Define database rate item structure that matches Supabase table
export interface DatabaseRateItem {
  id: string;
  section_id: string;
  rate_key: string;
  name: string;
  value: number;
  project_type: string;
  created_at?: string;
  updated_at?: string;
}

// Define project rates structure
export interface ProjectRates {
  [sectionId: string]: {
    [rateKey: string]: RateEntry;
  };
}

// Define section type
export interface ProjectSection {
  id: string;
  title: string;
}

// Define props for ProjectTypeRates component
export interface ProjectTypeRatesProps {
  projectType: string;
  onUpdatePreview: (config: any) => void;
}

// Define props for RateSection component
export interface RateSectionProps {
  sectionId: string;
  rates: { [key: string]: RateEntry };
  onChange: (sectionId: string, rateKey: string, value: number) => void;
}

// Define props for RateField component
export interface RateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}
