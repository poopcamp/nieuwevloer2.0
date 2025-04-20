
import { supabase } from "@/integrations/supabase/client";
import { EmailResponse } from "./email";

type FollowUpEmailData = {
  email: string;
  name: string;
  projectType: string | null;
  followUpType: "reminder" | "status_update" | "abandoned_cart" | "custom";
  customMessage?: string;
  // Additional fields that might be needed
  [key: string]: any;
};

/**
 * Send a follow-up email to a customer based on their configuration
 */
export const sendFollowUpEmail = async (data: FollowUpEmailData): Promise<EmailResponse> => {
  try {
    // Call the edge function for sending emails
    const { data: responseData, error } = await supabase.functions.invoke("send-confirmation", {
      body: {
        to: data.email,
        subject: `Opvolging van uw aanvraag bij NieuweVloer.be`,
        name: data.name,
        email: data.email,
        followUpType: data.followUpType,
        projectType: data.projectType || "Tegelproject",
        customMessage: data.customMessage,
        isFollowUp: true,
        ...data // Include all other data
      }
    });

    if (error) {
      console.error("Error sending follow-up email:", error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }

    if (!responseData.success) {
      return {
        success: false,
        error: responseData.error || "Unknown error sending follow-up email",
        details: responseData
      };
    }

    // Return success response with any additional details from the edge function
    return {
      success: true,
      customerEmail: responseData.customerEmail,
      adminEmail: responseData.adminEmail
    };
  } catch (error: any) {
    console.error("Exception in sendFollowUpEmail:", error);
    return {
      success: false,
      error: error.message || "Unknown exception in sendFollowUpEmail",
      details: error
    };
  }
};
