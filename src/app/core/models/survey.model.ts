export interface Survey {
  id: string;
  name: string;
  description: string;
  category: string;
  end_date: string | null;
  status: 'draft' | 'published';
  created_at: string;
}
