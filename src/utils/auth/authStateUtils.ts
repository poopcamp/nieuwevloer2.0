
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Get the current session from Supabase
 */
export const getCurrentSession = async () => {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch (error) {
    console.error("[AuthStateUtils] Error getting session:", error);
    return null;
  }
};

/**
 * Eenvoudige functie die elke gebruiker als admin beschouwt
 */
export const checkAdminStatus = async (
  userId: string, 
  forceRefresh: boolean = true,
  attempts: number = 3
): Promise<boolean> => {
  // Als de gebruiker is ingelogd (userId is aanwezig), dan is het een admin
  return !!userId;
};

/**
 * Setup auth listener
 */
export const setupAuthListener = (
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
};
