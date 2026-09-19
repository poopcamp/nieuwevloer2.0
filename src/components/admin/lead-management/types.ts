import type { BrandId } from "@/config/brands";

export type LeadSourceTable =
  | "leads"
  | "configurations"
  | "contact_submissions"
  | "extended_calculator_submissions";

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
  message?: string | null;
  source?: string | null;
  brand: BrandId;
  sourceTable: LeadSourceTable;
}

export interface LeadStatus {
  value: string;
  label: string;
  color: string;
}

export const LEAD_STATUSES: LeadStatus[] = [
  { value: "new", label: "Nieuw", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-100" },
  { value: "contacted", label: "Gecontacteerd", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-100" },
  { value: "proposal", label: "Offerte verzonden", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-100" },
  { value: "won", label: "Gewonnen", color: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-100" },
  { value: "lost", label: "Verloren", color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-100" },
  { value: "on-hold", label: "On hold", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100" },
];

export function statusLabel(status?: string): string {
  return LEAD_STATUSES.find((item) => item.value === status)?.label || status || "Nieuw";
}

export function statusColor(status?: string): string {
  return LEAD_STATUSES.find((item) => item.value === status)?.color || "bg-gray-100 text-gray-800";
}
