/**
 * Admin notification for project-aanvraag and contact form submissions.
 * HTML is table-based and free of hand-written quoted-printable encoding.
 * The edge function and the Node test both send these options through
 * nodemailer with textEncoding "base64".
 */

export const LEAD_TEXT_ENCODING = "base64" as const;

export const DEFAULT_NOTIFY_TO = "info@nieuwevloer.be";
export const DEFAULT_FROM_ADDRESS = "noreply@nieuwevloer.be";

export interface LeadEmailInput {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  project_type?: string | null;
  work_type?: string | null;
  surface_range?: string | null;
  timeline?: string | null;
  address?: string | null;
  region?: string | null;
  gemeente?: string | null;
  city?: string | null;
  customer_message?: string | null;
  message?: string | null;
  photo_urls?: Array<string | null> | null;
  promo_active?: boolean | null;
  promo_code?: string | null;
  promo_discount?: string | number | null;
  exit_popup?: boolean | null;
  exit_code?: string | null;
  exit_discount?: string | number | null;
  page_url?: string | null;
  brand?: string | null;
  source?: string | null;
  created_at?: string | null;
  received_at?: string | null;
}

export interface LeadMailOptions {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
  textEncoding: typeof LEAD_TEXT_ENCODING;
}

interface BrandTheme {
  id: "nv" | "nt";
  name: "NieuweVloer" | "NieuwTerras";
  domain: string;
  page: string;
  header: string;
  accent: string;
  accentInk: string;
}

const PROJECT_TYPES: Record<string, string> = {
  buiten: "Buiten",
  binnen: "Binnen",
  totaal: "Totaalproject",
  weet_niet: "Nog te bepalen",
};

const WORK_TYPES: Record<string, string> = {
  terras: "Terras",
  oprit: "Oprit",
  tuinwerken: "Tuinwerken",
  platines: "Platines",
  waterdoorlatende_bestrating: "Waterdoorlatende bestrating",
  badkamer: "Badkamer",
  vloeren: "Vloeren",
  keramische_tegels: "Keramische tegels",
  renovatie: "Renovatie",
  nieuwbouw: "Nieuwbouw",
  combinatie: "Combinatie binnen en buiten",
  andere: "Andere / nog te bepalen",
};

const SURFACES: Record<string, string> = {
  lt_20: "Minder dan 20 m²",
  "20_50": "20 – 50 m²",
  "50_100": "50 – 100 m²",
  "100_200": "100 – 200 m²",
  gt_200: "Meer dan 200 m²",
  onbekend: "Weet ik nog niet",
};

const TIMELINES: Record<string, string> = {
  asap: "Zo snel mogelijk",
  "1_3_maanden": "Binnen 1 – 3 maanden",
  "3_6_maanden": "Binnen 3 – 6 maanden",
  later_dit_jaar: "Later dit jaar",
  orienterend: "Nog oriënterend",
};

const THEMES: Record<BrandTheme["id"], BrandTheme> = {
  nv: {
    id: "nv",
    name: "NieuweVloer",
    domain: "nieuwevloer.be",
    page: "#f4f1ea",
    header: "#1c1915",
    accent: "#e2b340",
    accentInk: "#8d6e2f",
  },
  nt: {
    id: "nt",
    name: "NieuwTerras",
    domain: "nieuwterras.be",
    page: "#f6f3ee",
    header: "#2c2824",
    accent: "#c6a36a",
    accentInk: "#7a6240",
  },
};

export function isNieuwTerrasLead(input: LeadEmailInput): boolean {
  const brand = (input.brand || "").trim().toLowerCase();
  if (brand === "nt" || brand === "nieuwterras") return true;
  return /nieuwterras/i.test(`${input.source || ""} ${input.page_url || ""}`);
}

export function labelOf(map: Record<string, string>, value?: string | null): string {
  const key = (value || "").trim();
  if (!key) return "";
  if (map[key]) return map[key];
  return key.replace(/[_-]+/g, " ").replace(/^\w/, (char) => char.toUpperCase());
}

export function regionFromAddress(address?: string | null): string {
  const trimmed = (address || "").trim();
  if (!trimmed || /te bespreken/i.test(trimmed)) return "";
  const parts = trimmed.split(",").map((part) => part.trim()).filter(Boolean);
  const candidate = parts.length > 1 ? parts[parts.length - 1] : trimmed;
  const withoutPostal = candidate.replace(/^\d{4}\s+/, "").trim();
  if (!withoutPostal || withoutPostal === trimmed && parts.length < 2) {
    if (parts.length < 2) return "";
  }
  if (/^\d+$/.test(withoutPostal)) return "";
  return withoutPostal;
}

export function normalizePhone(phone?: string | null): { display: string; e164: string; wa: string } | null {
  const raw = (phone || "").trim();
  if (!raw) return null;
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0032")) digits = digits.slice(2);
  if (!digits.startsWith("32") && digits.startsWith("0")) digits = `32${digits.slice(1)}`;
  if (!digits.startsWith("32")) digits = `32${digits}`;
  const national = `0${digits.slice(2)}`;
  const display = national.length === 10
    ? `${national.slice(0, 4)} ${national.slice(4, 6)} ${national.slice(6, 8)} ${national.slice(8)}`
    : raw;
  return { display, e164: `+${digits}`, wa: digits };
}

function validEmail(email?: string | null): string {
  const value = (email || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "";
  return value;
}

function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function safeHttpUrl(value?: string | null): string {
  const url = (value || "").trim();
  if (/^https?:\/\//i.test(url)) return url;
  if (/^data:image\/[a-z0-9.+-]+[;,]/i.test(url)) return url;
  return "";
}

function formatReceivedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("nl-BE", {
    timeZone: "Europe/Brussels",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function discountLabel(value?: string | number | null): string {
  if (value === null || value === undefined || value === "") return "";
  return String(value);
}

interface PreparedLead {
  theme: BrandTheme;
  name: string;
  email: string;
  phone: ReturnType<typeof normalizePhone>;
  projectLabel: string;
  workLabel: string;
  surfaceLabel: string;
  timelineLabel: string;
  region: string;
  address: string;
  mapsUrl: string;
  message: string;
  photos: string[];
  promo: string;
  page: string;
  receivedLabel: string;
  receivedIso: string;
}

function prepare(input: LeadEmailInput, now: Date): PreparedLead {
  const theme = THEMES[isNieuwTerrasLead(input) ? "nt" : "nv"];
  const address = (input.address || "").trim();
  const placeholderAddress = /te bespreken/i.test(address);
  const region = (input.region || input.gemeente || input.city || "").trim()
    || regionFromAddress(address);
  const phone = normalizePhone(input.phone);
  const promoCode = (input.promo_code || input.exit_code || "").trim();
  const promoDiscount = discountLabel(input.promo_discount || input.exit_discount);
  const promo = promoCode
    ? [promoCode, promoDiscount].filter(Boolean).join(" · ")
    : "";
  const receivedIso = input.received_at || input.created_at || now.toISOString();
  let page = "";
  if (input.page_url) {
    try {
      const url = new URL(input.page_url);
      page = `${url.hostname}${url.pathname}`;
    } catch {
      page = "";
    }
  }
  return {
    theme,
    name: (input.name || "").trim() || "Onbekend",
    email: validEmail(input.email),
    phone,
    projectLabel: labelOf(PROJECT_TYPES, input.project_type) || "Project",
    workLabel: labelOf(WORK_TYPES, input.work_type),
    surfaceLabel: labelOf(SURFACES, input.surface_range),
    timelineLabel: labelOf(TIMELINES, input.timeline),
    region,
    address: placeholderAddress ? "" : address,
    mapsUrl: !placeholderAddress && address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : "",
    message: (input.customer_message || input.message || "").trim(),
    photos: (Array.isArray(input.photo_urls) ? input.photo_urls : [])
      .map((url) => safeHttpUrl(url))
      .filter(Boolean)
      .slice(0, 8),
    promo,
    page,
    receivedLabel: formatReceivedAt(receivedIso),
    receivedIso,
  };
}

function detailRows(rows: Array<{ label: string; value: string; href?: string }>): string {
  const visible = rows.filter((row) => row.value.trim());
  if (!visible.length) return "";
  return visible.map((row) => {
    const value = row.href
      ? `<a href="${escapeAttr(row.href)}" style="color:#1c1915;text-decoration:underline;">${escapeHtml(row.value)}</a>`
      : escapeHtml(row.value);
    return [
      "<tr>",
      `<td valign="top" width="112" style="padding:7px 12px 7px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:18px;color:#6f685f;">${escapeHtml(row.label)}</td>`,
      `<td valign="top" style="padding:7px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:21px;color:#1c1915;font-weight:700;">${value}</td>`,
      "</tr>",
    ].join("");
  }).join("");
}

function card(title: string, inner: string, accent: string): string {
  if (!inner.trim()) return "";
  return [
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">',
    "<tr><td height=\"12\" style=\"font-size:0;line-height:0;\">&nbsp;</td></tr>",
    "<tr>",
    '<td bgcolor="#ffffff" style="padding:18px 20px;border:1px solid #e6e0d4;border-radius:10px;">',
    `<p style="margin:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${accent};">${escapeHtml(title)}</p>`,
    inner,
    "</td>",
    "</tr>",
    "</table>",
  ].join("");
}

function actionButton(href: string, label: string, bg: string): string {
  return [
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">',
    "<tr><td height=\"10\" style=\"font-size:0;line-height:0;\">&nbsp;</td></tr>",
    "<tr>",
    `<td align="center" bgcolor="${bg}" style="border-radius:8px;">`,
    `<a href="${escapeAttr(href)}" style="display:block;padding:16px 12px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:20px;font-weight:700;color:#ffffff;text-decoration:none;text-align:center;">${escapeHtml(label)}</a>`,
    "</td>",
    "</tr>",
    "</table>",
  ].join("");
}

function renderHtml(lead: PreparedLead): string {
  const headline = [lead.projectLabel, lead.region].filter(Boolean).join(" · ");
  const rowsContact = detailRows([
    { label: "Naam", value: lead.name },
    lead.phone
      ? { label: "Telefoon", value: lead.phone.display, href: `tel:${lead.phone.e164}` }
      : { label: "Telefoon", value: "" },
    lead.email
      ? { label: "E-mail", value: lead.email, href: `mailto:${lead.email}` }
      : { label: "E-mail", value: "" },
  ]);
  const rowsProject = detailRows([
    { label: "Projecttype", value: lead.projectLabel },
    { label: "Regio", value: lead.region },
    { label: "Specialisatie", value: lead.workLabel },
    { label: "Oppervlakte", value: lead.surfaceLabel },
    { label: "Planning", value: lead.timelineLabel },
    { label: "Korting", value: lead.promo },
    { label: "Pagina", value: lead.page },
  ]);
  const addressInner = lead.address
    ? [
      `<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:23px;color:#1c1915;font-weight:700;">${escapeHtml(lead.address)}</p>`,
      lead.mapsUrl ? actionButton(lead.mapsUrl, "Open in Google Maps", lead.theme.header) : "",
    ].join("")
    : "";
  const messageInner = lead.message
    ? `<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#1c1915;white-space:pre-wrap;">${escapeHtml(lead.message)}</p>`
    : "";
  const photosInner = lead.photos.map((url, index) => [
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">',
    index === 0 ? "" : '<tr><td height="12" style="font-size:0;line-height:0;">&nbsp;</td></tr>',
    "<tr>",
    "<td>",
    `<a href="${escapeAttr(url)}" style="text-decoration:none;">`,
    `<img src="${escapeAttr(url)}" alt="Foto ${index + 1} van de aanvraag" width="520" style="display:block;width:100%;max-width:520px;height:auto;border:0;border-radius:8px;background:#f4f1ea;">`,
    "</a>",
    "</td>",
    "</tr>",
    "<tr>",
    `<td style="padding-top:6px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:18px;">`,
    `<a href="${escapeAttr(url)}" style="color:${lead.theme.accentInk};text-decoration:underline;">Foto ${index + 1} bekijken</a>`,
    "</td>",
    "</tr>",
    "</table>",
  ].join("")).join("");

  const whatsappText = encodeURIComponent(
    `Dag, wij contacteren u over uw aanvraag bij ${lead.theme.name}.`,
  );
  const buttons = [
    lead.phone ? actionButton(`tel:${lead.phone.e164}`, "Bel klant", lead.theme.header) : "",
    lead.phone ? actionButton(`https://wa.me/${lead.phone.wa}?text=${whatsappText}`, "WhatsApp", "#1f6b45") : "",
    lead.email ? actionButton(`mailto:${lead.email}`, "Mail klant", lead.theme.accentInk) : "",
  ].join("");

  const preheader = `Nieuwe lead van ${lead.name}. ${headline}.`;

  const html = [
    "<!DOCTYPE html>",
    '<html lang="nl">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    `<title>Nieuwe lead — ${escapeHtml(lead.theme.name)}</title>`,
    "</head>",
    `<body style="margin:0;padding:0;background:${lead.theme.page};">`,
    `<div style="display:none;font-size:1px;color:${lead.theme.page};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}</div>`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${lead.theme.page}" style="background:${lead.theme.page};">`,
    "<tr>",
    '<td align="center" style="padding:16px 12px 28px 12px;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">',
    "<tr>",
    `<td bgcolor="${lead.theme.accent}" height="4" style="font-size:0;line-height:0;border-radius:12px 12px 0 0;">&nbsp;</td>`,
    "</tr>",
    "<tr>",
    `<td bgcolor="${lead.theme.header}" style="padding:26px 22px 22px 22px;">`,
    `<p style="margin:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${lead.theme.accent};">${escapeHtml(lead.theme.name)}</p>`,
    '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:32px;font-weight:700;color:#ffffff;">Nieuwe lead</p>',
    `<p style="margin:10px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:22px;color:${lead.theme.accent};">${escapeHtml(headline)}</p>`,
    "</td>",
    "</tr>",
    "<tr>",
    '<td bgcolor="#ffffff" style="padding:8px 16px 18px 16px;border-left:1px solid #e6e0d4;border-right:1px solid #e6e0d4;">',
    buttons,
    "</td>",
    "</tr>",
    "<tr>",
    '<td style="border-left:1px solid #e6e0d4;border-right:1px solid #e6e0d4;background:#fbfaf7;padding:4px 12px 8px 12px;">',
    card("Contactgegevens", `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rowsContact}</table>`, lead.theme.accentInk),
    card("Projectdetails", `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rowsProject}</table>`, lead.theme.accentInk),
    card("Adres", addressInner, lead.theme.accentInk),
    card("Bericht", messageInner, lead.theme.accentInk),
    card("Foto's", photosInner, lead.theme.accentInk),
    "</td>",
    "</tr>",
    "<tr>",
    `<td bgcolor="${lead.theme.header}" style="padding:18px 22px 20px 22px;border-radius:0 0 12px 12px;">`,
    `<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:19px;color:#f4f1ea;">Ontvangen op ${escapeHtml(lead.receivedLabel)}</p>`,
    '<p style="margin:6px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#cfc6b8;">Antwoord op deze mail gaat naar de klant.</p>',
    `<p style="margin:10px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:${lead.theme.accent};">${escapeHtml(lead.theme.name)} · ${escapeHtml(lead.theme.domain)}</p>`,
    "</td>",
    "</tr>",
    "</table>",
    "</td>",
    "</tr>",
    "</table>",
    "</body>",
    "</html>",
  ].join("\n");

  return html.split("\n").map((line) => line.trimEnd()).join("\n").trim() + "\n";
}

function renderText(lead: PreparedLead): string {
  const lines = [
    `Nieuwe lead — ${lead.theme.name}`,
    [lead.projectLabel, lead.region].filter(Boolean).join(" · "),
    "",
  ];
  if (lead.phone) {
    lines.push(`Bel klant: tel:${lead.phone.e164}`);
    lines.push(`WhatsApp: https://wa.me/${lead.phone.wa}`);
  }
  if (lead.email) lines.push(`Mail klant: mailto:${lead.email}`);
  lines.push("", "Contactgegevens", `Naam: ${lead.name}`);
  if (lead.phone) lines.push(`Telefoon: ${lead.phone.display}`);
  if (lead.email) lines.push(`E-mail: ${lead.email}`);
  lines.push("", "Projectdetails", `Projecttype: ${lead.projectLabel}`);
  if (lead.region) lines.push(`Regio: ${lead.region}`);
  if (lead.workLabel) lines.push(`Specialisatie: ${lead.workLabel}`);
  if (lead.surfaceLabel) lines.push(`Oppervlakte: ${lead.surfaceLabel}`);
  if (lead.timelineLabel) lines.push(`Planning: ${lead.timelineLabel}`);
  if (lead.promo) lines.push(`Korting: ${lead.promo}`);
  if (lead.page) lines.push(`Pagina: ${lead.page}`);
  if (lead.address) {
    lines.push("", "Adres", lead.address);
    if (lead.mapsUrl) lines.push(`Google Maps: ${lead.mapsUrl}`);
  }
  if (lead.message) lines.push("", "Bericht", lead.message);
  if (lead.photos.length) {
    lines.push("", "Foto's");
    lead.photos.forEach((url, index) => lines.push(`${index + 1}. ${url}`));
  }
  lines.push("", `Ontvangen op ${lead.receivedLabel}`, `${lead.theme.name} · ${lead.theme.domain}`, "");
  return lines.join("\n");
}

export function leadMailOptions(
  input: LeadEmailInput,
  env: { to?: string; fromAddress?: string; now?: Date } = {},
): LeadMailOptions {
  const now = env.now ?? new Date();
  const lead = prepare(input, now);
  const fromAddress = headerSafe(env.fromAddress || DEFAULT_FROM_ADDRESS);
  const to = headerSafe(env.to || DEFAULT_NOTIFY_TO);
  const headline = [lead.projectLabel, lead.region].filter(Boolean).join(", ");
  const subject = headerSafe(`Nieuwe lead: ${headline} — ${lead.name}`);
  const options: LeadMailOptions = {
    from: headerSafe(`${lead.theme.name} <${fromAddress}>`),
    to,
    subject,
    text: renderText(lead),
    html: renderHtml(lead),
    textEncoding: LEAD_TEXT_ENCODING,
  };
  if (lead.email) options.replyTo = headerSafe(lead.email);
  return options;
}
