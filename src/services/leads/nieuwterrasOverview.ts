import { getNieuwTerrasAdminApiUrl, getNieuwTerrasAdminToken } from "@/config/api";
import { fetchAllLeads } from "./leadService";
import type { Lead } from "@/components/admin/lead-management/types";

export interface NtOfferte {
  id: string;
  name: string;
  email: string;
  phone: string;
  gemeente?: string | null;
  oppervlakte?: string | null;
  message?: string | null;
  status: string;
  created_at: string;
  unread?: boolean;
  source: "nv-api" | "nt-rest" | "nt-admin-api";
}

export interface NtOverview {
  offertes: NtOfferte[];
  stats: { totaal: number; ongelezen: number; dezeWeek: number };
  sources: string[];
  adminApiConfigured: boolean;
  contractNeeded: boolean;
  errors: string[];
}

function startOfWeek(now = new Date()): Date {
  const date = new Date(now);
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + mondayOffset);
  date.setHours(0, 0, 0, 0);
  return date;
}

function leadToOfferte(lead: Lead): NtOfferte {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    gemeente: null,
    oppervlakte: lead.square_meters != null ? String(lead.square_meters) : null,
    message: lead.message ?? lead.additional_notes ?? null,
    status: lead.status || "new",
    created_at: lead.created_at,
    unread: (lead.status || "new") === "new",
    source: lead.sourceTable === "leads" && lead.brand === "nt" ? "nt-rest" : "nv-api",
  };
}

function normalizeNtStatus(status: string): string {
  const map: Record<string, string> = {
    nieuw: "new",
    new: "new",
    gecontacteerd: "contacted",
    contacted: "contacted",
    offerte: "proposal",
    "offerte verzonden": "proposal",
    proposal: "proposal",
    gewonnen: "won",
    won: "won",
    verloren: "lost",
    lost: "lost",
    "on-hold": "on-hold",
    onhold: "on-hold",
  };
  return map[status.toLowerCase()] || status;
}

function pickString(row: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function mapAdminRow(row: Record<string, unknown>, index: number): NtOfferte {
  const name = pickString(row, ["naam", "name", "customer_name"]);
  const created =
    pickString(row, ["created_at", "createdAt", "datum", "ingediend"]) || new Date().toISOString();
  const unread =
    row.gelezen === false ||
    row.ongelezen === true ||
    row.unread === true ||
    pickString(row, ["status"]) === "nieuw";

  return {
    id: pickString(row, ["id"]) || `nt-${index}-${created}`,
    name: name || "Onbekend",
    email: pickString(row, ["email", "mail"]),
    phone: pickString(row, ["telefoon", "phone", "tel"]),
    gemeente: pickString(row, ["gemeente", "city", "plaats"]) || null,
    oppervlakte: pickString(row, ["oppervlakte", "m2", "square_meters"]) || null,
    message: pickString(row, ["bericht", "message", "notes"]) || null,
    status: normalizeNtStatus(pickString(row, ["status"]) || (unread ? "new" : "contacted")),
    created_at: created,
    unread,
    source: "nt-admin-api",
  };
}

async function fetchAdminApiFeed(): Promise<{ rows: NtOfferte[]; error?: string; configured: boolean }> {
  const url = getNieuwTerrasAdminApiUrl();
  if (!url) return { rows: [], configured: false };

  const headers: Record<string, string> = { Accept: "application/json" };
  const token = getNieuwTerrasAdminToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    headers["X-Admin-Token"] = token;
  }

  try {
    const response = await fetch(url, { headers });
    const payload = (await response.json().catch(() => null)) as
      | Record<string, unknown>
      | unknown[]
      | null;

    if (!response.ok) {
      const message =
        payload && typeof payload === "object" && !Array.isArray(payload) && typeof payload.error === "string"
          ? payload.error
          : `HTTP ${response.status}`;
      return { rows: [], configured: true, error: `NT admin API: ${message}` };
    }

    const list = Array.isArray(payload)
      ? payload
      : Array.isArray((payload as Record<string, unknown>)?.offertes)
        ? ((payload as Record<string, unknown>).offertes as unknown[])
        : Array.isArray((payload as Record<string, unknown>)?.leads)
          ? ((payload as Record<string, unknown>).leads as unknown[])
          : [];

    return {
      rows: list
        .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
        .map(mapAdminRow),
      configured: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "onbekende fout";
    return {
      rows: [],
      configured: true,
      error: `NT admin API onbereikbaar (${message}). CORS of ontbrekende route op nieuwterras-web.`,
    };
  }
}

function withStats(offertes: NtOfferte[]): NtOverview["stats"] {
  const weekStart = startOfWeek();
  return {
    totaal: offertes.length,
    ongelezen: offertes.filter((item) => item.unread).length,
    dezeWeek: offertes.filter((item) => new Date(item.created_at) >= weekStart).length,
  };
}

export async function fetchNieuwTerrasOverview(): Promise<NtOverview> {
  const errors: string[] = [];
  const sources: string[] = [];

  const [nvBundle, adminFeed] = await Promise.all([fetchAllLeads(), fetchAdminApiFeed()]);
  for (const message of nvBundle.errors) {
    if (!/unauthorized|permission|jwt/i.test(message)) errors.push(message);
  }
  if (adminFeed.error) errors.push(adminFeed.error);

  const fromNv = nvBundle.leads.filter((lead) => lead.brand === "nt").map(leadToOfferte);
  if (fromNv.length) sources.push("api.nieuwevloer.be (leads, NT-bron)");
  if (adminFeed.rows.length) sources.push("nieuwterras-web admin API");

  const seen = new Set<string>();
  const offertes: NtOfferte[] = [];
  for (const row of [...adminFeed.rows, ...fromNv]) {
    const key = `${row.email}|${row.created_at}|${row.name}`;
    if (seen.has(key) || seen.has(row.id)) continue;
    seen.add(key);
    seen.add(row.id);
    offertes.push(row);
  }

  offertes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return {
    offertes,
    stats: withStats(offertes),
    sources,
    adminApiConfigured: adminFeed.configured,
    contractNeeded: offertes.length === 0 && !adminFeed.configured,
    errors,
  };
}
