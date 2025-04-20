
export interface ProjectType {
  id: string;
  name: string;
  key: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectTypeFormValues {
  name: string;
  key: string;
  description: string;
  icon: string;
  isActive: boolean;
}
