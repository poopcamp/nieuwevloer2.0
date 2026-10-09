/** Head rewrite used by scripts/prerender-meta.mjs. Never touches dist/index.html itself. */

import path from "node:path";

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function escapeAttr(text) {
  return escapeHtml(text).replace(/"/g, "&quot;");
}

function strip(html, regex) {
  return html.replace(regex, "");
}

function upsertMeta(html, attrName, attrValue, content) {
  const re = new RegExp(
    `<meta\\b[^>]*\\b${attrName}=["']${attrValue}["'][^>]*>`,
    "i",
  );
  const tag = `<meta ${attrName}="${attrValue}" content="${escapeAttr(content)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function replaceTitle(html, title) {
  const tag = `<title>${escapeHtml(title)}</title>`;
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, tag);
  }
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function stripShared(html) {
  let next = html;
  next = strip(next, /<meta\b[^>]*\bname=["']title["'][^>]*>/gi);
  next = strip(next, /<link\b[^>]*\brel=["']canonical["'][^>]*>/gi);
  next = strip(next, /<link\b[^>]*\bhreflang=["'][^"']+["'][^>]*>/gi);
  next = strip(
    next,
    /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
  );
  return next;
}

function applySocial(html, title, description, canonical) {
  let next = upsertMeta(html, "name", "description", description);
  next = upsertMeta(next, "property", "og:title", title);
  next = upsertMeta(next, "property", "og:description", description);
  next = upsertMeta(next, "name", "twitter:title", title);
  next = upsertMeta(next, "name", "twitter:description", description);
  if (canonical) {
    next = upsertMeta(next, "property", "og:url", canonical);
  } else {
    next = strip(next, /<meta\b[^>]*\bproperty=["']og:url["'][^>]*>/gi);
  }
  return next;
}

export function applyRouteHead(html, seo) {
  if (!seo?.title || !seo?.description || !seo?.canonical) {
    throw new Error("applyRouteHead requires title, description and canonical");
  }
  if (!seo.canonical.endsWith("/")) {
    throw new Error(`canonical missing trailing slash: ${seo.canonical}`);
  }
  let next = stripShared(html);
  next = replaceTitle(next, seo.title);
  next = applySocial(next, seo.title, seo.description, seo.canonical);
  const links = [
    `<link rel="canonical" href="${escapeAttr(seo.canonical)}" />`,
    `<link rel="alternate" hreflang="nl-BE" href="${escapeAttr(seo.canonical)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${escapeAttr(seo.canonical)}" />`,
  ];
  if (seo.jsonLd) {
    links.push(
      `<script type="application/ld+json">${JSON.stringify(seo.jsonLd)}</script>`,
    );
  }
  next = next.replace("</head>", `    ${links.join("\n    ")}\n  </head>`);
  return next;
}

export function applyNotFoundHead(html, seo) {
  let next = stripShared(html);
  next = strip(next, /<meta\b[^>]*\bproperty=["']og:url["'][^>]*>/gi);
  next = replaceTitle(next, seo.title);
  next = applySocial(next, seo.title, seo.description, null);
  next = upsertMeta(next, "name", "robots", seo.robots || "noindex, follow");
  if (/rel=["']canonical["']/i.test(next)) {
    throw new Error("404 head still contains a canonical");
  }
  return next;
}

export function routeToIndexFile(distDir, routePath) {
  const rel = String(routePath).replace(/^\/+|\/+$/g, "");
  if (!rel || rel === "." || rel.includes("..") || path.isAbsolute(rel)) {
    throw new Error(`refuse to write dist/index.html for ${routePath}`);
  }
  const file = path.resolve(distDir, rel, "index.html");
  const rootIndex = path.resolve(distDir, "index.html");
  if (file === rootIndex) {
    throw new Error(`refuse homepage write for ${routePath}`);
  }
  return file;
}
