
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  tags?: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
  publish_date?: string | null;
}
