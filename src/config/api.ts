/**
 * Admin SPA talks to self-hosted GoTrue/PostgREST on the Home Server.
 * Never use *.supabase.co — that host causes login "Load failed".
 *
 * Anon keys come only from Vite env. Do not hardcode or invent JWTs.
 */

const SUPABASE_CO_HOST = /supabase\.co/i;

export const NIEUWELOER_API_DEFAULT = "https://api.nieuwevloer.be";

function trimSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export function isSupabaseCoHost(url: string | undefined | null): boolean {
  if (!url) return false;
  try {
    return SUPABASE_CO_HOST.test(new URL(url).hostname);
  } catch {
    return SUPABASE_CO_HOST.test(url);
  }
}

/**
 * Auth + REST base. Env override is ignored when it still points at *.supabase.co.
 */
export function getNieuweVloerApiUrl(): string {
  const fromEnv = import.meta.env.VITE_SUPABASE_URL?.trim();
  if (fromEnv && !isSupabaseCoHost(fromEnv)) {
    return trimSlash(fromEnv);
  }
  return NIEUWELOER_API_DEFAULT;
}

/** Required at build/runtime. Empty when HS has not set VITE_SUPABASE_ANON_KEY. */
export function getNieuweVloerAnonKey(): string {
  return import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || "";
}

export function hasNieuweVloerAnonKey(): boolean {
  return getNieuweVloerAnonKey().length > 0;
}

/**
 * Optional second API for NieuwTerras.
 * Leave empty to use the same api.nieuwevloer.be `leads` table (source filter).
 */
export function getNieuwTerrasApiUrl(): string | null {
  const fromEnv = import.meta.env.VITE_NIEUWTERRAS_API_URL?.trim();
  if (!fromEnv || isSupabaseCoHost(fromEnv)) return null;
  return trimSlash(fromEnv);
}

export function getNieuwTerrasAnonKey(): string {
  return import.meta.env.VITE_NIEUWTERRAS_ANON_KEY?.trim() || getNieuweVloerAnonKey();
}

export function getNieuwTerrasLeadsTable(): string {
  return import.meta.env.VITE_NIEUWTERRAS_LEADS_TABLE?.trim() || "leads";
}

/**
 * Optional JSON feed from nieuwterras-web (HS must expose this; not public today).
 * Example: https://nieuwterras.be/api/admin/overview
 */
export function getNieuwTerrasAdminApiUrl(): string | null {
  const fromEnv = import.meta.env.VITE_NIEUWTERRAS_ADMIN_API?.trim();
  if (!fromEnv || isSupabaseCoHost(fromEnv)) return null;
  return fromEnv;
}

export function getNieuwTerrasAdminToken(): string {
  return import.meta.env.VITE_NIEUWTERRAS_ADMIN_TOKEN?.trim() || "";
}

export function assertSafeAuthHost(url: string): void {
  if (isSupabaseCoHost(url)) {
    throw new Error(
      "Auth-host mag niet *.supabase.co zijn. Gebruik https://api.nieuwevloer.be"
    );
  }
}
