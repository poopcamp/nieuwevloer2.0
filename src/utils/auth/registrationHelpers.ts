
import { supabase } from "@/integrations/supabase/client";

/**
 * Register a new user using a recovery code
 */
export const registerWithRecoveryCode = async (
  recoveryCode: string,
  email: string,
  password: string
) => {
  try {
    console.log("Registering with recovery code:", recoveryCode);
    
    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();
    const trimmedCode = recoveryCode.trim();
    
    // First, verify the recovery code
    const { data: codeData, error: codeError } = await supabase
      .from("recovery_codes")
      .select("admin_email")
      .eq("code", trimmedCode)
      .maybeSingle();

    if (codeError) {
      console.error("Error verifying recovery code:", codeError);
      throw new Error("Fout bij verificatie van herstelcode: " + codeError.message);
    }

    // If no match, try case-insensitive match
    if (!codeData) {
      console.log("Trying case-insensitive match for recovery code");
      
      const { data: allCodes, error: allCodesError } = await supabase
        .from("recovery_codes")
        .select("admin_email, code");
        
      if (allCodesError) {
        console.error("Error retrieving recovery codes:", allCodesError);
        throw new Error("Fout bij ophalen van herstelcodes: " + allCodesError.message);
      }
      
      // Find a case-insensitive match
      const codeMatch = allCodes?.find(
        (code) => code.code.toLowerCase() === trimmedCode.toLowerCase()
      );
      
      if (!codeMatch) {
        console.error("Invalid recovery code:", trimmedCode);
        throw new Error("Ongeldige herstelcode. Controleer de code en probeer opnieuw.");
      }
      
      console.log("Found case-insensitive match for recovery code");
    }

    // Create the user account without redirects
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: password,
      options: {
        // No emailRedirectTo here as it causes issues with SPA
      }
    });

    if (error) {
      console.error("Sign up error:", error.message);
      
      // Handle existing user error specifically
      if (error.message.includes("User already registered")) {
        throw new Error("Dit e-mailadres is al geregistreerd. Probeer in te loggen of gebruik een ander e-mailadres.");
      }
      
      throw error;
    }

    if (!data.user) {
      console.error("Sign up failed: No user returned");
      throw new Error("Registratie mislukt: Geen gebruikersgegevens ontvangen");
    }

    // Add admin role to the new user
    await addAdminRole(data.user.id);

    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

/**
 * Add admin role to a user with retry mechanism
 */
const addAdminRole = async (userId: string, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Adding admin role to user ${userId} (attempt ${attempt}/${retries})`);
      
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role: "admin",
        });
        
      if (roleError) {
        console.error(`Error adding admin role (attempt ${attempt}/${retries}):`, roleError);
        
        if (attempt < retries) {
          // Wait before retrying (exponential backoff)
          await new Promise(r => setTimeout(r, 500 * attempt));
          continue;
        } else {
          throw roleError;
        }
      } else {
        console.log("Admin role added successfully for user:", userId);
        return true;
      }
    } catch (err) {
      console.error(`Exception adding admin role (attempt ${attempt}/${retries}):`, err);
      
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 500 * attempt));
        continue;
      }
      
      if (attempt === retries) {
        throw err;
      }
    }
  }
  
  console.error(`Failed to add admin role after ${retries} attempts`);
  return false;
};
