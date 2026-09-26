/**
 * Shared SEO lookup for the React app and the prerender script.
 * Canonicals always use a trailing slash. Homepage values are never
 * returned for another path. Retired city×service families are rejected.
 */

export const ORIGIN = "https://nieuwevloer.be";

export const HOMEPAGE_TITLE = "NieuweVloer.be - Professionele Tegelplaatsing";

export const NOT_FOUND_SEO = Object.freeze({
  title: "Pagina niet gevonden | NieuweVloer",
  description:
    "Deze pagina bestaat niet of is verplaatst. Bekijk de vloeren, terrassen en badkamerrenovaties van NieuweVloer of ga terug naar de startpagina.",
  canonical: null,
  robots: "noindex, follow",
  jsonLd: null,
});

const RETIRED = [
  /^\/oprit-[^/]+\/$/,
  /^\/waterdoorlatende-bestrating-[^/]+\/$/,
  /^\/tuinwerken-[^/]+\/$/,
  /^\/totaalproject-[^/]+\/$/,
  /^\/kleine-renovaties-[^/]+\/$/,
  /^\/diensten-gent\/$/,
  /^\/diensten-brugge\/$/,
  /^\/diensten-eeklo\/$/,
  /^\/diensten\/tuinwerken\/$/,
];

const DEDICATED = new Set([
  "/blog/",
  "/diensten/",
  "/diensten/vloeren/",
  "/diensten/terrassen/",
  "/diensten/badkamerrenovatie/",
  "/contact/",
  "/configurator/",
  "/gids/",
  "/projecten/",
]);

export function withTrailingSlash(pathname) {
  const raw = String(pathname ?? "/").split("?")[0].split("#")[0] || "/";
  const withLead = raw.startsWith("/") ? raw : `/${raw}`;
  if (withLead === "/") return "/";
  const trimmed = withLead.replace(/\/+$/, "");
  return `${trimmed}/`;
}

export function canonicalUrl(pathname) {
  return `${ORIGIN}${withTrailingSlash(pathname)}`;
}

export function isRetiredPath(pathname) {
  return RETIRED.some((re) => re.test(withTrailingSlash(pathname)));
}

function assertNotHomepageLeak(seo, pathname) {
  if (withTrailingSlash(pathname) === "/") return;
  if (seo.title === HOMEPAGE_TITLE) {
    throw new Error(`homepage title leaked onto ${pathname}`);
  }
  if (seo.canonical === `${ORIGIN}/`) {
    throw new Error(`homepage canonical leaked onto ${pathname}`);
  }
}

function isServicePath(pathname) {
  const path = withTrailingSlash(pathname);
  return (
    path === "/diensten/" ||
    path.startsWith("/diensten/") ||
    path.startsWith("/regio/") ||
    /^\/(badkamer|vloeren|keramische-tegels|platines)-/.test(path)
  );
}

function jsonLdFor(pathname, seo) {
  if (!seo.canonical) return null;
  const webPage = {
    "@type": "WebPage",
    "@id": `${seo.canonical}#webpage`,
    url: seo.canonical,
    name: seo.title,
    description: seo.description,
    isPartOf: {
      "@type": "WebSite",
      name: "NieuweVloer",
      url: `${ORIGIN}/`,
    },
  };
  if (!isServicePath(pathname)) {
    return { "@context": "https://schema.org", ...webPage };
  }
  return {
    "@context": "https://schema.org",
    "@graph": [
      webPage,
      {
        "@type": "Service",
        "@id": `${seo.canonical}#service`,
        url: seo.canonical,
        name: seo.title.split("|")[0].trim(),
        description: seo.description,
        provider: {
          "@type": "HomeAndConstructionBusiness",
          name: "NieuweVloer",
          url: `${ORIGIN}/`,
          telephone: "+32479304986",
        },
      },
    ],
  };
}

export function createSeoResolver(routeMeta, extraMeta) {
  const merged = new Map();

  for (const [key, value] of [
    ...Object.entries(routeMeta),
    ...Object.entries(extraMeta),
  ]) {
    const path = withTrailingSlash(key);
    if (path === "/") {
      throw new Error("refusing homepage entry in route meta");
    }
    if (isRetiredPath(path)) {
      throw new Error(`retired route in meta: ${path}`);
    }
    const expected = canonicalUrl(path);
    if (value.canonical !== expected) {
      throw new Error(
        `canonical mismatch for ${path}: ${value.canonical} !== ${expected}`,
      );
    }
    if (!value.title || !value.description) {
      throw new Error(`missing title or description for ${path}`);
    }
    if (value.title.includes("NieuwVloer") || value.description.includes("NieuwVloer")) {
      throw new Error(`brand typo NieuwVloer in ${path}`);
    }
    merged.set(path, {
      title: value.title,
      description: value.description,
      canonical: expected,
    });
  }

  const paths = [...merged.keys()];

  function has(pathname) {
    return merged.has(withTrailingSlash(pathname));
  }

  function isDedicated(pathname) {
    const path = withTrailingSlash(pathname);
    if (path.startsWith("/blog/")) return true;
    return DEDICATED.has(path);
  }

  function resolve(pathname, options = {}) {
    const path = withTrailingSlash(pathname);
    if (options.notFound || isRetiredPath(path)) {
      return { ...NOT_FOUND_SEO, path };
    }

    const fromMap = merged.get(path) || null;
    const title = options.title || fromMap?.title;
    const description = options.description || fromMap?.description;

    if (!title || !description) {
      const fallback = {
        title: title || "NieuweVloer",
        description:
          description ||
          "Vloeren, badkamers en terrassen door NieuweVloer uit Maldegem.",
        canonical: canonicalUrl(path),
        robots: undefined,
        path,
      };
      fallback.jsonLd = jsonLdFor(path, fallback);
      assertNotHomepageLeak(fallback, path);
      return fallback;
    }

    const seo = {
      title,
      description,
      canonical: canonicalUrl(path),
      robots: undefined,
      path,
    };
    if (seo.canonical.includes("/diensten/badkamer-renovatie-")) {
      throw new Error(`stale service url in canonical for ${path}`);
    }
    seo.jsonLd = jsonLdFor(path, seo);
    assertNotHomepageLeak(seo, path);
    return seo;
  }

  return {
    paths,
    has,
    isDedicated,
    isServicePath,
    resolve,
    canonicalUrl,
    withTrailingSlash,
  };
}
