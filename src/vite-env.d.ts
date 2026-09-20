/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_NIEUWTERRAS_API_URL?: string;
  readonly VITE_NIEUWTERRAS_ANON_KEY?: string;
  readonly VITE_NIEUWTERRAS_LEADS_TABLE?: string;
  readonly VITE_NIEUWTERRAS_ADMIN_API?: string;
  readonly VITE_NIEUWTERRAS_ADMIN_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
