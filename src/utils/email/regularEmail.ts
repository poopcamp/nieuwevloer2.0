
import { EmailSendOptions, EmailResponse } from './types';
import { sendEmailRequest } from './emailService';

/**
 * Send a standard confirmation email
 */
export async function sendConfirmationEmail(data: EmailSendOptions): Promise<EmailResponse> {
  try {
    console.log("Sending confirmation email to:", data.email);
    
    const response = await sendEmailRequest(data);
    
    // Add any specific handling for confirmation emails
    if (!response.success) {
      console.warn("Confirmation email failed, but continuing:", response.error);
    }
    
    return response;
  } catch (error: any) {
    console.error("Confirmation email error:", error);
    
    return { 
      success: false, 
      error: error.message || "Could not send confirmation email",
      details: error.details || error 
    };
  }
}
