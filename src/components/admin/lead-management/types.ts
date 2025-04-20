
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  project_type: string | null;
  created_at: string;
  lead_score: number | null;
  status?: string;
  tags?: string[];
  total_price: number | null;
  latest_contact?: string;
  notes?: string;
  square_meters?: number | null;
  additional_notes?: string | null;
}

export interface LeadStatus {
  value: string;
  label: string;
  color: string;
}

export const LEAD_STATUSES: LeadStatus[] = [
  { value: 'new', label: 'Nieuw', color: 'bg-blue-100 text-blue-800' },
  { value: 'contacted', label: 'Gecontacteerd', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'proposal', label: 'Offerte verzonden', color: 'bg-purple-100 text-purple-800' },
  { value: 'won', label: 'Gewonnen', color: 'bg-green-100 text-green-800' },
  { value: 'lost', label: 'Verloren', color: 'bg-red-100 text-red-800' },
  { value: 'on-hold', label: 'On hold', color: 'bg-gray-100 text-gray-800' },
];
