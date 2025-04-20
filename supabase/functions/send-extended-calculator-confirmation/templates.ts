
import { ExtendedCalculatorSubmission } from "./types.ts";

// Handig formaat voor prijzen weergave
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount);
}

// Bouw de email voor de klant op basis van de ingediende gegevens
export function buildCustomerEmail(data: ExtendedCalculatorSubmission): string {
  const projectDetails = data.selectedTileFormat 
    ? `<tr><td style="padding: 8px;"><strong>Tegelformaat:</strong></td><td style="padding: 8px;">${data.selectedTileFormat.name} - ${data.selectedTileFormat.dimensions}</td></tr>`
    : '';
  
  const tileStyleDetails = data.selectedTileStyle
    ? `<tr><td style="padding: 8px;"><strong>Tegelstijl:</strong></td><td style="padding: 8px;">${data.selectedTileStyle.name}</td></tr>`
    : '';
  
  const selectedOptionsHtml = data.selectedOptions && data.selectedOptions.length
    ? `
      <tr>
        <td style="padding: 8px;"><strong>Geselecteerde opties:</strong></td>
        <td style="padding: 8px;">
          <ul style="margin: 0; padding-left: 20px;">
            ${data.selectedOptions.map(option => `<li>${option.name}</li>`).join('')}
          </ul>
        </td>
      </tr>
      `
    : '';
  
  const visitDetails = data.wantsSiteVisit || data.wantsShowroomVisit
    ? `
      <tr>
        <td style="padding: 8px;"><strong>Afspraak:</strong></td>
        <td style="padding: 8px;">
          ${data.wantsSiteVisit ? '✓ Plaatsbezoek gewenst' : ''}
          ${data.wantsSiteVisit && data.wantsShowroomVisit ? '<br>' : ''}
          ${data.wantsShowroomVisit ? '✓ Showroom bezoek gewenst' : ''}
        </td>
      </tr>
      `
    : '';
  
  const addressDetails = data.wantsSiteVisit && (data.addressStreet || data.addressCity)
    ? `
      <tr>
        <td style="padding: 8px;"><strong>Adres:</strong></td>
        <td style="padding: 8px;">
          ${data.addressStreet || ''}<br>
          ${data.addressCity || ''}
        </td>
      </tr>
      `
    : '';
  
  const projectNotes = data.notes
    ? `
      <tr>
        <td style="padding: 8px;"><strong>Uw opmerkingen:</strong></td>
        <td style="padding: 8px;">${data.notes}</td>
      </tr>
      `
    : '';

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Uw configuratie bij NieuweVloer.be</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/logos/nieuwevloer-logo.png" alt="NieuweVloer.be" style="max-width: 200px;">
        </div>
        
        <h1 style="color: #2b6cb0; text-align: center;">Bedankt voor uw aanvraag!</h1>
        
        <p>Beste ${data.name},</p>
        
        <p>Wij hebben uw tegelproject configuratie goed ontvangen. Een van onze tegelspecialisten zal deze binnenkort bekijken en contact met u opnemen.</p>
        
        <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2b6cb0;">
          <h2 style="color: #2b6cb0; margin-top: 0;">Samenvatting van uw project</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px;"><strong>Project type:</strong></td>
              <td style="padding: 8px;">${data.projectName || 'Tegelproject'}</td>
            </tr>
            <tr>
              <td style="padding: 8px;"><strong>Oppervlakte:</strong></td>
              <td style="padding: 8px;">${data.squareMeters} m²</td>
            </tr>
            ${projectDetails}
            ${tileStyleDetails}
            ${selectedOptionsHtml}
            <tr>
              <td style="padding: 8px;"><strong>Geschatte prijs:</strong></td>
              <td style="padding: 8px;">${formatCurrency(data.calculatedPrice)} excl. BTW</td>
            </tr>
            ${visitDetails}
            ${addressDetails}
            ${projectNotes}
          </table>
        </div>
        
        <p><strong>Wat gebeurt er nu?</strong></p>
        <p>Een van onze specialisten zal binnen 48 uur contact met u opnemen om uw project te bespreken en eventuele vragen te beantwoorden. Indien u een plaatsbezoek heeft aangevraagd, zullen we een geschikte datum en tijd met u afspreken.</p>
        
        <p>Heeft u in de tussentijd vragen? Aarzel niet om ons te contacteren op <a href="mailto:info@nieuwevloer.be">info@nieuwevloer.be</a> of via 09 273 76 13.</p>
        
        <p>Met vriendelijke groeten,<br>
        Het team van NieuweVloer.be</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
          <p>
            NieuweVloer.be | Industrielaan 9, 9990 Maldegem | 09 273 76 13<br>
            <a href="https://nieuwevloer.be" style="color: #2b6cb0;">www.nieuwevloer.be</a>
          </p>
        </div>
      </div>
    </body>
  </html>
  `;
}

// Bouw de admin notificatie email
export function buildAdminEmail(data: ExtendedCalculatorSubmission): string {
  // Bereid HTML voor geselecteerde opties voor
  const optionsHtml = data.selectedOptions && data.selectedOptions.length
    ? `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Opties:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">
          <ul style="margin: 0; padding-left: 20px;">
            ${data.selectedOptions.map(option => `<li>${option.name} - ${formatCurrency(option.price)}</li>`).join('')}
          </ul>
        </td>
      </tr>
      `
    : '';

  // Bereid HTML voor vraagreacties voor
  const responsesHtml = data.questionResponses && Object.keys(data.questionResponses).length
    ? `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Antwoorden:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">
          <ul style="margin: 0; padding-left: 20px;">
            ${Object.entries(data.questionResponses).map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('')}
          </ul>
        </td>
      </tr>
      `
    : '';

  // Project afbeelding sectie
  const imageSection = data.projectImage
    ? `
      <div style="margin: 20px 0;">
        <h3 style="color: #2b6cb0;">Project afbeelding</h3>
        <img src="${data.projectImage}" alt="Project afbeelding" style="max-width: 100%; border-radius: 5px;">
      </div>
      `
    : '';

  // Adres informatie
  const addressInfo = data.wantsSiteVisit && (data.addressStreet || data.addressCity)
    ? `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Adres:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">
          ${data.addressStreet || 'Niet opgegeven'}<br>
          ${data.addressCity || 'Niet opgegeven'}
        </td>
      </tr>
      `
    : '';

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Nieuwe tegelconfiguratie aanvraag</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
        <h1 style="color: #2b6cb0;">Nieuwe tegelconfiguratie aanvraag!</h1>
        
        <p>Een nieuwe klant heeft een tegelproject geconfigureerd via de website.</p>
        
        <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2b6cb0;">
          <h2 style="color: #2b6cb0; margin-top: 0;">Klantgegevens</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Naam:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>E-mail:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Telefoon:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Plaatsbezoek:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.wantsSiteVisit ? 'Ja' : 'Nee'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Showroom bezoek:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.wantsShowroomVisit ? 'Ja' : 'Nee'}</td>
            </tr>
            ${addressInfo}
          </table>
        </div>
        
        <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2b6cb0;">
          <h2 style="color: #2b6cb0; margin-top: 0;">Project details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Project type:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.projectName || 'Niet gespecificeerd'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Oppervlakte:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.squareMeters} m²</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Tegelformaat:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                ${data.selectedTileFormat 
                  ? `${data.selectedTileFormat.name} - ${data.selectedTileFormat.dimensions}`
                  : 'Niet gespecificeerd'}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Tegelstijl:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                ${data.selectedTileStyle 
                  ? data.selectedTileStyle.name
                  : 'Niet gespecificeerd'}
              </td>
            </tr>
            ${optionsHtml}
            ${responsesHtml}
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Prijs:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formatCurrency(data.calculatedPrice)} excl. BTW</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Opmerkingen:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.notes || 'Geen'}</td>
            </tr>
          </table>
        </div>
        
        ${imageSection}
        
        <p><strong>Actie vereist:</strong> Neem binnen 48 uur contact op met deze klant om de aanvraag te bespreken.</p>
      </div>
    </body>
  </html>
  `;
}
