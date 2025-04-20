
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import * as types from "./types.ts";
import {
  buildCustomerEmail,
  buildAdminEmail
} from "./templates.ts";

// Haal de API key op uit de omgeving
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Controleer of RESEND_API_KEY aanwezig is
if (!RESEND_API_KEY) {
  console.error("Kritieke fout: RESEND_API_KEY ontbreekt in de edge function");
}

const resend = new Resend(RESEND_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

async function sendEmail(options: types.SendEmailOptions, retryCount = 0): Promise<types.EmailResponse> {
  try {
    console.log(`[MAIL] Versturen van e-mail poging ${retryCount + 1}: `, JSON.stringify({
      from: options.from,
      to: options.to,
      subject: options.subject,
    }));
    
    const response = await resend.emails.send(options);
    
    console.log(`[MAIL] E-mail verzonden. Response:`, JSON.stringify(response));
    return { data: response.data, error: null };
  } catch (error: any) {
    console.error(`[MAIL] Fout bij verzenden e-mail (poging ${retryCount + 1}):`, error);
    console.error(`[MAIL] Foutdetails:`, JSON.stringify({
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
    }));
    
    // Rate limit bereikt - wachten en opnieuw proberen
    if (error.statusCode === 429 && retryCount < 3) {
      console.log(`[MAIL] Rate limit bereikt. Opnieuw proberen (${retryCount + 1}/3)...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
      return sendEmail(options, retryCount + 1);
    }
    
    // Probeer met generieke afzender als domein niet geverifieerd is
    if (error.statusCode === 403 && error.message && 
        error.message.includes("domain is not verified") && retryCount === 0) {
      console.log("[MAIL] Domein niet geverifieerd, proberen met generieke afzender...");
      options.from = "NieuweVloer <onboarding@resend.dev>";
      return sendEmail(options, retryCount + 1);
    }
    
    return { data: null, error };
  }
}

const handler = async (req: Request): Promise<Response> => {
  console.log("[FUNCTIE] Nieuwe aanvraag ontvangen", req.method);
  
  // CORS preflight verzoeken afhandelen
  if (req.method === "OPTIONS") {
    console.log("[FUNCTIE] CORS preflight verzoek afhandelen");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Controleer of de API key aanwezig is
    if (!RESEND_API_KEY) {
      throw new Error("Resend API key is niet geconfigureerd");
    }
    
    // Haal de request body op en log deze
    const requestText = await req.text();
    console.log("[FUNCTIE] Ontvangen data (raw):", requestText);
    
    let data: types.ExtendedCalculatorSubmission;
    try {
      data = JSON.parse(requestText);
      console.log("[FUNCTIE] Geparseerde data:", JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("[FUNCTIE] Kon JSON niet parsen:", e);
      throw new Error("Ongeldig JSON formaat in verzoek");
    }

    // Valideer vereiste velden
    if (!data.email || !data.name || !data.phone) {
      throw new Error("Ontbrekende verplichte velden: naam, e-mail of telefoon");
    }

    // E-mailadres validatie
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error(`Ongeldig e-mailadres formaat: ${data.email}`);
    }

    // Controleer adresgegevens indien plaatsbezoek gewenst is
    if (data.wantsSiteVisit && (!data.addressStreet || !data.addressCity)) {
      console.warn("[FUNCTIE] Plaatsbezoek gewenst maar adresgegevens ontbreken");
    }

    console.log("[FUNCTIE] Alle validaties geslaagd, begin met e-mails versturen");

    // Stuur klant e-mail
    console.log("[FUNCTIE] Versturen van e-mail naar klant:", data.email);
    const customerEmailPromise = sendEmail({
      from: "NieuweVloer.be <info@nieuwevloer.be>",
      to: [data.email],
      subject: "Uw tegelconfiguratie bij NieuweVloer.be",
      html: buildCustomerEmail(data),
    });

    // Stuur admin e-mail
    console.log("[FUNCTIE] Versturen van e-mail naar admin");
    const adminEmailPromise = sendEmail({
      from: "Website Configurator <info@nieuwevloer.be>",
      to: ["info@nieuwevloer.be"],
      subject: `Nieuwe configuratie aanvraag van ${data.name}`,
      html: buildAdminEmail(data),
      reply_to: data.email,
    });

    // Wacht op beide e-mails
    const [customerEmailResult, adminEmailResult] = await Promise.all([
      customerEmailPromise,
      adminEmailPromise,
    ]);

    // Controleer resultaten
    const success = !customerEmailResult.error && !adminEmailResult.error;
    
    console.log("[FUNCTIE] E-mail resultaten:", {
      customer: customerEmailResult.error ? "FOUT" : "OK",
      admin: adminEmailResult.error ? "FOUT" : "OK"
    });

    return new Response(
      JSON.stringify({
        success,
        customerEmail: customerEmailResult,
        adminEmail: adminEmailResult,
        message: success 
          ? "E-mails succesvol verzonden" 
          : "Fout bij het versturen van één of meer e-mails",
      }),
      {
        status: success ? 200 : 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("[FUNCTIE] Fout in send-extended-calculator-confirmation functie:", error);
    console.error("[FUNCTIE] Stack trace:", error.stack);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Onbekende fout",
        detail: error.stack || "Geen details beschikbaar",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
