
import { EmailData } from "../types.ts";
import { formatCurrency } from "../../utils.ts";
import { 
  getProjectDetailsHTML,
  getExtraOptionsHTML,
  getVisitOptionsHTML,
  getProjectImagesHTML
} from "./emailSections.ts";
import { adminEmailFooter } from "../components/footerComponents.ts";

/**
 * Build the complete admin notification email
 */
export function buildAdminEmailContent(data: EmailData): string {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Nieuwe configuratie aanvraag</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
        <h1 style="color: #2b6cb0;">Nieuwe configuratie aanvraag!</h1>
        
        <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffeeba;">
          <p style="margin: 0;"><strong>Actie vereist:</strong> Neem binnen 24 uur contact op met deze klant!</p>
        </div>
        
        <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2b6cb0;">
          <h2 style="color: #2b6cb0; margin-top: 0;">Klantgegevens</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Naam:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.name || 'Niet opgegeven'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>E-mail:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Telefoon:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.phone || 'Niet opgegeven'}</td>
            </tr>
            ${getVisitOptionsHTML(data)}
          </table>
        </div>
        
        <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2b6cb0;">
          <h2 style="color: #2b6cb0; margin-top: 0;">Projectdetails</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            ${getProjectDetailsHTML(data)}
            ${getExtraOptionsHTML(data)}
          </table>
        </div>
        
        <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2b6cb0;">
          <h2 style="color: #2b6cb0; margin-top: 0;">Prijsinformatie</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Berekende richtprijs:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #2b6cb0; font-weight: bold;">${formatCurrency(data.totalPrice || 0)} excl. btw</td>
            </tr>
            ${data.wantsToBuyTiles && data.tilePricePerSqm ? `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Tegelprijs per m²:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formatCurrency(data.tilePricePerSqm)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>M² met snijverlies:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.squareMetersWithCuttingLoss} m²</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Totale tegelkost:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formatCurrency(data.tileCost || 0)}</td>
              </tr>
            ` : ''}
          </table>
        </div>
        
        ${getProjectImagesHTML(data)}
        
        ${data.additionalNotes ? `
        <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2b6cb0;">
          <h2 style="color: #2b6cb0; margin-top: 0;">Klant opmerkingen</h2>
          <p style="margin-bottom: 0;">${data.additionalNotes}</p>
        </div>
        ` : ''}
        
        ${adminEmailFooter()}
      </div>
    </body>
  </html>
  `;
}
