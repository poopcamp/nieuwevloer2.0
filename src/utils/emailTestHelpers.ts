
import { sendTestEmail } from "./email";

/**
 * Test the email functionality by sending a test email
 */
export const testEmailFunctionality = async (email: string) => {
  try {
    const result = await sendTestEmail(email);
    return result;
  } catch (error: any) {
    console.error("Error testing email functionality:", error);
    return {
      success: false,
      error: error.message || "Failed to send test email",
      details: error
    };
  }
};
