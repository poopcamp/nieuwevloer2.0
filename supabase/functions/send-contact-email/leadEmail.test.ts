import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { mkdir, writeFile } from "node:fs/promises";
import test from "node:test";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer-core";
import { leadMailOptions, type LeadEmailInput } from "./leadEmail.ts";

const RECEIVED_AT = "2026-09-24T19:06:00.000Z";

const PHOTO = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#e7d7a1"/><text x="320" y="190" text-anchor="middle" font-family="Arial" font-size="28" fill="#1c1915">Foto terras</text></svg>',
);

const fixture: LeadEmailInput = {
  name: "Youssef El Moutanabi",
  email: "yous.emt@gmail.com",
  phone: "0472210687",
  project_type: "buiten",
  address: "Van Eycklaan 12, 9990 Maldegem",
  customer_message: "Graag een terras in keramische tegels, ongeveer 40 m².",
  photo_urls: [PHOTO],
  page_url: "https://nieuwevloer.be/project-aanvraag",
  received_at: RECEIVED_AT,
};

interface DecodedPart {
  contentType: string;
  encoding: string;
  body: string;
}

function headerMap(block: string): Record<string, string> {
  const headers: Record<string, string> = {};
  const unfolded = block.replace(/\n[ \t]+/g, " ");
  for (const line of unfolded.split("\n")) {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (!match) continue;
    headers[match[1].toLowerCase()] = match[2].trim();
  }
  return headers;
}

function splitHead(entity: string): { headers: Record<string, string>; body: string } {
  const separated = entity.replace(/^\n+/, "");
  const index = separated.indexOf("\n\n");
  if (index === -1) return { headers: headerMap(separated), body: "" };
  return {
    headers: headerMap(separated.slice(0, index)),
    body: separated.slice(index + 2),
  };
}

function decodeQuotedPrintable(input: string): string {
  const joined = input.replace(/=\n/g, "");
  const bytes: number[] = [];
  for (let i = 0; i < joined.length; i += 1) {
    if (joined[i] === "=" && /^[0-9A-Fa-f]{2}$/.test(joined.slice(i + 1, i + 3))) {
      bytes.push(Number.parseInt(joined.slice(i + 1, i + 3), 16));
      i += 2;
    } else {
      bytes.push(joined.charCodeAt(i) & 0xff);
    }
  }
  return Buffer.from(bytes).toString("utf8");
}

function decodePart(headers: Record<string, string>, body: string): string {
  const encoding = (headers["content-transfer-encoding"] || "7bit").toLowerCase();
  const payload = body.replace(/\n$/, "");
  if (encoding === "base64") {
    return Buffer.from(payload.replace(/\s+/g, ""), "base64").toString("utf8");
  }
  if (encoding === "quoted-printable") return decodeQuotedPrintable(payload);
  return payload;
}

function walk(headers: Record<string, string>, body: string, parts: DecodedPart[]): void {
  const contentType = headers["content-type"] || "text/plain";
  const boundary = contentType.match(/boundary="?([^";]+)"?/i)?.[1];
  if (boundary) {
    for (const chunk of body.split(`--${boundary}`).slice(1)) {
      if (chunk.startsWith("--") || chunk.trim() === "--" || !chunk.trim()) continue;
      const parsed = splitHead(chunk.replace(/\n--\s*$/, ""));
      walk(parsed.headers, parsed.body, parts);
    }
    return;
  }
  if (!contentType.includes("text/plain") && !contentType.includes("text/html")) return;
  parts.push({
    contentType,
    encoding: (headers["content-transfer-encoding"] || "").toLowerCase(),
    body: decodePart(headers, body),
  });
}

function decodeMime(raw: string): DecodedPart[] {
  const normalized = raw.replace(/\r\n/g, "\n");
  const top = splitHead(normalized);
  const parts: DecodedPart[] = [];
  walk(top.headers, top.body, parts);
  return parts;
}

async function renderRaw(input: LeadEmailInput): Promise<string> {
  const transporter = nodemailer.createTransport({
    streamTransport: true,
    buffer: true,
  });
  const info = await transporter.sendMail(leadMailOptions(input, { now: new Date(RECEIVED_AT) }));
  return Buffer.from(info.message as Buffer).toString("utf8");
}

test("lead notification MIME decodes without quoted-printable artefacts", async () => {
  const raw = await renderRaw(fixture);
  const parts = decodeMime(raw);
  const html = parts.find((part) => part.contentType.includes("text/html"));
  const text = parts.find((part) => part.contentType.includes("text/plain"));

  assert.ok(html, "MIME bevat een text/html deel");
  assert.ok(text, "MIME bevat een text/plain alternatief");
  assert.match(raw, /multipart\/alternative/i);
  assert.match(raw, /charset=utf-8/i);
  assert.equal(html.encoding, "base64");
  assert.equal(text.encoding, "base64");
  assert.equal(parts.some((part) => part.encoding === "quoted-printable"), false);

  for (const part of [html, text]) {
    assert.equal(part.body.includes("=20"), false, `${part.contentType} bevat =20 na decode`);
  }

  assert.match(html.body, /NieuweVloer/);
  assert.doesNotMatch(html.body, /NieuwTerras/);
  assert.match(html.body, /Youssef El Moutanabi/);
  assert.match(html.body, /Buiten · Maldegem/);
  assert.match(html.body, /Bel klant/);
  assert.match(html.body, /href="tel:\+32472210687"/);
  assert.match(html.body, /href="https:\/\/wa\.me\/32472210687\?text=/);
  assert.match(html.body, /WhatsApp/);
  assert.match(html.body, /href="mailto:yous\.emt@gmail\.com"/);
  assert.match(html.body, /Mail klant/);
  assert.match(html.body, /Contactgegevens/);
  assert.match(html.body, /Projectdetails/);
  assert.match(html.body, /Open in Google Maps/);
  assert.match(html.body, /google\.com\/maps\/search/);
  assert.match(html.body, /40 m²/);
  assert.match(html.body, /Foto 1 bekijken/);
  assert.match(html.body, /24 september 2026/);
  assert.match(html.body, /21:06/);
  assert.match(text.body, /Bel klant: tel:\+32472210687/);
  assert.match(text.body, /40 m²/);
  assert.match(raw, /Reply-To: yous\.emt@gmail\.com/i);

  const nt = await renderRaw({
    ...fixture,
    brand: "nt",
    project_type: "terras",
    region: "Gent",
    address: "Kerkstraat 4, 9000 Gent",
  });
  const ntHtml = decodeMime(nt).find((part) => part.contentType.includes("text/html"));
  assert.ok(ntHtml);
  assert.equal(ntHtml.body.includes("=20"), false);
  assert.match(ntHtml.body, /NieuwTerras/);
  assert.match(ntHtml.body, /Gent/);
  assert.match(nt, /From: NieuwTerras </);
});

test("renders a 390px mobile preview of the lead email", async () => {
  const { html } = leadMailOptions(fixture, { now: new Date(RECEIVED_AT) });
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || "/usr/local/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 800, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: "networkidle0" });
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.setViewport({ width: 390, height: Math.max(height, 800), deviceScaleFactor: 1 });
    const png = await page.screenshot({ type: "png", fullPage: true });
    const dir = process.env.LEAD_EMAIL_PREVIEW_DIR || "/opt/cursor/artifacts";
    await mkdir(dir, { recursive: true });
    const path = `${dir}/lead-email-preview.png`;
    await writeFile(path, png);
    assert.ok(png.byteLength > 10_000);
  } finally {
    await browser.close();
  }
});
