/**
 * The prerendered document already has the right title, description and
 * canonical. Hydration must not replace them with a different client value
 * (the old "… | NIEUWEVLOER.BE" title, or a canonical without a slash).
 */

import { withTrailingSlash } from "./resolveSeo.mjs";

let snapshot = null;
let applying = false;

export function canonicalPath(href) {
  if (!href) return "";
  try {
    return withTrailingSlash(new URL(href, "https://nieuwevloer.be").pathname);
  } catch {
    return "";
  }
}

/**
 * Keep the static head only when it already describes this route.
 * The homepage shell (canonical = https://nieuwevloer.be/) must not be locked
 * onto a different URL.
 */
export function staticHeadMatchesRoute(candidate, pathname) {
  if (!candidate?.title || !candidate?.canonical) return null;
  const path = withTrailingSlash(pathname);
  if (path === "/" || withTrailingSlash(candidate.path) !== path) return null;
  if (canonicalPath(candidate.canonical) !== path) return null;
  return candidate;
}

export function captureStaticHead() {
  if (typeof document === "undefined") return null;
  const description =
    document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
  const canonical =
    document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
  snapshot = {
    path: withTrailingSlash(window.location.pathname),
    title: document.title,
    description,
    canonical,
  };
  return snapshot;
}

export function getStaticHeadSnapshot() {
  return snapshot;
}

export function enforceStaticHead(candidate, pathname) {
  const locked = staticHeadMatchesRoute(candidate, pathname);
  if (!locked || applying || typeof document === "undefined") return false;
  applying = true;
  try {
    if (document.title !== locked.title) document.title = locked.title;

    const titles = [...document.querySelectorAll("title")];
    if (titles.length === 0) {
      const title = document.createElement("title");
      title.textContent = locked.title;
      document.head.appendChild(title);
    } else {
      if (titles[0].textContent !== locked.title) titles[0].textContent = locked.title;
      for (const extra of titles.slice(1)) extra.remove();
    }

    const descriptions = [...document.querySelectorAll('meta[name="description"]')];
    if (descriptions.length === 0) {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      meta.setAttribute("content", locked.description);
      document.head.appendChild(meta);
    } else {
      if (descriptions[0].getAttribute("content") !== locked.description) {
        descriptions[0].setAttribute("content", locked.description);
      }
      for (const extra of descriptions.slice(1)) extra.remove();
    }

    const canonicals = [...document.querySelectorAll('link[rel="canonical"]')];
    if (canonicals.length === 0) {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", locked.canonical);
      document.head.appendChild(link);
    } else {
      if (canonicals[0].getAttribute("href") !== locked.canonical) {
        canonicals[0].setAttribute("href", locked.canonical);
      }
      for (const extra of canonicals.slice(1)) extra.remove();
    }
  } finally {
    applying = false;
  }
  return true;
}

export function installStaticHeadLock(candidate = snapshot) {
  if (typeof document === "undefined" || !candidate || candidate.installed) return;
  const apply = () => enforceStaticHead(candidate, window.location.pathname);
  const observer = new MutationObserver(apply);
  observer.observe(document.head, {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
  });
  window.addEventListener("popstate", apply);
  candidate.installed = true;
}
