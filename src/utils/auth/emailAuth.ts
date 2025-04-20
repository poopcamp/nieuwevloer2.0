
import { supabase } from "@/integrations/supabase/client";

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
  email: string, 
  password: string,
  rememberMe: boolean = false
) => {
  try {
    console.log("Signing in with email:", email);
    
    // Normalize email to lowercase to prevent case sensitivity issues
    const normalizedEmail = email.toLowerCase().trim();
    
    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
      options: {
        // No redirectTo as it causes problems
      }
    });

    if (error) {
      console.error("Sign in error:", error.message, error.code);
      
      if (error.message.includes("Invalid login credentials")) {
        throw new Error("Ongeldige inloggegevens. Controleer uw e-mail en wachtwoord.");
      }
      
      throw error;
    }

    if (!data.user) {
      console.error("Sign in failed: No user returned");
      throw new Error("Inloggen mislukt: Geen gebruikersgegevens ontvangen");
    }

    console.log("Sign in successful for:", data.user.email);
    return data;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};
