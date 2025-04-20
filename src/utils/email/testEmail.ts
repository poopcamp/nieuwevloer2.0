
import { supabase } from "@/integrations/supabase/client";
import { EmailResponse } from "./types";

/**
 * Send a test email to verify the email functionality is working correctly
 * @param email The email address to send the test email to
 * @returns EmailResponse object with success/error information
 */
export const sendTestEmail = async (email: string): Promise<EmailResponse> => {
  try {
    // Call the edge function for sending emails
    const { data, error } = await supabase.functions.invoke("send-confirmation", {
      body: {
        to: email,
        subject: "Test Email from NieuweVloer.be",
        isTest: true, // Flag to indicate this is a test email
        name: "Test Gebruiker",
        email: email,
        phone: "+32 123 45 67 89",
        projectType: "Test Project",
        totalPrice: 0
      }
    });

    if (error) {
      console.error("Error sending test email:", error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }

    if (!data.success) {
      return {
        success: false,
        error: data.error || "Unknown error sending test email",
        details: data
      };
    }

    // Return success response with any additional details from the edge function
    return {
      success: true,
      customerEmail: data.customerEmail,
      adminEmail: data.adminEmail
    };
  } catch (error: any) {
    console.error("Exception in sendTestEmail:", error);
    return {
      success: false,
      error: error.message || "Unknown exception in sendTestEmail",
      details: error
    };
  }
};
