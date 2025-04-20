
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { formatWallType } from "./utils.ts";
import { buildCustomerEmail, buildAdminNotificationEmail } from "./templates/index.ts";
import type { EmailData, EmailResponse } from "./templates/types.ts";

// Get the API key from environment variables
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Verify API key is present
if (!RESEND_API_KEY) {
  console.error("[EDGE] CRITICAL ERROR: RESEND_API_KEY is missing. Cannot send emails.");
}

// Initialize Resend
const resend = new Resend(RESEND_API_KEY);

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Main handler for the Deno edge function
const handler = async (req: Request): Promise<Response> => {
  console.log("[EDGE] Send-confirmation handler called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("[EDGE] Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const body = await req.json();
    console.log("[EDGE] Received request body:", JSON.stringify(body, null, 2));
    console.log("[EDGE] API Key present:", RESEND_API_KEY ? "YES" : "NO");

    // Check if this is a test email
    const isTest = body.isTest === true;

    // Log the project type to help with debugging
    console.log("[EDGE] Project type from request:", body.projectType);
    
    // Specifically log if we're processing a quick_calculator request
    if (body.projectType === "quick_calculator") {
      console.log("[EDGE] Processing QUICK CALCULATOR request! This is the one we need to debug");
    }

    // Prepare email data
    const emailData: EmailData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      projectType: body.projectType || "Tegelproject",
      totalPrice: body.totalPrice || 0,
      squareMeters: body.squareMeters,
      floorType: body.floorType,
      tileSize: body.tileSize,
      needsPlinths: body.needsPlinths,
      wallType: await formatWallType(body.wallType),
      wallTileSize: body.wallTileSize,
      bathroomOptions: body.bathroomOptions,
      bathroomTileSize: body.bathroomTileSize,
      otherDescription: body.otherDescription,
      needsChape: body.needsChape,
      needsElectrician: body.needsElectrician,
      additionalNotes: body.additionalNotes,
      wantsSiteVisit: body.wantsSiteVisit,
      wantsShowroomVisit: body.wantsShowroomVisit,
      addressStreet: body.addressStreet,
      addressCity: body.addressCity,
      showerNis: body.showerNis,
      showerNisSize: body.showerNisSize,
      showerNisCustomSize: body.showerNisCustomSize,
      fullBathroomRenovation: body.fullBathroomRenovation,
      wantsToBuyTiles: body.wantsToBuyTiles,
      tilePricePerSqm: body.tilePricePerSqm,
      squareMetersWithCuttingLoss: body.squareMetersWithCuttingLoss,
      tileCost: body.tileCost,
      imageUrl: body.imageUrl,
      selectedInspirationStyle: body.selectedInspirationStyle,
      selectedInspirationStyleTitle: body.selectedInspirationStyleTitle
    };

    console.log("[EDGE] Prepared email data:", JSON.stringify(emailData, null, 2));

    // Initialize response object
    const response: EmailResponse = {
      success: true,
      customerEmail: null,
      adminEmail: null,
    };

    // Check for quick calculator specifically
    const isQuickCalculator = emailData.projectType === "quick_calculator";
    console.log("[EDGE] Is quick calculator email:", isQuickCalculator);

    // Get subject line based on project type
    let subjectLine = isTest 
      ? "Test email van NieuweVloer.be" 
      : "Bevestiging van uw tegelproject bij NieuweVloer.be";
      
    if (isQuickCalculator) {
      subjectLine = isTest
        ? "Test prijsindicatie van NieuweVloer.be"
        : "Uw prijsindicatie bij NieuweVloer.be";
      
      console.log("[EDGE] Using quick calculator subject line:", subjectLine);
    }

    // Send email to customer
    try {
      const customerEmailHTML = buildCustomerEmail(emailData);
      
      console.log("[EDGE] About to send customer email with Resend...");
      console.log("[EDGE] Using RESEND_API_KEY:", RESEND_API_KEY ? "API key is set" : "API key is missing");
      console.log("[EDGE] Sending to customer email:", emailData.email);
      
      const customerEmailResult = await resend.emails.send({
        from: "NieuweVloer.be <noreply@nieuwevloer.be>",
        to: [emailData.email],
        subject: subjectLine,
        html: customerEmailHTML,
      });

      response.customerEmail = customerEmailResult;
      console.log("[EDGE] Customer email sent:", JSON.stringify(customerEmailResult, null, 2));
    } catch (customerEmailError) {
      console.error("[EDGE] Error sending customer email:", customerEmailError);
      response.customerEmail = { 
        success: false, 
        error: customerEmailError.message
      };
    }

    // Send notification email to admin
    try {
      const adminSubject = isTest 
        ? "[TEST] Nieuwe tegelaanvraag via configurator" 
        : isQuickCalculator 
          ? "Nieuwe snelle prijsindicatie aanvraag"
          : "Nieuwe tegelaanvraag via configurator";
          
      const adminEmailHTML = buildAdminNotificationEmail(emailData);
      
      console.log("[EDGE] About to send admin email with Resend...");
      console.log("[EDGE] Sending to admin email: info@nieuwevloer.be");
      
      const adminEmailResult = await resend.emails.send({
        from: "NieuweVloer.be <noreply@nieuwevloer.be>",
        to: ["info@nieuwevloer.be"],
        subject: adminSubject,
        html: adminEmailHTML,
      });

      response.adminEmail = adminEmailResult;
      console.log("[EDGE] Admin email sent:", JSON.stringify(adminEmailResult, null, 2));
    } catch (adminEmailError) {
      console.error("[EDGE] Error sending admin email:", adminEmailError);
      response.adminEmail = { 
        success: false,
        error: adminEmailError.message
      };
    }

    // Return success response even if one email failed
    response.success = !!(response.customerEmail?.data || response.adminEmail?.data);
    
    console.log("[EDGE] Final response:", JSON.stringify(response, null, 2));

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("[EDGE] Error in send-confirmation function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Unknown error",
        details: error 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
