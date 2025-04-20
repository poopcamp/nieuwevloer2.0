
import { supabase } from "@/integrations/supabase/client";

/**
 * Send recovery email using recovery code
 */
export const sendRecoveryEmail = async (recoveryCode: string) => {
  try {
    console.log("Checking recovery code:", recoveryCode);
    
    // Trim de herstelcode om spaties te verwijderen
    const cleanCode = recoveryCode.trim();
    
    // Eerst de exacte case-sensitive match proberen
    let { data, error } = await supabase
      .from("recovery_codes")
      .select("*")
      .eq("code", cleanCode)
      .maybeSingle();

    // Als dat niet werkt, probeer een case-insensitive match
    if (!data && !error) {
      console.log("Exact match niet gevonden, probeer case-insensitive match");
      
      // Haal alle recovery codes op en filter lokaal voor case-insensitive vergelijking
      const { data: allCodes, error: allCodesError } = await supabase
        .from("recovery_codes")
        .select("*");
        
      if (allCodesError) {
        console.error("Error bij ophalen van alle herstelcodes:", allCodesError);
        throw new Error("Fout bij het controleren van de herstelcode. Probeer het later opnieuw.");
      }
      
      // Zoek naar een case-insensitive match
      if (allCodes && allCodes.length > 0) {
        data = allCodes.find(
          (codeEntry) => codeEntry.code.toLowerCase() === cleanCode.toLowerCase()
        );
        
        // Als we een match vinden, output het voor debugging
        if (data) {
          console.log("Case-insensitive match gevonden:", data.code);
        }
      }
    }

    if (error) {
      console.error("Recovery code lookup error:", error);
      throw new Error("Fout bij het controleren van de herstelcode. Probeer het later opnieuw.");
    }

    if (!data) {
      console.error("No recovery code found matching:", cleanCode);
      throw new Error("Ongeldige herstelcode. Controleer of u de code correct heeft ingevoerd.");
    }

    console.log("Recovery code found for email:", data.admin_email);
    
    // Check if the admin_email field is present and valid
    if (!data.admin_email || !data.admin_email.includes('@')) {
      console.error("Invalid email in recovery code:", data.admin_email);
      throw new Error("De herstelcode bevat een ongeldig e-mailadres. Neem contact op met de beheerder.");
    }

    // Send password reset email
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      data.admin_email
    );

    if (resetError) {
      console.error("Password reset error:", resetError);
      throw new Error("Fout bij het versturen van de herstelmail: " + resetError.message);
    }

    return { success: true, email: data.admin_email };
  } catch (error: any) {
    console.error("Recovery email error:", error);
    throw error;
  }
};

/**
 * Update the user's password after a reset
 */
export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw error;
  }

  return { success: true };
};
