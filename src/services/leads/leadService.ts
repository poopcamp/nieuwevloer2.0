import { supabase } from "@/integrations/supabase/client";
import {
  getNieuwTerrasClient,
  isNieuwTerrasApiConfigured,
} from "@/integrations/nieuwterras/client";
import { getNieuwTerrasLeadsTable } from "@/config/api";
import type { BrandScope } from "@/config/brands";
import type { Lead } from "@/components/admin/lead-management/types";
import { mapRawLead, type RawLeadRow } from "./mapLead";

export interface LeadFetchResult {
  leads: Lead[];
  nvCount: number;
  ntCount: number;
  ntConfigured: boolean;
  errors: string[];
}

async function fetchTable(
  client: typeof supabase,
  table: string,
  sourceTable: Lead["sourceTable"],
  brandOverride?: Lead["brand"]
): Promise<{ rows: Lead[]; error?: string }> {
  const { data, error } = await client
    .from(table as never)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    // Missing table on this API is expected (legacy vs current schema).
    if (error.code === "PGRST205" || error.code === "42P01") {
      return { rows: [] };
    }
    const optional = table !== "leads";
    const permission = /unauthorized|permission|jwt|row-level|rls/i.test(error.message);
    if (optional && permission) {
      return { rows: [] };
    }
    return { rows: [], error: `${table}: ${error.message}` };
  }

  const rows = ((data ?? []) as RawLeadRow[]).map((row) =>
    mapRawLead(row, sourceTable, brandOverride)
  );
  return { rows };
}

function mergeById(lists: Lead[][]): Lead[] {
  const seen = new Set<string>();
  const out: Lead[] = [];
  for (const list of lists) {
    for (const lead of list) {
      const key = `${lead.sourceTable}:${lead.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(lead);
    }
  }
  return out.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function fetchAllLeads(): Promise<LeadFetchResult> {
  const errors: string[] = [];

  const [primary, configurations, contacts, calculator] = await Promise.all([
    fetchTable(supabase, "leads", "leads"),
    fetchTable(supabase, "configurations", "configurations"),
    fetchTable(supabase, "contact_submissions", "contact_submissions"),
    fetchTable(supabase, "extended_calculator_submissions", "extended_calculator_submissions"),
  ]);

  for (const part of [primary, configurations, contacts, calculator]) {
    if (part.error) errors.push(part.error);
  }

  let ntRows: Lead[] = [];
  const ntConfigured = isNieuwTerrasApiConfigured();
  const ntClient = getNieuwTerrasClient();
  if (ntClient) {
    const nt = await fetchTable(
      ntClient as typeof supabase,
      getNieuwTerrasLeadsTable(),
      "leads",
      "nt"
    );
    if (nt.error) errors.push(`NieuwTerras: ${nt.error}`);
    ntRows = nt.rows.map((row) => ({ ...row, brand: "nt" as const }));
  }

  const leads = mergeById([
    primary.rows,
    configurations.rows,
    contacts.rows,
    calculator.rows,
    ntRows,
  ]);

  return {
    leads,
    nvCount: leads.filter((lead) => lead.brand === "nv").length,
    ntCount: leads.filter((lead) => lead.brand === "nt").length,
    ntConfigured,
    errors,
  };
}

export function filterLeadsByScope(leads: Lead[], scope: BrandScope): Lead[] {
  if (scope === "all") return leads;
  return leads.filter((lead) => lead.brand === scope);
}

export async function updateLeadStatus(lead: Lead, status: string): Promise<void> {
  const ntClient = getNieuwTerrasClient();
  const client =
    lead.brand === "nt" && ntClient ? (ntClient as typeof supabase) : supabase;

  if (lead.sourceTable === "leads") {
    const { error } = await client
      .from("leads" as never)
      .update({ status } as never)
      .eq("id", lead.id);
    if (error) throw error;
    return;
  }

  if (lead.sourceTable === "configurations") {
    const updateData: Record<string, unknown> = {
      laatste_contactmoment: new Date().toISOString(),
      opvolging_gestopt: status === "lost",
    };
    if (status === "new") updateData.lead_score = 10;
    if (status === "contacted") updateData.lead_score = 30;
    if (status === "proposal") updateData.lead_score = 50;
    if (status === "won") updateData.lead_score = 90;
    if (status === "on-hold") updateData.lead_score = 20;

    const { error } = await supabase
      .from("configurations")
      .update(updateData)
      .eq("id", lead.id);
    if (error) throw error;
    return;
  }

  if (lead.sourceTable === "extended_calculator_submissions") {
    const score =
      status === "won" ? 90 : status === "proposal" ? 50 : status === "contacted" ? 30 : 10;
    const { error } = await supabase
      .from("extended_calculator_submissions")
      .update({ lead_score: score })
      .eq("id", lead.id);
    if (error) throw error;
    return;
  }

  throw new Error("Status bijwerken is niet beschikbaar voor dit type aanvraag.");
}

export function weeklyLeadCounts(leads: Lead[]): { name: string; leads: number }[] {
  const days = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const buckets = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return { name: days[date.getDay()], key: date.toDateString(), leads: 0 };
  });

  for (const lead of leads) {
    const created = new Date(lead.created_at);
    const bucket = buckets.find((item) => item.key === created.toDateString());
    if (bucket) bucket.leads += 1;
  }

  return buckets.map(({ name, leads: count }) => ({ name, leads: count }));
}
