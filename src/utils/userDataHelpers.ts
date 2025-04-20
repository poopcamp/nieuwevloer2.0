
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type ConfigurationsRecord = Tables<"configurations">;

/**
 * Load previous user data based on email
 */
export const loadPreviousUserData = async (email: string): Promise<ConfigurationsRecord & { wants_site_visit?: boolean }> => {
  try {
    const { data, error } = await supabase
      .from('configurations')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (error) {
      console.error("Error fetching previous data:", error);
      return null;
    }
    
    return data && data.length > 0 ? data[0] : null;
  } catch (err) {
    console.error("Error in loadPreviousUserData:", err);
    return null;
  }
};
