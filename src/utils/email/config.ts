
// Configuration for email sending functions
export const EMAIL_CONFIG = {
  // Supabase config
  SUPABASE_URL: "https://ssvgnlbzztxobvilucvk.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzdmdubGJ6enR4b2J2aWx1Y3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MzgwNTQsImV4cCI6MjA1OTAxNDA1NH0._HuCiYiaGv4RdjDZhAAPeXqnWll0DlZLJiSt3HgcOfA",
  
  // Edge function endpoint for sending emails
  FUNCTION_ENDPOINT: "/functions/v1/send-confirmation",
  
  // Network settings
  DEFAULT_TIMEOUT: 30000, // 30 seconds
};

// Email types for different email templates
export const EMAIL_TYPES = {
  GUIDE_DOWNLOAD: "guide_download",
  FOLLOW_UP: "follow_up",
  CONTACT_FORM: "contact_form",
  QUICK_CALCULATOR: "quick_calculator", // Type for the quick calculator
  TEST_EMAIL: "test_email", // Type for test emails
};
