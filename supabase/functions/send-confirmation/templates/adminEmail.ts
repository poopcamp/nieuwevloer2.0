import { EmailData } from "./types.ts";
import { formatCurrency } from "../utils.ts";

export function buildAdminEmail(data: EmailData): string {
  // Extract project details based on project type
  let projectDetailsHTML = '';
  
  if (data.projectType === 'vloer') {
    projectDetailsHTML = `
      <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Type project:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">Vloer</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Oppervlakte:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.squareMeters} m²</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Vloertype:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.floorType || 'Niet gespecificeerd'}</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Tegelformaat:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.tileSize || 'Niet gespecificeerd'}</td></tr>
    `;
  } else if (data.projectType === 'keukenwand') {
    projectDetailsHTML = `
      <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Type project:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">Keukenwand</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Oppervlakte:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.squareMeters} m²</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Wandtype:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.wallType || 'Niet gespecificeerd'}</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Tegelformaat:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.wallTileSize || 'Niet gespecificeerd'}</td></tr>
    `;
  } else if (data.projectType === 'badkamer') {
    projectDetailsHTML = `
      <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Type project:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">Badkamer</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Oppervlakte:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.squareMeters} m²</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Tegelformaat:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.bathroomTileSize || 'Niet gespecificeerd'}</td></tr>
    `;
    
    if (data.showerNis) {
      projectDetailsHTML += `
        <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Douchenis:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">Ja</td></tr>
      `;
      
      if (data.showerNisSize) {
        projectDetailsHTML += `
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Afmeting douchenis:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.showerNisSize}</td></tr>
        `;
      } else if (data.showerNisCustomSize) {
        projectDetailsHTML += `
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Afmeting douchenis:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.showerNisCustomSize}</td></tr>
        `;
      }
    }
    
    if (data.fullBathroomRenovation) {
      projectDetailsHTML += `
        <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Complete badkamerrenovatie:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">Ja</td></tr>
      `;
    }
  } else {
    projectDetailsHTML = `
      <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Type project:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.projectType || 'Tegelproject'}</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Oppervlakte:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.squareMeters} m²</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Beschrijving:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.otherDescription || 'Geen beschrijving'}</td></tr>
    `;
  }
  
  // Add extra options section if any options were selected
  const hasExtraOptions = data.needsPlinths || data.needsChape || data.needsElectrician;
  
  let extraOptionsHTML = '';
  if (hasExtraOptions) {
    extraOptionsHTML = `
      <tr>
        <td colspan="2" style="padding: 8px; background-color: #f8f9fa; font-weight: bold; border-bottom: 1px solid #ddd;">Extra opties:</td>
      </tr>
    `;
    
    if (data.needsPlinths) {
      extraOptionsHTML += `
        <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Plinten plaatsen:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">Ja</td></tr>
      `;
    }
    
    if (data.needsChape) {
      extraOptionsHTML += `
        <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Chapewerken:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">Ja</td></tr>
      `;
    }
    
    if (data.needsElectrician) {
      extraOptionsHTML += `
        <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Elektricien nodig:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">Ja</td></tr>
      `;
    }
  }
  
  // Add visit options if selected
  let visitOptionsHTML = '';
  if (data.wantsSiteVisit || data.wantsShowroomVisit) {
    visitOptionsHTML = `
      <tr>
        <td colspan="2" style="padding: 8px; background-color: #f8f9fa; font-weight: bold; border-bottom: 1px solid #ddd;">Afspraken:</td>
      </tr>
    `;
    
    if (data.wantsSiteVisit) {
      visitOptionsHTML += `
        <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Plaatsbezoek:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">Gewenst</td></tr>
        ${data.addressStreet || data.addressCity ? `
        <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Adres:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.addressStreet || ''}<br>${data.addressCity || ''}</td></tr>
        ` : ''}
      `;
    }
    
    if (data.wantsShowroomVisit) {
      visitOptionsHTML += `
        <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Showroom bezoek:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">Gewenst</td></tr>
      `;
    }
  }
  
  // Add project image section
  let projectImagesHTML = '';
  if (data.imageUrl) {
    projectImagesHTML = `
      <div style="margin: 20px 0;">
        <h3 style="color: #2b6cb0;">Project foto's</h3>
        <img src="${data.imageUrl}" alt="Project afbeelding" style="max-width: 100%; border-radius: 5px; border: 1px solid #e2e8f0;">
      </div>
    `;
  }
  
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
            ${visitOptionsHTML}
          </table>
        </div>
        
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
        
        ${projectImagesHTML}
        
        ${data.additionalNotes ? `
        <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2b6cb0;">
          <h2 style="color: #2b6cb0; margin-top: 0;">Klant opmerkingen</h2>
          <p style="margin-bottom: 0;">${data.additionalNotes}</p>
        </div>
        ` : ''}
      </div>
    </body>
  </html>
  `;
}
