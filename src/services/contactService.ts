
import { supabase } from "@/integrations/supabase/client";
import { baseService } from "./baseService";
import { uploadFile } from "@/utils/formHandling";
import { ConfigurationData, ContactSubmissionData } from "@/types/configuration";

interface EmailResult {
  success: boolean;
  error?: string;
  details?: any;
  customerEmail?: { success: boolean; id?: string; error?: any };
  adminEmail?: { success: boolean; id?: string; error?: any };
}

/**
 * Service for handling contact form submissions and related functionality
 */
export const contactService = {
  /**
   * Submits a simple contact form
   * @param data Contact form data
   */
  async submitContactForm(data: ContactSubmissionData): Promise<{ success: boolean; error?: string; emailStatus?: EmailResult }> {
    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          additional_notes: data.additional_notes,
          project_type: data.project_type || "contact_form",
          receives_newsletter: data.receives_newsletter || false
        });

      if (dbError) throw new Error(dbError.message);
      
      // Send email notification
      const emailResult = await this.sendEmailNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        projectType: data.project_type || "contact_form",
        totalPrice: 0,
        additionalNotes: data.additional_notes
      });
      
      return { 
        success: true,
        emailStatus: emailResult
      };
    } catch (error: any) {
      console.error("Contact form submission error:", error);
      return {
        success: false,
        error: error.message || "Er is een fout opgetreden bij het verzenden van uw bericht."
      };
    }
  },
  
  /**
   * Submits a configurator form with relevant project details
   * @param data Configuration data with contact info
   * @param imageFile Optional image file to upload
   */
  async submitConfigurationForm(
    data: ConfigurationData,
    imageFile?: File | null
  ): Promise<{ success: boolean; error?: string; emailStatus?: EmailResult }> {
    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (imageFile) {
        imageUrl = await uploadFile(imageFile);
      }
      
      // Prepare data for database
      const dbData: ConfigurationData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        project_type: data.project_type,
        square_meters: data.square_meters,
        // Include all other relevant fields
        additional_notes: data.additional_notes,
        wants_showroom_visit: data.wants_showroom_visit,
        wants_site_visit: data.wants_site_visit,
        lead_score: 60,
        laatste_contactmoment: new Date().toISOString(),
        total_price: data.total_price || 0,
      };
      
      if (imageUrl) {
        dbData.project_image_url = imageUrl;
      }
      
      if (data.wants_site_visit) {
        dbData.address_street = data.address_street;
        dbData.address_city = data.address_city;
      }
      
      // Ensure required fields are present
      if (!dbData.name || !dbData.email || !dbData.phone) {
        throw new Error("Missing required fields: name, email, and phone are required");
      }
      
      // Save to database
      const { error: dbError } = await supabase
        .from('configurations')
        .insert(dbData);

      if (dbError) throw new Error(dbError.message);
      
      // Send email notification
      const emailData = {
        ...data,
        imageUrl
      };
      
      const emailResult = await this.sendEmailNotification(emailData);
      
      return { 
        success: true, 
        emailStatus: emailResult 
      };
    } catch (error: any) {
      console.error("Configuration form submission error:", error);
      return {
        success: false,
        error: error.message || "Er is een fout opgetreden bij het verzenden van uw configuratie."
      };
    }
  },
  
  /**
   * Sends email notifications for form submissions
   * @param data Data to include in the email
   */
  async sendEmailNotification(data: Record<string, any>): Promise<EmailResult> {
    try {
      // Log the data being sent to the edge function
      console.log("Sending email data:", JSON.stringify(data, null, 2));
      
      // Call the edge function to send email
      const { data: result, error } = await supabase.functions.invoke('send-confirmation', {
        body: data
      });
      
      if (error) {
        console.error("Error sending confirmation email:", error);
        return { 
          success: false, 
          error: error.message,
          details: error
        };
      }
      
      return {
        success: true,
        details: result
      };
    } catch (error: any) {
      console.error("Error in email notification:", error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }
};
