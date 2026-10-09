/**
 * Builds the site and checks title, description and canonical.
 * Usage: node scripts/verify-seo.mjs
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyNotFoundHead, applyRouteHead } from "./html-head.mjs";
import {
  HOMEPAGE_TITLE,
  NOT_FOUND_SEO,
  canonicalUrl,
  createSeoResolver,
  isRetiredPath,
} from "../src/seo/resolveSeo.mjs";
import { claimOneReload, isChunkLoadError } from "../src/utils/chunkLoadError.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
let failed = 0;

function check(name, ok, detail = "") {
  if (ok) {
    console.log(`PASS ${name}`);
  } else {
    failed += 1;
    console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

function decodeAttr(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function tagText(html, regex) {
  const match = html.match(regex);
  return match ? decodeAttr(match[1]).trim() : "";
}

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
  };
}

function unitTests() {
  const seo = createSeoResolver(
    readJson("src/seo/route-meta-2026-09-26.json"),
    readJson("src/seo/extra-route-meta.json"),
  );

  const town = seo.resolve("/badkamer-eeklo");
  check(
    "unit town canonical has slash",
    town.canonical === "https://nieuwevloer.be/badkamer-eeklo/" &&
      town.title.startsWith("Badkamerrenovatie Eeklo"),
  );
  check("unit retired route is 404 head", seo.resolve("/oprit-aalter/").canonical === null);
  check("unit retired detector", isRetiredPath("/diensten-gent") && isRetiredPath("/diensten/tuinwerken/"));
  check(
    "unit diensten pages are distinct",
    seo.resolve("/diensten/vloeren/").title !== HOMEPAGE_TITLE &&
      seo.resolve("/diensten/terrassen/").canonical.endsWith("/diensten/terrassen/") &&
      seo.resolve("/diensten/badkamerrenovatie/").title.includes("Badkamerrenovatie"),
  );
  const serviceLd = JSON.stringify(seo.resolve("/badkamer-eeklo/").jsonLd);
  check(
    "unit service @id uses the slash url",
    serviceLd.includes("https://nieuwevloer.be/badkamer-eeklo/#service") &&
      !serviceLd.includes("/diensten/badkamer-renovatie-eeklo"),
  );

  check(
    "unit chunk error detected",
    isChunkLoadError(new Error("Failed to fetch dynamically imported module: /assets/index-CgcgYGsS.js")) &&
      isChunkLoadError(Object.assign(new Error("Loading chunk 4 failed."), { name: "ChunkLoadError" })),
  );
  check("unit ordinary error is not a chunk error", !isChunkLoadError(new Error("Er ging iets mis")));
  const storage = memoryStorage();
  check("unit one reload then stop", claimOneReload(storage) === true && claimOneReload(storage) === false);

  const fixture = `<!DOCTYPE html><html><head>
    <title>${HOMEPAGE_TITLE}</title>
    <meta name="title" content="home" />
    <meta name="description" content="Professionele tegelplaatsing door ervaren vakmensen in Maldegem en omgeving." />
    <link rel="canonical" href="https://nieuwevloer.be/" />
    <meta property="og:url" content="https://nieuwevloer.be/" />
    <meta property="og:title" content="home" />
    <meta property="og:description" content="home" />
    <meta name="twitter:title" content="home" />
    <meta name="twitter:description" content="home" />
    <script type="module" src="/assets/index-TEST.js"></script>
  </head><body><div id="root"></div></body></html>`;
  const rewritten = applyRouteHead(fixture, seo.resolve("/regio/meetjesland/"));
  check(
    "unit prerender head",
    (rewritten.match(/rel="canonical"/g) || []).length === 1 &&
      rewritten.includes('href="https://nieuwevloer.be/regio/meetjesland/"') &&
      rewritten.includes("Tegelzetter Meetjesland") &&
      !rewritten.includes('name="title"') &&
      !rewritten.includes(HOMEPAGE_TITLE),
  );
  const notFound = applyNotFoundHead(fixture, NOT_FOUND_SEO);
  check(
    "unit 404 head",
    !/rel="canonical"/i.test(notFound) &&
      /noindex/.test(notFound) &&
      notFound.includes(NOT_FOUND_SEO.title) &&
      !notFound.includes(HOMEPAGE_TITLE),
  );

  const deploy = fs.readFileSync(path.join(root, "scripts/deploy-marketing.sh"), "utf8");
  const rsyncCommand = deploy
    .split("\n")
    .some((line) => /^\s*[^#\n]*\brsync\b/.test(line));
  check("deploy script does not invoke rsync", !rsyncCommand);
  check("footer still shows the phone number", fs.readFileSync(path.join(root, "src/components/Footer.tsx"), "utf8").includes("0479304986"));
  check(
    "mapped pages keep a visible phone link",
    fs.readFileSync(path.join(root, "src/pages/seo/MappedSeoPage.tsx"), "utf8").includes("tel:0479304986"),
  );

  return seo;
}

function extractCanonicals(html) {
  return [...html.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi)].map((match) => {
    const href = match[0].match(/href=["']([^"']+)["']/i);
    return href ? decodeAttr(href[1]) : "";
  });
}

function checkHtmlFile(label, file, expected) {
  if (!fs.existsSync(file)) {
    check(label, false, `missing ${file}`);
    return;
  }
  const html = fs.readFileSync(file, "utf8");
  const title = tagText(html, /<title>([^<]*)<\/title>/i);
  const description = tagText(html, /<meta\b[^>]*\bname=["']description["'][^>]*\bcontent=["']([^"']*)["'][^>]*>/i)
    || tagText(html, /<meta\b[^>]*\bcontent=["']([^"']*)["'][^>]*\bname=["']description["'][^>]*>/i);
  const canonicals = extractCanonicals(html);
  const refs = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]);
  const entry = refs.filter((ref) => /\/assets\/index-[A-Za-z0-9_-]+\.js$/.test(ref));
  const assetsOk = entry.length >= 1 && refs.every((ref) => fs.existsSync(path.join(distDir, ref.replace(/^\//, ""))));

  if (expected.notFound) {
    check(
      label,
      title === expected.title &&
        canonicals.length === 0 &&
        /noindex/i.test(html) &&
        !html.includes(HOMEPAGE_TITLE) &&
        !html.includes("NieuwVloer") &&
        !html.includes("index-apiFix") &&
        assetsOk,
      `title=${title} canonicals=${canonicals.join(",")}`,
    );
    return;
  }

  check(
    label,
    title === expected.title &&
      description === expected.description &&
      canonicals.length === 1 &&
      canonicals[0] === expected.canonical &&
      expected.canonical.endsWith("/") &&
      !html.includes('name="title"') &&
      !html.includes(HOMEPAGE_TITLE) &&
      !html.includes("NieuwVloer") &&
      !html.includes("index-apiFix") &&
      assetsOk,
    `title=${title} description=${description} canonicals=${canonicals.join(",")}`,
  );
}

function checkBuild(seo) {
  const samples = [
    "/badkamer-eeklo/",
    "/blog/vorstschade-buitenvloer-voorkomen/",
    "/diensten/vloeren/",
    "/diensten/terrassen/",
    "/diensten/badkamerrenovatie/",
    "/regio/meetjesland/",
    "/keramische-tegels-brugge/",
    "/platines-knokke/",
    "/privacy-beleid/",
  ];

  for (const routePath of samples) {
    const expected = seo.resolve(routePath);
    const rel = `${routePath.replace(/^\/|\/$/g, "")}/index.html`;
    checkHtmlFile(`SAMPLE ${routePath}`, path.join(distDir, rel), expected);
  }
  checkHtmlFile("SAMPLE 404", path.join(distDir, "404.html"), {
    notFound: true,
    title: NOT_FOUND_SEO.title,
  });

  for (const routePath of seo.paths) {
    const expected = seo.resolve(routePath);
    const rel = `${routePath.replace(/^\/|\/$/g, "")}/index.html`;
    const file = path.join(distDir, rel);
    if (!samples.includes(routePath)) {
      checkHtmlFile(routePath, file, expected);
    }
  }

  const homepage = fs.readFileSync(path.join(distDir, "index.html"), "utf8");
  check(
    "homepage template title kept",
    homepage.includes(`<title>${HOMEPAGE_TITLE}</title>`) &&
      homepage.includes('href="https://nieuwevloer.be/"'),
  );

  const retired = [
    "oprit-aalter/index.html",
    "waterdoorlatende-bestrating-aalter/index.html",
    "tuinwerken-aalter/index.html",
    "totaalproject-aalter/index.html",
    "kleine-renovaties-aalter/index.html",
    "diensten-gent/index.html",
    "diensten-brugge/index.html",
    "diensten-eeklo/index.html",
    "diensten/tuinwerken/index.html",
    "badkamer-eeklo.html",
  ];
  check(
    "retired and flat html were not written",
    retired.every((rel) => !fs.existsSync(path.join(distDir, rel))),
  );

  const manifest = path.join(distDir, "seo-output-files.txt");
  check("output manifest exists", fs.existsSync(manifest));
  if (fs.existsSync(manifest)) {
    console.log("--- changed output files ---");
    process.stdout.write(fs.readFileSync(manifest, "utf8"));
  }
}

function checkDeploy() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "nv-deploy-"));
  fs.writeFileSync(path.join(tmp, "index.html"), "HOMEPAGE-LOCK Vanderheyden-must-stay");
  fs.mkdirSync(path.join(tmp, "badkamer-eeklo"), { recursive: true });
  fs.writeFileSync(path.join(tmp, "badkamer-eeklo/index.html"), "<title>old</title>");

  const result = spawnSync("bash", ["scripts/deploy-marketing.sh", "dist", tmp], {
    cwd: root,
    encoding: "utf8",
  });
  check("marketing deploy exit 0", result.status === 0, result.stderr || result.stdout);
  const homepage = fs.readFileSync(path.join(tmp, "index.html"), "utf8");
  check("deploy left homepage index.html untouched", homepage.includes("HOMEPAGE-LOCK"));
  const deployedTown = fs.readFileSync(path.join(tmp, "badkamer-eeklo/index.html"), "utf8");
  check(
    "deploy replaced town head",
    deployedTown.includes("Badkamerrenovatie Eeklo") &&
      deployedTown.includes("https://nieuwevloer.be/badkamer-eeklo/"),
  );
  const backups = fs.readdirSync(path.join(tmp, "badkamer-eeklo")).filter((name) => name.includes(".bak-"));
  check("deploy backed up existing index.html", backups.length === 1);
  const vander = fs.readFileSync(path.join(tmp, "vloerder-vanderheyden/index.html"), "utf8");
  check("deployed title contains Vanderheyden", /<title>[^<]*Vanderheyden[^<]*<\/title>/.test(vander));
  check("deploy wrote 404.html", fs.existsSync(path.join(tmp, "404.html")) && !/rel="canonical"/i.test(fs.readFileSync(path.join(tmp, "404.html"), "utf8")));
  check("canonicalUrl helper", canonicalUrl("/vloeren-aalter") === "https://nieuwevloer.be/vloeren-aalter/");
}

function main() {
  const seo = unitTests();
  if (failed > 0) {
    console.error(`${failed} unit check(s) failed; skipping build`);
    process.exit(1);
  }

  console.log("--- build:seo ---");
  const build = spawnSync("npm", ["run", "build:seo"], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  if (build.stdout) process.stdout.write(build.stdout);
  if (build.stderr) process.stderr.write(build.stderr);
  check("build:seo exit 0", build.status === 0);
  if (build.status !== 0) process.exit(1);

  checkBuild(seo);
  checkDeploy();

  if (failed > 0) {
    console.error(`FAIL ${failed} check(s)`);
    process.exit(1);
  }
  console.log("VERIFY_SEO_OK");
}

main();
