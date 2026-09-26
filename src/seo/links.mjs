/**
 * Final internal URLs: https://nieuwevloer.be, no www, trailing slash,
 * and never a path that redirects. Anchors like /#portfolio stay as-is.
 * React Router route `path` values are not rewritten here.
 */
import { withTrailingSlash } from "./resolveSeo.mjs";

const ASSET =
  /\.(?:ico|png|jpe?g|gif|svg|webp|avif|css|js|mjs|map|woff2?|ttf|eot|pdf|xml|txt|json|mp4|webm|mp3)(?:$|[?#])/i;

const EXACT = new Map([
  ["/regio/", "/werkgebied/"],
  ["/regio/waasland/", "/werkgebied/"],
  ["/terras-gent/", "https://nieuwterras.be/terras-aanleggen-gent/"],
  ["/terras-eeklo/", "https://nieuwterras.be/terras-aanleggen-eeklo/"],
  ["/totaalproject-brugge/", "/totaalprojecten/"],
  ["/totaalproject-gent/", "/totaalprojecten/"],
  ["/tuinwerken-gent/", "/diensten/"],
  ["/diensten/tuinwerken/", "/diensten/"],
  ["/diensten/kleine-renovaties/", "/diensten/"],
  ["/diensten-gent/", "/regio/gent-omgeving/"],
  ["/diensten-brugge/", "/regio/brugse-ommeland/"],
  ["/diensten-eeklo/", "/regio/meetjesland/"],
  ["/wat-kost-badkamer/", "/diensten/badkamerrenovatie/"],
  ["/wat-kost-oprit/", "/oprit-aanleggen/"],
  ["/wat-kost-terras/", "/diensten/terrassen/"],
  ["/wat-kost-tuinwerken/", "/totaalprojecten/"],
  ["/wat-kost-vloeren/", "/diensten/vloeren/"],
  ["/wat-kost-waterdoorlatende-bestrating/", "/waterdoorlatende-bestrating/"],
  ["/privacy/", "/privacy-beleid/"],
  ["/privacy-policy/", "/privacy-beleid/"],
  ["/gdpr-verzoek/", "/privacy-beleid/"],
  ["/gidsen/", "/gids/"],
  ["/services/", "/diensten/"],
  ["/vloertegelplaatsing/", "/diensten/vloeren/"],
  ["/wandtegelplaatsing/", "/diensten/vloeren/"],
  ["/badkamerrenovatie/", "/diensten/badkamerrenovatie/"],
  ["/totale-badkamerrenovatie/", "/diensten/badkamerrenovatie/"],
]);

function splitUrl(raw) {
  const hashAt = raw.indexOf("#");
  const hash = hashAt >= 0 ? raw.slice(hashAt) : "";
  const beforeHash = hashAt >= 0 ? raw.slice(0, hashAt) : raw;
  const queryAt = beforeHash.indexOf("?");
  const search = queryAt >= 0 ? beforeHash.slice(queryAt) : "";
  const pathname = queryAt >= 0 ? beforeHash.slice(0, queryAt) : beforeHash;
  return { pathname: pathname || "/", search, hash };
}

/** Path that redirects, including when the slash is still missing. */
export function isRetiredPathname(pathname) {
  const path = withTrailingSlash(pathname);
  if (EXACT.has(path)) return true;
  if (/^\/oprit-(?!aanleggen\/)[^/]+\/$/.test(path)) return true;
  if (/^\/waterdoorlatende-bestrating-[^/]+\/$/.test(path)) return true;
  if (/^\/waterdoorlatend-bestratin/.test(path)) return true;
  if (/^\/kleine-renovaties-[^/]+\/$/.test(path)) return true;
  if (/^\/totaalproject-[^/]+\/$/.test(path)) return true;
  if (/^\/tuinwerken-[^/]+\/$/.test(path)) return true;
  if (/^\/tuinrenovaties-[^/]+\/$/.test(path)) return true;
  if (/^\/diensten-[^/]+\/$/.test(path)) return true;
  if (/^\/wat-kost-/.test(path)) return true;
  if (/^\/portfolio\/[^/]+\/$/.test(path)) return true;
  return false;
}

function applyRedirect(pathname) {
  const path = withTrailingSlash(pathname);
  if (EXACT.has(path)) return EXACT.get(path);
  if (/^\/oprit-(?!aanleggen\/)[^/]+\/$/.test(path)) return "/oprit-aanleggen/";
  if (/^\/waterdoorlatende-bestrating-[^/]+\/$/.test(path)) {
    return "/waterdoorlatende-bestrating/";
  }
  if (/^\/waterdoorlatend-bestratin/.test(path)) return "/waterdoorlatende-bestrating/";
  const kleine = path.match(/^\/kleine-renovaties-([^/]+)\/$/);
  if (kleine) return `/keramische-tegels-${kleine[1]}/`;
  if (/^\/totaalproject-[^/]+\/$/.test(path)) return "/totaalprojecten/";
  if (/^\/tuinwerken-[^/]+\/$/.test(path)) return "/diensten/";
  if (/^\/tuinrenovaties-[^/]+\/$/.test(path)) return "/diensten/";
  if (path === "/diensten-gent/") return "/regio/gent-omgeving/";
  if (path === "/diensten-brugge/") return "/regio/brugse-ommeland/";
  if (path === "/diensten-eeklo/") return "/regio/meetjesland/";
  if (/^\/diensten-[^/]+\/$/.test(path)) return "/diensten/";
  if (/^\/wat-kost-/.test(path)) return "/diensten/";
  const portfolio = path.match(/^\/portfolio\/([^/]+)\/$/);
  if (portfolio) return `/project/${portfolio[1]}/`;
  return path;
}

function join(path, search, hash) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return `${path}${search}${hash}`;
  }
  if (path === "/") {
    if (!search && hash) return `/${hash}`;
    return `/${search}${hash}`;
  }
  return `${path}${search}${hash}`;
}

/**
 * Rewrite one href or `to` value.
 * Same-origin results are root-relative (`/diensten/`).
 * Cross-domain finals (nieuwterras) stay absolute https.
 * mailto, tel, assets, and external hosts are unchanged.
 */
export function finalHref(input) {
  if (typeof input !== "string") return input;
  const raw = input.trim();
  if (
    !raw ||
    raw.startsWith("#") ||
    raw.startsWith("?") ||
    raw.startsWith("mailto:") ||
    raw.startsWith("tel:") ||
    raw.startsWith("javascript:") ||
    raw.startsWith("data:") ||
    raw.startsWith("blob:")
  ) {
    return raw;
  }

  if (raw.startsWith("/") && !raw.startsWith("//")) {
    const { pathname, search, hash } = splitUrl(raw);
    if (ASSET.test(pathname)) return raw;
    return join(applyRedirect(pathname), search, hash);
  }

  if (/^https?:\/\//i.test(raw)) {
    let url;
    try {
      url = new URL(raw);
    } catch {
      return raw;
    }
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (host === "nieuwterras.be") {
      const path = withTrailingSlash(url.pathname);
      return `https://nieuwterras.be${path}${url.search}${url.hash}`;
    }
    if (host !== "nieuwevloer.be") return raw;
    if (ASSET.test(url.pathname)) {
      return `https://nieuwevloer.be${url.pathname}${url.search}${url.hash}`;
    }
    return join(applyRedirect(url.pathname), url.search, url.hash);
  }

  return raw;
}

/** Absolute https form for JSON-LD url / @id / breadcrumb item. */
export function finalAbsolute(input) {
  if (typeof input !== "string") return input;
  const next = finalHref(input);
  if (typeof next !== "string") return input;
  if (
    next.startsWith("http://") ||
    next.startsWith("https://") ||
    next.startsWith("mailto:") ||
    next.startsWith("tel:") ||
    next.startsWith("#")
  ) {
    return next;
  }
  if (next.startsWith("/")) return `https://nieuwevloer.be${next}`;
  return input;
}

/** `to` prop for Link, NavLink, Navigate, and navigate(). */
export function mapTo(to) {
  if (to == null || typeof to === "number") return to;
  if (typeof to === "string") return finalHref(to);
  if (typeof to === "object" && typeof to.pathname === "string") {
    const rewritten = finalHref(to.pathname);
    if (rewritten.startsWith("http://") || rewritten.startsWith("https://")) {
      return rewritten;
    }
    const pathname = rewritten.split("?")[0].split("#")[0];
    return { ...to, pathname };
  }
  return to;
}

/**
 * Why a rendered href should fail the crawl.
 * Null means the href is allowed (external, asset, tel, or already final).
 */
export function linkOffense(href) {
  if (typeof href !== "string") return null;
  const raw = href.trim();
  if (
    !raw ||
    raw.startsWith("#") ||
    raw.startsWith("mailto:") ||
    raw.startsWith("tel:") ||
    raw.startsWith("javascript:") ||
    raw.startsWith("data:") ||
    raw.startsWith("blob:")
  ) {
    return null;
  }
  if (raw.includes("cdn-cgi")) return null;

  let pathname = "";
  let search = "";
  let hash = "";
  if (raw.startsWith("/") && !raw.startsWith("//")) {
    ({ pathname, search, hash } = splitUrl(raw));
  } else if (/^https?:\/\//i.test(raw)) {
    let url;
    try {
      url = new URL(raw);
    } catch {
      return null;
    }
    const host = url.hostname.toLowerCase();
    if (host === "www.nieuwevloer.be" || host === "www.nieuwterras.be") {
      return `www host: ${raw}`;
    }
    if (host === "nieuwterras.be") {
      if (url.protocol !== "https:") return `not https: ${raw}`;
      if (url.pathname !== "/" && !url.pathname.endsWith("/")) {
        return `missing trailing slash: ${raw}`;
      }
      return null;
    }
    if (host !== "nieuwevloer.be") return null;
    if (url.protocol !== "https:") return `not https: ${raw}`;
    pathname = url.pathname;
    search = url.search;
    hash = url.hash;
  } else {
    return null;
  }

  if (ASSET.test(pathname)) return null;
  if (isRetiredPathname(pathname)) return `retired route: ${raw}`;
  if (pathname !== "/" && !pathname.endsWith("/")) {
    return `missing trailing slash: ${raw}`;
  }
  if (search.startsWith("?") && pathname !== "/" && !pathname.endsWith("/")) {
    return `missing trailing slash: ${raw}`;
  }
  void hash;
  return null;
}

/** Admin nav highlight that still matches when the URL has a trailing slash. */
export function isPathActive(pathname, path) {
  const current = withTrailingSlash(pathname);
  const target = withTrailingSlash(path);
  if (target === "/admin/") return current === "/admin/";
  return current.startsWith(target);
}
