
import { EmailResponse } from './types';
import { sendConfirmationEmail } from './regularEmail';
import { EMAIL_TYPES } from './config';

/**
 * Send a follow-up email after a certain number of days
 */
export async function sendFollowUpEmail(data: {
  name: string;
  email: string;
  phone?: string;
  projectType: string | null;
  totalPrice: number;
}): Promise<EmailResponse> {
  try {
    console.log("Sending follow-up email to:", data.email);
    
    const response = await sendConfirmationEmail({
      ...data,
      projectType: EMAIL_TYPES.FOLLOW_UP
    });
    
    // Add follow-up specific logging and handling
    if (response.success) {
      console.log("Follow-up email sent successfully to:", data.email);
    } else {
      console.warn("Follow-up email failed:", response.error);
    }
    
    return response;
  } catch (error: any) {
    console.error("Follow-up email failed:", error);
    
    return { 
      success: false, 
      error: error.message || "Could not send follow-up email",
      details: error.details || error
    };
  }
}
