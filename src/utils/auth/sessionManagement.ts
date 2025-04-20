
import { supabase } from "@/integrations/supabase/client";

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut({
      scope: 'local' // Only sign out locally, not globally
    });
    
    if (error) {
      console.error("Signout error:", error);
      throw error;
    }
    return { success: true };
  } catch (error) {
    console.error("Signout exception:", error);
    throw error;
  }
};
