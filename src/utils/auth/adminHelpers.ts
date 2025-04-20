
import { supabase } from "@/integrations/supabase/client";

/**
 * Vereenvoudigde admin check die elke gebruiker als admin beschouwt
 */
export const checkIsAdmin = async (userId?: string, forceRefresh: boolean = false): Promise<boolean> => {
  // Als er een userId is, is de gebruiker admin
  return !!userId;
};

/**
 * Add admin role to a user
 */
export const addAdminRole = async (userId: string) => {
  console.log("Adding admin role to user:", userId);
  
  try {
    // First check if the role already exists to prevent duplicates
    const { data: existingRole, error: checkError } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is expected
      console.error("addAdminRole: Check error:", checkError);
      throw checkError;
    }
      
    if (existingRole) {
      console.log("Admin role already exists for user:", userId);
      return { success: true, message: "Admin rol bestaat al" };
    }
    
    // Add the admin role
    const { error } = await supabase
      .from("user_roles")
      .insert({
        user_id: userId,
        role: "admin",
      });

    if (error) {
      console.error("addAdminRole: Insert error:", error);
      throw error;
    }
    
    console.log("Successfully added admin role to user:", userId);
    return { success: true, message: "Admin rol succesvol toegevoegd" };
  } catch (error: any) {
    console.error("addAdminRole: Exception:", error);
    throw error;
  }
};
