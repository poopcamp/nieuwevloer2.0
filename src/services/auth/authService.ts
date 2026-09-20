
import { User, Session } from "@supabase/supabase-js";
import { AUTH_API_URL, supabase } from "@/integrations/supabase/client";
import { hasNieuweVloerAnonKey, isSupabaseCoHost } from "@/config/api";

function toAuthError(error: unknown): Error {
  const message = error instanceof Error ? error.message : String(error ?? "");
  if (/load failed|failed to fetch|networkerror|network request failed/i.test(message)) {
    return new Error(
      `Verbinding met de login-server mislukt (${AUTH_API_URL}). Controleer of de Home Server api.nieuwevloer.be bereikbaar is.`
    );
  }
  return error instanceof Error ? error : new Error(message || "Onbekende authenticatiefout");
}

/**
 * Core authentication service that centralizes all auth-related functionality
 */
export const authService = {
  /**
   * Get the current session from Supabase
   * @returns Current session or null if not authenticated
   */
  getCurrentSession: async (): Promise<Session | null> => {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch (error) {
      console.error("[AuthService] Error getting session:", error);
      return null;
    }
  },

  /**
   * Sign in with email and password
   * @param email User's email
   * @param password User's password
   * @param rememberMe Whether to remember the user
   * @returns Authentication data including user and session
   */
  signInWithEmail: async (
    email: string, 
    password: string,
    rememberMe: boolean = false
  ) => {
    try {
      console.log("[AuthService] Signing in with email:", email, "host:", AUTH_API_URL);

      if (isSupabaseCoHost(AUTH_API_URL)) {
        throw new Error("Login mag niet via *.supabase.co. Gebruik api.nieuwevloer.be.");
      }

      if (!hasNieuweVloerAnonKey()) {
        throw new Error(
          "VITE_SUPABASE_ANON_KEY ontbreekt. Zet de GoTrue anon key op de Home Server (zie .env.example)."
        );
      }
      
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
        console.error("[AuthService] Sign in error:", error.message, error.code);
        
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Ongeldige inloggegevens. Controleer uw e-mail en wachtwoord.");
        }
        
        throw error;
      }

      if (!data.user) {
        console.error("[AuthService] Sign in failed: No user returned");
        throw new Error("Inloggen mislukt: Geen gebruikersgegevens ontvangen");
      }

      console.log("[AuthService] Sign in successful for:", data.user.email);
      return data;
    } catch (error: any) {
      console.error("[AuthService] Authentication error:", error);
      throw toAuthError(error);
    }
  },

  /**
   * Sign out the current user
   * @returns Success status
   */
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut({
        scope: 'local' // Only sign out locally, not globally
      });
      
      if (error) {
        console.error("[AuthService] Signout error:", error);
        throw error;
      }
      return { success: true };
    } catch (error) {
      console.error("[AuthService] Signout exception:", error);
      throw error;
    }
  },

  /**
   * Check if the current user has admin status
   * @param userId User ID to check
   * @param forceRefresh Whether to force a refresh of admin status
   * @returns Whether the user is an admin
   */
  checkAdminStatus: async (
    userId: string, 
    forceRefresh: boolean = true
  ): Promise<boolean> => {
    // In this simplified version, any logged in user is considered an admin
    return !!userId;
  },

  /**
   * Setup auth state change listener
   * @param setSession Function to update session state
   * @param setUser Function to update user state
   * @param onAuthChange Callback for auth state changes
   * @returns Cleanup function to unsubscribe
   */
  setupAuthListener: (
    setSession: (session: Session | null) => void,
    setUser: (user: User | null) => void,
    onAuthChange: (session: Session | null) => void
  ) => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("[AuthListener] Auth state changed:", event);
      
      // Update session and user state synchronously
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      // Don't do anything else in the callback that might trigger another supabase call
      if (newSession) {
        // Use setTimeout to defer any additional operations
        setTimeout(() => {
          onAuthChange(newSession);
        }, 0);
      } else {
        setTimeout(() => {
          onAuthChange(null);
        }, 0);
      }
    });
    
    return () => {
      console.log("[AuthListener] Cleaning up auth listener");
      authListener.subscription.unsubscribe();
    };
  },

  /**
   * Register with recovery code
   */
  registerWithRecoveryCode: async (
    recoveryCode: string,
    email: string,
    password: string
  ) => {
    try {
      console.log("[AuthService] Registering with recovery code");
      
      // Normalize email to lowercase
      const normalizedEmail = email.toLowerCase().trim();
      const trimmedCode = recoveryCode.trim();
      
      // Verify the recovery code
      const { data: codeData, error: codeError } = await supabase
        .from("recovery_codes")
        .select("admin_email")
        .eq("code", trimmedCode)
        .maybeSingle();

      if (codeError) {
        console.error("[AuthService] Error verifying recovery code:", codeError);
        throw new Error("Fout bij verificatie van herstelcode: " + codeError.message);
      }

      // If no match, try case-insensitive match
      if (!codeData) {
        console.log("[AuthService] Trying case-insensitive match for recovery code");
        
        const { data: allCodes, error: allCodesError } = await supabase
          .from("recovery_codes")
          .select("admin_email, code");
          
        if (allCodesError) {
          console.error("[AuthService] Error retrieving recovery codes:", allCodesError);
          throw new Error("Fout bij ophalen van herstelcodes: " + allCodesError.message);
        }
        
        // Find a case-insensitive match
        const codeMatch = allCodes?.find(
          (code) => code.code.toLowerCase() === trimmedCode.toLowerCase()
        );
        
        if (!codeMatch) {
          console.error("[AuthService] Invalid recovery code:", trimmedCode);
          throw new Error("Ongeldige herstelcode. Controleer de code en probeer opnieuw.");
        }
        
        console.log("[AuthService] Found case-insensitive match for recovery code");
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
        console.error("[AuthService] Sign up error:", error.message);
        
        // Handle existing user error specifically
        if (error.message.includes("User already registered")) {
          throw new Error("Dit e-mailadres is al geregistreerd. Probeer in te loggen of gebruik een ander e-mailadres.");
        }
        
        throw error;
      }

      if (!data.user) {
        console.error("[AuthService] Sign up failed: No user returned");
        throw new Error("Registratie mislukt: Geen gebruikersgegevens ontvangen");
      }

      // Add admin role to the new user
      await authService.addAdminRole(data.user.id);

      return data;
    } catch (error) {
      console.error("[AuthService] Registration error:", error);
      throw error;
    }
  },

  /**
   * Add admin role to a user
   */
  addAdminRole: async (userId: string, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`[AuthService] Adding admin role to user ${userId} (attempt ${attempt}/${retries})`);
        
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: userId,
            role: "admin",
          });
          
        if (roleError) {
          console.error(`[AuthService] Error adding admin role (attempt ${attempt}/${retries}):`, roleError);
          
          if (attempt < retries) {
            // Wait before retrying (exponential backoff)
            await new Promise(r => setTimeout(r, 500 * attempt));
            continue;
          } else {
            throw roleError;
          }
        } else {
          console.log("[AuthService] Admin role added successfully for user:", userId);
          return true;
        }
      } catch (err) {
        console.error(`[AuthService] Exception adding admin role (attempt ${attempt}/${retries}):`, err);
        
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, 500 * attempt));
          continue;
        }
        
        if (attempt === retries) {
          throw err;
        }
      }
    }
    
    console.error(`[AuthService] Failed to add admin role after ${retries} attempts`);
    return false;
  },

  /**
   * Send recovery email using recovery code
   */
  sendRecoveryEmail: async (recoveryCode: string) => {
    try {
      console.log("[AuthService] Checking recovery code:", recoveryCode);
      
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
        console.log("[AuthService] Exact match niet gevonden, probeer case-insensitive match");
        
        // Haal alle recovery codes op en filter lokaal voor case-insensitive vergelijking
        const { data: allCodes, error: allCodesError } = await supabase
          .from("recovery_codes")
          .select("*");
          
        if (allCodesError) {
          console.error("[AuthService] Error bij ophalen van alle herstelcodes:", allCodesError);
          throw new Error("Fout bij het controleren van de herstelcode. Probeer het later opnieuw.");
        }
        
        // Zoek naar een case-insensitive match
        if (allCodes && allCodes.length > 0) {
          data = allCodes.find(
            (codeEntry) => codeEntry.code.toLowerCase() === cleanCode.toLowerCase()
          );
          
          // Als we een match vinden, output het voor debugging
          if (data) {
            console.log("[AuthService] Case-insensitive match gevonden:", data.code);
          }
        }
      }

      if (error) {
        console.error("[AuthService] Recovery code lookup error:", error);
        throw new Error("Fout bij het controleren van de herstelcode. Probeer het later opnieuw.");
      }

      if (!data) {
        console.error("[AuthService] No recovery code found matching:", cleanCode);
        throw new Error("Ongeldige herstelcode. Controleer of u de code correct heeft ingevoerd.");
      }

      console.log("[AuthService] Recovery code found for email:", data.admin_email);
      
      // Check if the admin_email field is present and valid
      if (!data.admin_email || !data.admin_email.includes('@')) {
        console.error("[AuthService] Invalid email in recovery code:", data.admin_email);
        throw new Error("De herstelcode bevat een ongeldig e-mailadres. Neem contact op met de beheerder.");
      }

      // Send password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        data.admin_email
      );

      if (resetError) {
        console.error("[AuthService] Password reset error:", resetError);
        throw new Error("Fout bij het versturen van de herstelmail: " + resetError.message);
      }

      return { success: true, email: data.admin_email };
    } catch (error: any) {
      console.error("[AuthService] Recovery email error:", error);
      throw error;
    }
  },

  /**
   * Update the user's password after a reset
   */
  updatePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    return { success: true };
  }
};
