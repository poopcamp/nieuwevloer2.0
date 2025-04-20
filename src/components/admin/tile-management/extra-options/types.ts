
export interface ExtraOption {
  id: string;
  name: string;
  price: number;
  project_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface FormValues {
  name: string;
  price: number;
  projectType?: string;
}
