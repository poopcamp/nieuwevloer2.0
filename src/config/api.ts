/**
 * Frontend must talk to the Home Server / Kong gateway — never *.supabase.co.
 * Direct supabase.co hosts do not resolve from productie and cause Safari/WebKit
 * "Load failed" on login.
 */

const SUPABASE_CO_HOST = /supabase\.co/i;

export const NIEUWELOER_API_DEFAULT = "https://api.nieuwevloer.be";

/** Public anon JWT already used by nieuwevloer.be (Kong → GoTrue/PostgREST). */
export const NIEUWELOER_ANON_KEY_DEFAULT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzg2NjU4MjA4LCJleHAiOjIxMDIwMTgyMDh9.adquphELfykfrva55JI0JyRHfDDYNmHtxVotlYk-Tbc";

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
 * Resolve the NieuweVloer API base used for auth + REST.
 * Env override is ignored when it still points at *.supabase.co.
 */
export function getNieuweVloerApiUrl(): string {
  const fromEnv = import.meta.env.VITE_SUPABASE_URL?.trim();
  if (fromEnv && !isSupabaseCoHost(fromEnv)) {
    return trimSlash(fromEnv);
  }
  return NIEUWELOER_API_DEFAULT;
}

export function getNieuweVloerAnonKey(): string {
  return import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || NIEUWELOER_ANON_KEY_DEFAULT;
}

/**
 * Optional second PostgREST/GoTrue base for NieuwTerras.
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

export function assertSafeAuthHost(url: string): void {
  if (isSupabaseCoHost(url)) {
    throw new Error(
      "Auth-host mag niet *.supabase.co zijn. Gebruik https://api.nieuwevloer.be"
    );
  }
}
