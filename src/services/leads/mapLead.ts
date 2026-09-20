import { inferBrand, type BrandId } from "@/config/brands";
import type { Lead, LeadSourceTable } from "@/components/admin/lead-management/types";

export interface RawLeadRow {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  project_type?: string | null;
  created_at: string;
  lead_score?: number | null;
  status?: string | null;
  total_price?: number | null;
  calculated_price?: number | null;
  latest_contact?: string | null;
  laatste_contactmoment?: string | null;
  notes?: string | null;
  additional_notes?: string | null;
  message?: string | null;
  square_meters?: number | null;
  source?: string | null;
  opvolging_gestopt?: boolean | null;
}

export function deriveStatus(row: RawLeadRow): string {
  if (row.status) return String(row.status);
  if (row.opvolging_gestopt) return "lost";
  const score = row.lead_score ?? 0;
  if (score > 70) return "won";
  if (score > 30) return "contacted";
  return "new";
}

export function mapRawLead(
  row: RawLeadRow,
  sourceTable: LeadSourceTable,
  brandOverride?: BrandId
): Lead {
  const name = row.name || row.customer_name || "Onbekend";
  const email = row.email || row.customer_email || "";
  const phone = row.phone || row.customer_phone || "";
  const source = row.source ?? null;
  const projectType = row.project_type ?? null;

  return {
    id: row.id,
    name,
    email,
    phone,
    project_type: projectType,
    created_at: row.created_at,
    lead_score: row.lead_score ?? null,
    status: deriveStatus(row),
    tags: [],
    total_price: row.total_price ?? row.calculated_price ?? null,
    latest_contact: row.latest_contact ?? row.laatste_contactmoment ?? undefined,
    notes: row.notes ?? undefined,
    square_meters: row.square_meters ?? null,
    additional_notes: row.additional_notes ?? row.message ?? null,
    message: row.message ?? null,
    source,
    brand: brandOverride ?? inferBrand(source, projectType),
    sourceTable,
  };
}
