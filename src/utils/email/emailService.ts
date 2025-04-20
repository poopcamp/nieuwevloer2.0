import { EMAIL_CONFIG, EMAIL_TYPES } from './config';
import { EmailSendOptions, EmailResponse, EdgeFunctionResponse } from './types';
import { createNetworkError, createServiceError, createTimeoutError, getFormattedErrorDetails } from './errorHandling';
import { supabase } from "@/integrations/supabase/client";

/**
 * Send email request to the Edge Function
 */
export async function sendEmailRequest(data: EmailSendOptions): Promise<EmailResponse> {
  try {
    console.log("[emailService] Preparing to send email to:", data.email);
    console.log("[emailService] With project type:", data.projectType);
    console.log("[emailService] Full payload being sent:", JSON.stringify(data, null, 2));
    
    // Create an AbortController to handle request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), EMAIL_CONFIG.DEFAULT_TIMEOUT);
    
    try {
      // Make sure quick calculator type is consistent and properly formatted
      if (data.projectType === "quick_calculator") {
        console.log("[emailService] Detected quick calculator email - Setting explicit properties");
        // Ensure needed properties are set for quick calculator
        data = {
          ...data,
          projectType: "quick_calculator",  // Ensure consistent casing
        };
      }
      
      console.log("[emailService] Invoking edge function with payload:", JSON.stringify(data, null, 2));
      
      // Direct call to the edge function
      const { data: responseData, error } = await supabase.functions.invoke(
        "send-confirmation",
        { 
          body: data,
          signal: controller.signal
        }
      );
      
      // Clear the timeout since the request completed
      clearTimeout(timeoutId);
      
      console.log("[emailService] Edge function response:", responseData);
      
      if (error) {
        console.error("[emailService] Edge function error:", error);
        throw createServiceError({
          error: `Edge function error: ${error.message}`,
          status: 500,
          rawResponse: JSON.stringify(error)
        });
      }
      
      // Return standardized response
      return {
        success: responseData?.success || false,
        error: responseData?.error,
        details: responseData,
        customerEmail: responseData?.customerEmail,
        adminEmail: responseData?.adminEmail
      };
    } catch (error: any) {
      // Clear the timeout if there was an error
      clearTimeout(timeoutId);
      
      // Handle abort/timeout
      if (error.name === 'AbortError') {
        console.error("[emailService] Request timed out");
        throw createTimeoutError();
      }
      
      // Re-throw email errors
      if (error.name === 'EmailError') {
        console.error("[emailService] EmailError:", error);
        throw error;
      }
      
      // Otherwise create a network error
      console.error("[emailService] Network error:", error);
      throw createNetworkError(error);
    }
  } catch (error: any) {
    console.error("[emailService] Email sending failed:", error);
    
    return {
      success: false,
      error: error.message || "Could not send email",
      details: getFormattedErrorDetails(error)
    };
  }
}
