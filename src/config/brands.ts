export type BrandId = "nv" | "nt";
export type BrandScope = "all" | BrandId;

export interface BrandMeta {
  id: BrandId;
  shortLabel: string;
  label: string;
  domain: string;
  accentClass: string;
  badgeClass: string;
}

export const BRANDS: Record<BrandId, BrandMeta> = {
  nv: {
    id: "nv",
    shortLabel: "NV",
    label: "NieuweVloer",
    domain: "nieuwevloer.be",
    accentClass: "text-teal-700 dark:text-teal-300",
    badgeClass: "bg-teal-100 text-teal-900 dark:bg-teal-900/40 dark:text-teal-100",
  },
  nt: {
    id: "nt",
    shortLabel: "NT",
    label: "NieuwTerras",
    domain: "nieuwterras.be",
    accentClass: "text-stone-700 dark:text-stone-300",
    badgeClass: "bg-stone-200 text-stone-900 dark:bg-stone-700 dark:text-stone-100",
  },
};

const NT_HINT =
  /(terras|patio|nieuwterras|\bnt\b|driveway|oprit|klinker|natuursteen)/i;

/** Infer brand from real API fields — never invent lead rows. */
export function inferBrand(source?: string | null, projectType?: string | null): BrandId {
  const haystack = `${source ?? ""} ${projectType ?? ""}`;
  return NT_HINT.test(haystack) ? "nt" : "nv";
}

export function brandMeta(id: BrandId): BrandMeta {
  return BRANDS[id];
}
