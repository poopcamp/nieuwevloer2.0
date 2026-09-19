import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getNieuwTerrasAnonKey,
  getNieuwTerrasApiUrl,
} from "@/config/api";

let cached: SupabaseClient | null | undefined;

/**
 * Optional second API client for NieuwTerras.
 * Null when VITE_NIEUWTERRAS_API_URL is unset — NT rows then come from the NV API.
 */
export function getNieuwTerrasClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = getNieuwTerrasApiUrl();
  if (!url) {
    cached = null;
    return cached;
  }

  cached = createClient(url, getNieuwTerrasAnonKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: "nt-admin-data",
    },
  });
  return cached;
}

export function isNieuwTerrasApiConfigured(): boolean {
  return Boolean(getNieuwTerrasApiUrl());
}
