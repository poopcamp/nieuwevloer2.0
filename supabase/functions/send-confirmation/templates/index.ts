
// Re-export all templates for easier importing
export * from "./customerTemplates.ts";
export * from "./adminTemplates.ts";
export * from "./components/footerComponents.ts";

// Re-export the template functions with consistent names
import { buildAdminEmailContent } from "./adminTemplates.ts";
import { buildCustomerEmail } from "./customerTemplates.ts";

export { buildAdminEmailContent as buildAdminNotificationEmail };
