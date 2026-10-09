/**
 * After render, every internal href must be the final URL:
 * trailing slash, https, no www, and not a route that redirects.
 *
 * Usage: node scripts/verify-seo-links.mjs
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { finalAbsolute, finalHref, isPathActive, linkOffense, mapTo } from "../src/seo/links.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = 4181;
const origin = `http://127.0.0.1:${port}`;

const PAGES = [
  "/",
  "/diensten/",
  "/diensten/vloeren/",
  "/diensten/terrassen/",
  "/diensten/badkamerrenovatie/",
  "/badkamer-eeklo/",
  "/tegelzetter-brugge/",
  "/blog/",
  "/blog/vorstschade-buitenvloer-voorkomen/",
  "/contact/",
  "/configurator/",
  "/projecten/",
  "/gids/",
  "/privacy-beleid/",
  "/werkgebied/",
  "/regio/meetjesland/",
  "/niet-bestaande-pagina/",
  "/admin/login/",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function unitTests() {
  assert(finalHref("/diensten") === "/diensten/", "nav path needs a slash");
  assert(finalHref("/diensten/") === "/diensten/", "slash must be idempotent");
  assert(finalHref("/") === "/", "homepage stays /");
  assert(finalHref("/#portfolio") === "/#portfolio", "homepage anchor stays");
  assert(
    finalHref("/configurator?projectType=vloer") === "/configurator/?projectType=vloer",
    "slash goes before the query",
  );
  assert(finalHref("/regio/waasland") === "/werkgebied/", "waasland");
  assert(finalHref("/regio") === "/werkgebied/", "bare regio");
  assert(finalHref("/regio/meetjesland") === "/regio/meetjesland/", "live regio page");
  assert(
    finalHref("/terras-gent") === "https://nieuwterras.be/terras-aanleggen-gent/",
    "terras gent",
  );
  assert(
    finalHref("/terras-eeklo") === "https://nieuwterras.be/terras-aanleggen-eeklo/",
    "terras eeklo",
  );
  assert(finalHref("/oprit-eeklo") === "/oprit-aanleggen/", "retired oprit town");
  assert(finalHref("/oprit-aanleggen") === "/oprit-aanleggen/", "live oprit page");
  assert(finalHref("/totaalproject-brugge") === "/totaalprojecten/", "totaalproject");
  assert(finalHref("/tuinwerken-gent") === "/diensten/", "tuinwerken");
  assert(finalHref("/diensten/tuinwerken") === "/diensten/", "diensten tuinwerken");
  assert(finalHref("/diensten-gent") === "/regio/gent-omgeving/", "diensten-gent");
  assert(finalHref("/wat-kost-vloeren") === "/diensten/vloeren/", "wat-kost vloeren");
  assert(
    finalHref("/wat-kost-waterdoorlatende-bestrating") === "/waterdoorlatende-bestrating/",
    "wat-kost waterdoorlatend",
  );
  assert(
    finalHref("/waterdoorlatende-bestrating") === "/waterdoorlatende-bestrating/",
    "waterdoorlatende page stays",
  );
  assert(
    finalHref("/waterdoorlatende-bestrating-eeklo") === "/waterdoorlatende-bestrating/",
    "retired town variant",
  );
  assert(
    finalHref("/kleine-renovaties-eeklo") === "/keramische-tegels-eeklo/",
    "kleine renovaties town",
  );
  assert(finalHref("/privacy") === "/privacy-beleid/", "privacy");
  assert(finalHref("/vloertegelplaatsing") === "/diensten/vloeren/", "old vloer path");
  assert(finalHref("/services") === "/diensten/", "services");
  assert(finalHref("/gidsen") === "/gids/", "gidsen");
  assert(
    finalHref("https://www.nieuwevloer.be/blog/post") === "/blog/post/",
    "www becomes a slash path",
  );
  assert(
    finalHref("https://nieuwterras.be/terras-aanleggen-gent") ===
      "https://nieuwterras.be/terras-aanleggen-gent/",
    "nieuwterras slash",
  );
  assert(finalHref("tel:0479304986") === "tel:0479304986", "phone stays");
  assert(finalHref("mailto:info@nieuwevloer.be") === "mailto:info@nieuwevloer.be", "mail stays");
  assert(
    finalAbsolute("https://nieuwevloer.be/portfolio/abc") === "https://nieuwevloer.be/project/abc/",
    "portfolio json-ld",
  );
  assert(
    finalAbsolute("https://nieuwevloer.be/regio") === "https://nieuwevloer.be/werkgebied/",
    "breadcrumb regio",
  );
  assert(
    finalAbsolute("https://nieuwevloer.be") === "https://nieuwevloer.be/",
    "organization url",
  );
  assert(
    finalAbsolute("https://nieuwevloer.be/badkamer-eeklo/#service") ===
      "https://nieuwevloer.be/badkamer-eeklo/#service",
    "service @id keeps the fragment",
  );
  assert(linkOffense("/diensten") === "missing trailing slash: /diensten", "offense slash");
  assert(linkOffense("/terras-gent/")?.startsWith("retired route"), "offense retired");
  assert(linkOffense("/oprit-aalter")?.startsWith("retired route"), "offense oprit");
  assert(linkOffense("/diensten/") === null, "final path is clean");
  assert(linkOffense("/") === null, "homepage href is clean");
  assert(linkOffense("/#portfolio") === null, "anchor is clean");
  assert(linkOffense("https://www.nieuwevloer.be/diensten/")?.includes("www"), "offense www");
  assert(linkOffense("https://facebook.com") === null, "external stays");
  assert(linkOffense("tel:0479304986") === null, "tel stays");
  assert(mapTo({ pathname: "/contact", search: "?x=1" }).pathname === "/contact/", "object to");
  assert(isPathActive("/admin/leads/", "/admin/leads"), "admin highlight with slash");
  assert(isPathActive("/admin/", "/admin"), "admin index highlight");
  assert(!isPathActive("/admin/leads/", "/admin"), "admin index is not every child");
  console.log("PASS link unit tests");
}

function urlsInJson(value, found) {
  if (Array.isArray(value)) {
    value.forEach((item) => urlsInJson(item, found));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if ((key === "url" || key === "@id" || key === "item") && typeof child === "string") {
      found.push(child);
    } else {
      urlsInJson(child, found);
    }
  }
}

function waitForPreview() {
  return new Promise((resolve, reject) => {
    const server = spawn(
      "npx",
      ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
      { cwd: root, stdio: "pipe", detached: true },
    );
    const timer = setTimeout(() => {
      server.kill("SIGTERM");
      reject(new Error("preview did not start"));
    }, 20000);
    const onData = (buf) => {
      const text = String(buf);
      if (text.includes("Local") || text.includes(String(port))) {
        clearTimeout(timer);
        resolve(server);
      }
    };
    server.stdout.on("data", onData);
    server.stderr.on("data", onData);
    server.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`preview exited ${code}`));
    });
  });
}

async function main() {
  unitTests();
  if (process.env.SEO_SKIP_BUILD === "1") {
    console.log("--- skip build (SEO_SKIP_BUILD=1) ---");
  } else {
    console.log("--- build:seo ---");
    const build = spawn("npm", ["run", "build:seo"], { cwd: root, stdio: "inherit" });
    const buildCode = await new Promise((resolve) => build.on("exit", resolve));
    if (buildCode !== 0) throw new Error(`build:seo failed (${buildCode})`);
  }

  const server = await waitForPreview();
  const browser = await chromium.launch({
    executablePath: "/usr/local/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const failures = [];
  try {
    const page = await browser.newPage();
    await page.route("**/*", (requestRoute) => {
      const url = requestRoute.request().url();
      if (
        url.includes("gpteng.co") ||
        url.includes("fonts.googleapis") ||
        url.includes("fonts.gstatic")
      ) {
        return requestRoute.abort();
      }
      return requestRoute.continue();
    });

    for (const route of PAGES) {
      await page.goto(`${origin}${route}`, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(
        () => {
          const root = document.getElementById("root");
          return Boolean(root && (root.innerText || "").trim().length > 20);
        },
        null,
        { timeout: 15000 },
      );
      const collected = await page.evaluate(() => {
        const hrefs = [...document.querySelectorAll("a[href]")].map((anchor) =>
          anchor.getAttribute("href"),
        );
        const json = [...document.querySelectorAll('script[type="application/ld+json"]')].map(
          (script) => script.textContent || "",
        );
        return { hrefs, json };
      });

      const seen = new Set();
      for (const href of collected.hrefs) {
        if (seen.has(href)) continue;
        seen.add(href);
        const offense = linkOffense(href);
        if (offense) failures.push(`${route} ${offense}`);
      }
      for (const raw of collected.json) {
        if (!raw.trim()) continue;
        let data;
        try {
          data = JSON.parse(raw);
        } catch {
          failures.push(`${route} invalid json-ld`);
          continue;
        }
        const urls = [];
        urlsInJson(data, urls);
        for (const href of urls) {
          const offense = linkOffense(href);
          if (offense) failures.push(`${route} json-ld ${offense}`);
        }
      }
      if (route === "/") {
        const hrefs = new Set(collected.hrefs);
        for (const expected of [
          "/diensten/",
          "/configurator/",
          "/projecten/",
          "/gids/",
          "/blog/",
          "/contact/",
          "/diensten/vloeren/",
          "/diensten/badkamerrenovatie/",
          "/privacy-beleid/",
        ]) {
          if (!hrefs.has(expected)) failures.push(`homepage missing ${expected}`);
        }
      }
      if (route === "/badkamer-eeklo/") {
        const blob = collected.json.join("\n");
        if (!blob.includes("https://nieuwevloer.be/badkamer-eeklo/")) {
          failures.push("town json-ld missing the page url");
        }
        if (blob.includes("/diensten/badkamer-eeklo") || blob.includes("nieuwevloer.be/regio\"")) {
          failures.push("town json-ld still points at a redirect");
        }
      }
      console.log(`PASS crawl ${route} (${collected.hrefs.length} hrefs)`);
    }
  } finally {
    await browser.close();
    try {
      process.kill(-server.pid, "SIGKILL");
    } catch {
      server.kill("SIGKILL");
    }
  }

  if (failures.length) {
    throw new Error(`internal link offenses:\n${failures.join("\n")}`);
  }
  console.log("VERIFY_SEO_LINKS_OK");
  process.exit(0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exit(1);
});
