
import { getNieuweVloerAnonKey, getNieuweVloerApiUrl } from "@/config/api";

// Admin/public email helpers use the same HS gateway as login — never *.supabase.co.
export const EMAIL_CONFIG = {
  SUPABASE_URL: getNieuweVloerApiUrl(),
  SUPABASE_ANON_KEY: getNieuweVloerAnonKey(),
  FUNCTION_ENDPOINT: "/functions/v1/send-confirmation",
  DEFAULT_TIMEOUT: 30000,
};

export const EMAIL_TYPES = {
  GUIDE_DOWNLOAD: "guide_download",
  FOLLOW_UP: "follow_up",
  CONTACT_FORM: "contact_form",
  QUICK_CALCULATOR: "quick_calculator",
  TEST_EMAIL: "test_email",
};
