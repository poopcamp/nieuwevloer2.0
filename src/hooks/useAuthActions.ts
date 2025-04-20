
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { authService } from "@/services/auth/authService";

/**
 * Hook for auth-related actions
 * Refactored to use the centralized auth service
 */
export const useAuthActions = () => {
  const { toast } = useToast();
  const { refreshAuth } = useAuth();

  const handleSignIn = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      console.log("[useAuthActions] Sign in attempt for:", email);
      
      // Use auth service to sign in
      const result = await authService.signInWithEmail(email, password, rememberMe);
      
      if (!result?.user) {
        console.error("[useAuthActions] Sign in failed: No user returned");
        throw new Error("Inloggen mislukt: Geen gebruikersgegevens ontvangen");
      }
      
      console.log("[useAuthActions] Sign in successful for:", email);
      console.log("[useAuthActions] User ID:", result.user.id);
      
      // Verbeterde auth state refresh met meerdere pogingen en logging
      const refreshWithRetry = async (attempts = 3) => {
        for (let i = 0; i < attempts; i++) {
          try {
            console.log(`[useAuthActions] Refreshing auth state after login (attempt ${i + 1}/${attempts})`);
            // Wacht tussen pogingen met toenemende vertraging
            if (i > 0) {
              await new Promise(resolve => setTimeout(resolve, 1000 * i));
            }
            await refreshAuth();
            console.log(`[useAuthActions] Auth refresh successful (attempt ${i + 1})`);
            return true;
          } catch (err) {
            console.error(`[useAuthActions] Auth refresh error (attempt ${i + 1}):`, err);
            if (i === attempts - 1) throw err;
          }
        }
        return false;
      };
      
      await refreshWithRetry(5); // Verhoog naar 5 pogingen voor meer betrouwbaarheid
      
      return result;
    } catch (error: any) {
      console.error("[useAuthActions] Login error:", error.message);
      throw error;
    }
  }, [refreshAuth]);

  const handleSignOut = useCallback(async () => {
    try {
      console.log("[useAuthActions] Signing out user");
      // Use auth service to sign out
      await authService.signOut();
      
      // Add a delay to ensure Supabase processes the signout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh auth state
      await refreshAuth();
      
      toast({
        title: "Uitgelogd",
        description: "U bent succesvol uitgelogd",
      });
      
      return true;
    } catch (error: any) {
      console.error("[useAuthActions] Logout error:", error.message);
      toast({
        title: "Fout bij uitloggen",
        description: error.message || "Er is een fout opgetreden bij het uitloggen",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, refreshAuth]);

  return {
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
};
