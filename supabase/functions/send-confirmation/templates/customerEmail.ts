import { EmailData } from "./types.ts";
import { formatCurrency } from "../utils.ts";

export function buildCustomerEmail(data: EmailData): string {
  // Extract project details based on project type
  let projectDetailsHTML = '';
  
  if (data.projectType === 'vloer') {
    projectDetailsHTML = `
      <tr><td style="padding: 8px;"><strong>Type project:</strong></td><td style="padding: 8px;">Vloer</td></tr>
      <tr><td style="padding: 8px;"><strong>Oppervlakte:</strong></td><td style="padding: 8px;">${data.squareMeters} m²</td></tr>
      <tr><td style="padding: 8px;"><strong>Vloertype:</strong></td><td style="padding: 8px;">${data.floorType || 'Niet gespecificeerd'}</td></tr>
      <tr><td style="padding: 8px;"><strong>Tegelformaat:</strong></td><td style="padding: 8px;">${data.tileSize || 'Niet gespecificeerd'}</td></tr>
    `;
  } else if (data.projectType === 'keukenwand') {
    projectDetailsHTML = `
      <tr><td style="padding: 8px;"><strong>Type project:</strong></td><td style="padding: 8px;">Keukenwand</td></tr>
      <tr><td style="padding: 8px;"><strong>Oppervlakte:</strong></td><td style="padding: 8px;">${data.squareMeters} m²</td></tr>
      <tr><td style="padding: 8px;"><strong>Wandtype:</strong></td><td style="padding: 8px;">${data.wallType || 'Niet gespecificeerd'}</td></tr>
      <tr><td style="padding: 8px;"><strong>Tegelformaat:</strong></td><td style="padding: 8px;">${data.wallTileSize || 'Niet gespecificeerd'}</td></tr>
    `;
  } else if (data.projectType === 'badkamer') {
    projectDetailsHTML = `
      <tr><td style="padding: 8px;"><strong>Type project:</strong></td><td style="padding: 8px;">Badkamer</td></tr>
      <tr><td style="padding: 8px;"><strong>Oppervlakte:</strong></td><td style="padding: 8px;">${data.squareMeters} m²</td></tr>
      <tr><td style="padding: 8px;"><strong>Tegelformaat:</strong></td><td style="padding: 8px;">${data.bathroomTileSize || 'Niet gespecificeerd'}</td></tr>
    `;
    
    if (data.showerNis) {
      projectDetailsHTML += `
        <tr><td style="padding: 8px;"><strong>Douchenis:</strong></td><td style="padding: 8px;">Ja</td></tr>
      `;
      
      if (data.showerNisSize) {
        projectDetailsHTML += `
          <tr><td style="padding: 8px;"><strong>Afmeting douchenis:</strong></td><td style="padding: 8px;">${data.showerNisSize}</td></tr>
        `;
      } else if (data.showerNisCustomSize) {
        projectDetailsHTML += `
          <tr><td style="padding: 8px;"><strong>Afmeting douchenis:</strong></td><td style="padding: 8px;">${data.showerNisCustomSize}</td></tr>
        `;
      }
    }
    
    if (data.fullBathroomRenovation) {
      projectDetailsHTML += `
        <tr><td style="padding: 8px;"><strong>Complete badkamerrenovatie:</strong></td><td style="padding: 8px;">Ja</td></tr>
      `;
    }
  } else {
    projectDetailsHTML = `
      <tr><td style="padding: 8px;"><strong>Type project:</strong></td><td style="padding: 8px;">${data.projectType || 'Tegelproject'}</td></tr>
      <tr><td style="padding: 8px;"><strong>Oppervlakte:</strong></td><td style="padding: 8px;">${data.squareMeters} m²</td></tr>
      <tr><td style="padding: 8px;"><strong>Beschrijving:</strong></td><td style="padding: 8px;">${data.otherDescription || 'Geen beschrijving'}</td></tr>
    `;
  }
  
  // Add extra options section if any options were selected
  const hasExtraOptions = data.needsPlinths || data.needsChape || data.needsElectrician;
  
  let extraOptionsHTML = '';
  if (hasExtraOptions) {
    extraOptionsHTML = `
      <tr>
        <td colspan="2" style="padding: 8px; background-color: #f8f9fa; font-weight: bold;">Extra opties:</td>
      </tr>
    `;
    
    if (data.needsPlinths) {
      extraOptionsHTML += `
        <tr><td style="padding: 8px;"><strong>Plinten plaatsen:</strong></td><td style="padding: 8px;">Ja</td></tr>
      `;
    }
    
    if (data.needsChape) {
      extraOptionsHTML += `
        <tr><td style="padding: 8px;"><strong>Chapewerken:</strong></td><td style="padding: 8px;">Ja</td></tr>
      `;
    }
    
    if (data.needsElectrician) {
      extraOptionsHTML += `
        <tr><td style="padding: 8px;"><strong>Elektricien nodig:</strong></td><td style="padding: 8px;">Ja</td></tr>
      `;
    }
  }
  
  // Add photo section if images were uploaded
  let projectImagesHTML = '';
  if (data.imageUrl) {
    projectImagesHTML = `
      <div style="margin-top: 20px;">
        <h3 style="color: #2b6cb0; margin-bottom: 10px;">Project foto's</h3>
        <img src="${data.imageUrl}" alt="Project afbeelding" style="max-width: 100%; border-radius: 5px; margin-bottom: 10px; border: 1px solid #e2e8f0;">
      </div>
    `;
  }
  
  // Rest of the email template
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Bevestiging van uw tegelproject bij NieuweVloer.be</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/logos/nieuwevloer-logo.png" alt="NieuweVloer.be" style="max-width: 200px;">
        </div>
        
        <h1 style="color: #2b6cb0; text-align: center;">Bedankt voor uw aanvraag!</h1>
        
        <p>Beste ${data.name || 'klant'},</p>
        
        <p>Hartelijk dank voor uw configuratie bij NieuweVloer.be. We hebben uw aanvraag goed ontvangen en zullen zo snel mogelijk contact met u opnemen.</p>
        
        <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2b6cb0;">
          <h2 style="color: #2b6cb0; margin-top: 0;">Projectdetails</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            ${projectDetailsHTML}
            ${extraOptionsHTML}
          </table>
        </div>
        
        <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2b6cb0;">
          <h2 style="color: #2b6cb0; margin-top: 0;">Prijsinformatie</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px;"><strong>Berekende richtprijs:</strong></td>
              <td style="padding: 8px; color: #2b6cb0; font-weight: bold;">${formatCurrency(data.totalPrice || 0)} excl. btw</td>
            </tr>
            ${data.wantsToBuyTiles && data.tilePricePerSqm ? `
              <tr>
                <td style="padding: 8px;"><strong>Tegelprijs per m²:</strong></td>
                <td style="padding: 8px;">${formatCurrency(data.tilePricePerSqm)}</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>M² met snijverlies:</strong></td>
                <td style="padding: 8px;">${data.squareMetersWithCuttingLoss} m²</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Totale tegelkost:</strong></td>
                <td style="padding: 8px;">${formatCurrency(data.tileCost || 0)}</td>
              </tr>
            ` : ''}
          </table>
        </div>
        
        ${projectImagesHTML}
        
        ${data.additionalNotes ? `
        <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2b6cb0;">
          <h2 style="color: #2b6cb0; margin-top: 0;">Uw opmerkingen</h2>
          <p style="margin-bottom: 0;">${data.additionalNotes}</p>
        </div>
        ` : ''}
        
        <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2b6cb0;">
          <h2 style="color: #2b6cb0; margin-top: 0;">Wat gebeurt er nu?</h2>
          <p>Een van onze vakmensen zal binnen 48 uur contact met u opnemen om uw project te bespreken.</p>
          
          ${data.wantsSiteVisit ? `
          <p><strong>U heeft een plaatsbezoek aangevraagd.</strong> We zullen met u een geschikte datum en tijdstip afspreken.</p>
          ` : ''}
          
          ${data.wantsShowroomVisit ? `
          <p><strong>U heeft een showroom bezoek aangevraagd.</strong> We zullen u informeren over de mogelijkheden.</p>
          ` : ''}
        </div>
        
        <p>Heeft u in de tussentijd vragen? Aarzel niet om ons te contacteren via <a href="mailto:info@nieuwevloer.be">info@nieuwevloer.be</a> of bel ons op 09 273 76 13.</p>
        
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
