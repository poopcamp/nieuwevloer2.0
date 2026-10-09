import extraMeta from "./extra-route-meta.json";
import routeMeta from "./route-meta-2026-09-26.json";
import { createSeoResolver } from "./resolveSeo.mjs";

export const seo = createSeoResolver(routeMeta, extraMeta);

export const mappedSeoPaths = seo.paths.filter((path) => !seo.isDedicated(path));
