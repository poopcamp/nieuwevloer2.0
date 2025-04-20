
import { supabase } from "@/integrations/supabase/client";
import { EmailResponse, EmailSendOptions } from "./email";

// Email types for different email templates
export const EMAIL_TYPES = {
  GUIDE_DOWNLOAD: "guide_download",
  FOLLOW_UP: "follow_up",
  CONTACT_FORM: "contact_form",
  QUICK_CALCULATOR: "quick_calculator", // Type for the quick calculator
  TEST_EMAIL: "test_email", // Type for test emails
};

/**
 * Send a test email to verify the email functionality is working correctly
 */
export const sendTestEmail = async (email: string): Promise<EmailResponse> => {
  try {
    console.log("Sending test email to:", email);
    
    // Call the edge function for sending a test email
    const { data: responseData, error } = await supabase.functions.invoke("send-confirmation", {
      body: {
        name: "Test Gebruiker",
        email: email,
        phone: "+32 123 45 67 89",
        projectType: EMAIL_TYPES.TEST_EMAIL,
        isTest: true, // Flag to indicate this is a test email
        totalPrice: 0
      }
    });

    console.log("Test email response:", responseData);

    if (error) {
      console.error("Error from edge function:", error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }

    if (!responseData || !responseData.success) {
      console.error("Edge function failed:", responseData?.error || "Unknown error");
      return {
        success: false,
        error: responseData?.error || "Unknown error sending test email",
        details: responseData
      };
    }

    // Return success response
    return {
      success: true,
      customerEmail: responseData.customerEmail,
      adminEmail: responseData.adminEmail
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

/**
 * Send a confirmation email to the customer and an admin notification
 */
export const sendConfirmationEmail = async (data: EmailSendOptions): Promise<EmailResponse> => {
  try {
    console.log("Sending confirmation email via edge function to:", data.email);
    console.log("Project type:", data.projectType);
    
    // Call the edge function for sending emails with more detailed logging
    console.log("Send confirmation email data:", JSON.stringify(data, null, 2));
    
    const { data: responseData, error } = await supabase.functions.invoke("send-confirmation", {
      body: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        projectType: data.projectType || "Tegelproject",
        totalPrice: data.totalPrice || 0,
        squareMeters: data.squareMeters,
        tileSize: data.tileSize,
        additionalNotes: data.additionalNotes,
        // Include additional work information
        needsChape: data.needsChape || false,
        needsElectrician: data.needsElectrician || false,
        // Include site visit information
        wantsSiteVisit: data.wantsSiteVisit || false,
        addressStreet: data.addressStreet,
        addressCity: data.addressCity,
        // Include bathroom options if applicable
        showerNis: data.showerNis,
        showerNisSize: data.showerNisSize,
        showerNisCustomSize: data.showerNisCustomSize,
        fullBathroomRenovation: data.fullBathroomRenovation,
        // Include tile purchase options
        wantsToBuyTiles: data.wantsToBuyTiles,
        tilePricePerSqm: data.tilePricePerSqm,
        squareMetersWithCuttingLoss: data.squareMetersWithCuttingLoss,
        tileCost: data.tileCost,
        // Include image URL if available
        imageUrl: data.imageUrl,
        // Add selected inspiration style if available
        selectedInspirationStyle: data.selectedInspirationStyle,
        selectedInspirationStyleTitle: data.selectedInspirationStyleTitle
      }
    });

    console.log("Edge function response:", responseData);

    if (error) {
      console.error("Error from edge function:", error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }

    if (!responseData || !responseData.success) {
      console.error("Edge function failed:", responseData?.error || "Unknown error");
      return {
        success: false,
        error: responseData?.error || "Unknown error sending confirmation email",
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
    console.error("Exception in sendConfirmationEmail:", error);
    return {
      success: false,
      error: error.message || "Unknown exception in sendConfirmationEmail",
      details: error
    };
  }
};

/**
 * Send a simple email for various purposes like guide downloads
 */
export const sendSimpleEmail = async (
  name: string,
  email: string,
  emailType: string,
  message?: string,
  additionalData?: Record<string, any>
): Promise<EmailResponse> => {
  try {
    console.log("Sending simple email via edge function to:", email, "type:", emailType);
    
    // Call the edge function for sending emails
    const { data: responseData, error } = await supabase.functions.invoke("send-confirmation", {
      body: {
        name: name,
        email: email,
        projectType: emailType,
        message: message,
        ...additionalData
      }
    });

    console.log("Edge function response for simple email:", responseData);

    if (error) {
      console.error("Error from edge function (simple email):", error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }

    if (!responseData || !responseData.success) {
      console.error("Edge function failed (simple email):", responseData?.error || "Unknown error");
      return {
        success: false,
        error: responseData?.error || "Unknown error sending email",
        details: responseData
      };
    }

    // Return success response
    return {
      success: true,
      customerEmail: responseData.customerEmail,
      adminEmail: responseData.adminEmail
    };
  } catch (error: any) {
    console.error("Exception in sendSimpleEmail:", error);
    return {
      success: false,
      error: error.message || "Unknown exception in sendSimpleEmail",
      details: error
    };
  }
};

/**
 * Send an email for quick calculator requests
 */
export const sendQuickCalculatorEmail = async (data: EmailSendOptions): Promise<EmailResponse> => {
  try {
    console.log("Sending quick calculator email via edge function to:", data.email);
    
    // Set project type specifically for quick calculator
    const updatedData = {
      ...data,
      projectType: data.projectType || "quick_calculator"
    };
    
    console.log("Quick calculator email data:", JSON.stringify(updatedData, null, 2));
    
    // Use the main confirmation email function since it handles all the needed parameters
    return sendConfirmationEmail(updatedData);
  } catch (error: any) {
    console.error("Exception in sendQuickCalculatorEmail:", error);
    return {
      success: false,
      error: error.message || "Unknown exception in sendQuickCalculatorEmail",
      details: error
    };
  }
};
