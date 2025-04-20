
import { supabase } from "@/integrations/supabase/client";
import { CompanyInfo, tableNames } from "@/utils/supabase/customTypes";

/**
 * Get company information from database
 */
export const getCompanyInfo = async (): Promise<CompanyInfo> => {
  try {
    const { data, error } = await supabase
      .from(tableNames.ADMIN_SETTINGS)
      .select('*')
      .single();
      
    if (error) {
      console.error("Error fetching company info:", error);
      throw error;
    }
    
    return data as CompanyInfo;
  } catch (err) {
    console.error("Error in getCompanyInfo:", err);
    throw err;
  }
};

/**
 * Update company information
 */
export const updateCompanyInfo = async (info: CompanyInfo): Promise<boolean> => {
  try {
    // Check if user has the proper session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error("U bent niet ingelogd. Log in om bedrijfsgegevens te kunnen wijzigen.");
    }
    
    // Log de data voor debugging
    console.log("Updating company info with:", info);
    
    // Ensure we're only sending the fields that need to be updated
    const updateData = {
      company_name: info.company_name,
      company_vat: info.company_vat,
      company_address: info.company_address,
      company_email: info.company_email,
      company_phone: info.company_phone,
      showroom_visit_enabled: info.showroom_visit_enabled,
      showroom_visit_text: info.showroom_visit_text,
      privacy_policy_last_updated: info.privacy_policy_last_updated,
      terms_last_updated: info.terms_last_updated,
      updated_at: new Date().toISOString()
    };
    
    // Attempt to update the record
    const { error, data } = await supabase
      .from(tableNames.ADMIN_SETTINGS)
      .update(updateData)
      .eq('id', info.id)
      .select();
    
    if (error) {
      // Check for RLS policy violations or permission errors
      if (error.code === '42501' || error.message.includes('policy')) {
        throw new Error("U heeft geen toestemming om bedrijfsgegevens te wijzigen. Alleen administrators kunnen deze instellingen aanpassen.");
      }
      console.error("Error updating company info:", error);
      throw error;
    }
    
    console.log("Update successful, returned data:", data);
    return true;
  } catch (err: any) {
    console.error("Error in updateCompanyInfo:", err);
    throw err;
  }
};
