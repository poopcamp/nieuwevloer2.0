import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.10.1";
import {
  DEFAULT_FROM_ADDRESS,
  DEFAULT_NOTIFY_TO,
  leadMailOptions,
  type LeadEmailInput,
} from "./leadEmail.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function envFirst(...names: string[]): string {
  for (const name of names) {
    const value = Deno.env.get(name);
    if (value && value.trim()) return value.trim();
  }
  return "";
}

function createTransport() {
  const host = envFirst("SMTP_HOST", "SMTP_HOSTNAME");
  const pass = envFirst("SMTP_PASS", "SMTP_PASSWORD", "RESEND_API_KEY");
  const resolvedHost = host || (pass ? "smtp.resend.com" : "");
  if (!resolvedHost || !pass) {
    throw new Error("SMTP is niet geconfigureerd. Zet SMTP_HOST en SMTP_PASS, of RESEND_API_KEY.");
  }
  const port = Number(envFirst("SMTP_PORT") || (resolvedHost === "smtp.resend.com" ? "465" : "587"));
  const secureFlag = envFirst("SMTP_SECURE");
  const secure = secureFlag ? secureFlag !== "false" : port === 465;
  const user = envFirst("SMTP_USER", "SMTP_USERNAME") || (resolvedHost === "smtp.resend.com" ? "resend" : "");
  if (!user) throw new Error("SMTP_USER ontbreekt.");

  return nodemailer.createTransport({
    host: resolvedHost,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  });
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ success: false, error: "Alleen POST." }, 405);

  try {
    const body = await req.json() as LeadEmailInput;
    const name = body?.name?.trim() || "";
    const phone = body?.phone?.trim() || "";
    if (!name || !phone) {
      return json({ success: false, error: "Naam en telefoon zijn verplicht." }, 400);
    }

    const fromAddress = envFirst("SMTP_FROM", "NOTIFY_FROM") || DEFAULT_FROM_ADDRESS;
    const to = envFirst("NOTIFY_TO") || DEFAULT_NOTIFY_TO;
    const mail = leadMailOptions(body, { to, fromAddress });
    const leadEventId = crypto.randomUUID();

    await createTransport().sendMail(mail);
    console.log("[send-contact-email] verzonden", {
      project_type: body.project_type || "",
      brand: body.brand || "",
      lead_event_id: leadEventId,
    });

    return json({ success: true, lead_event_id: leadEventId }, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onbekende fout";
    console.error("[send-contact-email] fout", message);
    return json({ success: false, error: message }, 500);
  }
});
