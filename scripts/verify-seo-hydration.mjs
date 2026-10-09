/**
 * Loads the built pages and checks that hydration keeps the static head.
 * A deliberate client overwrite ("… | NIEUWEVLOER.BE", canonical without /)
 * must be restored.
 *
 * Usage: node scripts/verify-seo-hydration.mjs
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { staticHeadMatchesRoute } from "../src/seo/staticHead.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const port = 4180;
const origin = `http://127.0.0.1:${port}`;

const ROUTES = [
  "/tegelzetter-brugge/",
  "/badkamer-eeklo/",
  "/diensten/vloeren/",
  "/blog/vorstschade-buitenvloer-voorkomen/",
];

function decode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function readStatic(routePath) {
  const rel = `${routePath.replace(/^\/|\/$/g, "")}/index.html`;
  const html = fs.readFileSync(path.join(distDir, rel), "utf8");
  const title = html.match(/<title>([^<]*)<\/title>/i);
  const description = html.match(
    /<meta\b[^>]*\bname=["']description["'][^>]*\bcontent=["']([^"']*)["']/i,
  );
  const canonical = html.match(
    /<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["']/i,
  );
  if (!title || !description || !canonical) {
    throw new Error(`static head missing in ${rel}`);
  }
  return {
    title: decode(title[1]),
    description: decode(description[1]),
    canonical: canonical[1],
  };
}

function unitTests() {
  const town = {
    path: "/badkamer-eeklo/",
    title: "Badkamerrenovatie Eeklo | Tegels & douche | NieuweVloer",
    description: "town",
    canonical: "https://nieuwevloer.be/badkamer-eeklo/",
  };
  if (staticHeadMatchesRoute(town, "/badkamer-eeklo") !== town) {
    throw new Error("slashless path should keep the static town head");
  }
  if (staticHeadMatchesRoute(town, "/diensten/vloeren/")) {
    throw new Error("a different route must not reuse the town head");
  }
  if (
    staticHeadMatchesRoute(
      { ...town, canonical: "https://nieuwevloer.be/" },
      "/badkamer-eeklo/",
    )
  ) {
    throw new Error("homepage shell must not lock a town route");
  }
  if (
    staticHeadMatchesRoute(
      { path: "/", title: "Home", description: "Home", canonical: "https://nieuwevloer.be/" },
      "/",
    )
  ) {
    throw new Error("homepage is not locked by this guard");
  }
  console.log("PASS static head match rules");
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

async function assertHead(page, expected, label) {
  await page.waitForFunction(
    (head) => {
      const links = [...document.querySelectorAll('link[rel="canonical"]')];
      const meta = document.querySelector('meta[name="description"]');
      return (
        document.title === head.title &&
        links.length === 1 &&
        links[0].getAttribute("href") === head.canonical &&
        meta &&
        meta.getAttribute("content") === head.description &&
        !document.title.includes("NIEUWEVLOER.BE")
      );
    },
    expected,
    { timeout: 15000 },
  );
  console.log(`PASS hydrate ${label}`);
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

  const expectedByRoute = Object.fromEntries(ROUTES.map((route) => [route, readStatic(route)]));
  for (const route of ROUTES) {
    const head = expectedByRoute[route];
    if (!head.canonical.endsWith("/")) throw new Error(`${route} static canonical has no slash`);
    if (head.title.includes("NIEUWEVLOER.BE")) {
      throw new Error(`${route} static title uses NIEUWEVLOER.BE`);
    }
  }

  const server = await waitForPreview();
  const browser = await chromium.launch({
    executablePath: "/usr/local/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
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

    for (const route of ROUTES) {
      const expected = expectedByRoute[route];
      await page.goto(`${origin}${route}`, { waitUntil: "domcontentloaded" });
      await assertHead(page, expected, route);

      await page.evaluate((current) => {
        document.title = `${current.split("/").filter(Boolean).pop()} | NIEUWEVLOER.BE`;
        const link = document.querySelector('link[rel="canonical"]');
        if (link) link.setAttribute("href", link.getAttribute("href").replace(/\/$/, ""));
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute("content", "Bel 0479 client overwrite");
      }, route);
      await assertHead(page, expected, `${route} after client overwrite`);
    }
  } finally {
    await browser.close();
    try {
      process.kill(-server.pid, "SIGKILL");
    } catch {
      server.kill("SIGKILL");
    }
  }
  console.log("VERIFY_SEO_HYDRATION_OK");
  process.exit(0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exit(1);
});
