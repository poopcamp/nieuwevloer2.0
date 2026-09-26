/**
 * After `vite build`, write dist/<route>/index.html for every public route.
 * Never writes dist/index.html (homepage template stays byte-for-byte).
 * Never writes flat dist/<route>.html files.
 *
 * Build: npm run build:seo
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createSeoResolver, NOT_FOUND_SEO } from "../src/seo/resolveSeo.mjs";
import { applyNotFoundHead, applyRouteHead, routeToIndexFile } from "./html-head.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const indexFile = path.join(distDir, "index.html");

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

function sha256(file) {
  return createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function assertAssets(html, label) {
  if (html.includes("index-apiFix")) {
    throw new Error(`${label} still references stale index-apiFix bundle`);
  }
  const refs = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]);
  const entry = refs.filter((ref) => /\/assets\/index-[A-Za-z0-9_-]+\.js$/.test(ref));
  if (entry.length < 1) {
    throw new Error(`${label} does not reference /assets/index-*.js`);
  }
  for (const ref of refs) {
    const asset = path.join(distDir, ref.replace(/^\//, ""));
    if (!fs.existsSync(asset)) {
      throw new Error(`${label} references missing ${ref}`);
    }
  }
}

function writeFile(file, html) {
  if (!file.endsWith(`${path.sep}index.html`)) {
    throw new Error(`refuse flat html output ${file}`);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

function main() {
  if (!fs.existsSync(indexFile)) {
    throw new Error("dist/index.html missing. Run vite build first.");
  }

  const before = sha256(indexFile);
  const template = fs.readFileSync(indexFile, "utf8");
  const seo = createSeoResolver(
    readJson("src/seo/route-meta-2026-09-26.json"),
    readJson("src/seo/extra-route-meta.json"),
  );

  const written = [];
  for (const routePath of seo.paths) {
    const resolved = seo.resolve(routePath);
    const file = routeToIndexFile(distDir, routePath);
    const html = applyRouteHead(template, resolved);
    const canonicals = html.match(/rel=["']canonical["']/gi) || [];
    if (canonicals.length !== 1) {
      throw new Error(`${routePath} has ${canonicals.length} canonicals`);
    }
    if (!html.includes(`href="${resolved.canonical}"`)) {
      throw new Error(`${routePath} missing canonical ${resolved.canonical}`);
    }
    if (html.includes('name="title"') || html.includes("name='title'")) {
      throw new Error(`${routePath} still has meta name=title`);
    }
    assertAssets(html, routePath);
    writeFile(file, html);
    written.push(path.relative(distDir, file));
  }

  const notFoundFile = path.join(distDir, "404.html");
  const notFoundHtml = applyNotFoundHead(template, NOT_FOUND_SEO);
  if (/rel=["']canonical["']/i.test(notFoundHtml)) {
    throw new Error("404.html contains a canonical");
  }
  if (!/noindex/i.test(notFoundHtml)) {
    throw new Error("404.html missing noindex");
  }
  assertAssets(notFoundHtml, "404.html");
  fs.writeFileSync(notFoundFile, notFoundHtml);
  written.push("404.html");

  const after = sha256(indexFile);
  if (before !== after) {
    throw new Error("REFUSE: prerender modified dist/index.html");
  }

  const manifest = path.join(distDir, "seo-output-files.txt");
  fs.writeFileSync(manifest, `${written.sort().join("\n")}\n`);
  console.log(`HOMEPAGE_UNCHANGED ${after}`);
  console.log(`WROTE ${written.length} html files (dist/index.html untouched)`);
  for (const file of written.sort()) console.log(`  ${file}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
