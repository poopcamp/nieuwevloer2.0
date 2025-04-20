
import { EmailData } from "../types.ts";

/**
 * Generate HTML for project details based on the project type
 */
export function getProjectDetailsHTML(data: EmailData): string {
  if (data.projectType === 'vloer') {
    return `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Type project:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Vloer</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Oppervlakte:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.squareMeters} m²</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Vloertype:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.floorType || 'Niet gespecificeerd'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Tegelformaat:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.tileSize || 'Niet gespecificeerd'}</td>
      </tr>
    `;
  } else if (data.projectType === 'keukenwand') {
    return `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Type project:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Keukenwand</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Oppervlakte:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.squareMeters} m²</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Wandtype:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.wallType || 'Niet gespecificeerd'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Tegelformaat:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.wallTileSize || 'Niet gespecificeerd'}</td>
      </tr>
    `;
  } else if (data.projectType === 'badkamer') {
    let html = `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Type project:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Badkamer</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Oppervlakte:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.squareMeters} m²</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Tegelformaat:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.bathroomTileSize || 'Niet gespecificeerd'}</td>
      </tr>
    `;
    
    if (data.showerNis) {
      html += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Douchenis:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">Ja</td>
        </tr>
      `;
      
      if (data.showerNisSize) {
        html += `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Afmeting douchenis:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.showerNisSize}</td>
          </tr>
        `;
      } else if (data.showerNisCustomSize) {
        html += `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Afmeting douchenis:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.showerNisCustomSize}</td>
          </tr>
        `;
      }
    }
    
    if (data.fullBathroomRenovation) {
      html += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Complete badkamerrenovatie:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">Ja</td>
        </tr>
      `;
    }
    
    return html;
  } else if (data.projectType === 'other' || data.projectType === 'anders') {
    return `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Type project:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Anders</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Beschrijving:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.otherDescription || 'Geen beschrijving'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Oppervlakte:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.squareMeters} m²</td>
      </tr>
    `;
  } else if (data.projectType === 'quick_calculator' || data.projectType === 'test_email') {
    return `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Type project:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Snelle calculator</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Oppervlakte:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.squareMeters || 0} m²</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Tegelformaat:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.tileSize || 'Niet gespecificeerd'}</td>
      </tr>
    `;
  } else {
    return `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Type project:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.projectType || 'Tegelproject'}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Oppervlakte:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.squareMeters || 0} m²</td>
      </tr>
    `;
  }
}

/**
 * Generate HTML for extra options
 */
export function getExtraOptionsHTML(data: EmailData): string {
  const hasExtraOptions = data.needsPlinths || data.needsChape || data.needsElectrician;
  
  if (!hasExtraOptions) return '';
  
  let html = `
    <tr>
      <td colspan="2" style="padding: 8px; background-color: #f8f9fa; font-weight: bold;">Extra opties:</td>
    </tr>
  `;
  
  if (data.needsPlinths) {
    html += `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Plinten plaatsen:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Ja</td>
      </tr>
    `;
  }
  
  if (data.needsChape) {
    html += `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Chapewerken:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Ja</td>
      </tr>
    `;
  }
  
  if (data.needsElectrician) {
    html += `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Elektricien nodig:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Ja</td>
      </tr>
    `;
  }
  
  return html;
}

/**
 * Generate HTML for visit options
 */
export function getVisitOptionsHTML(data: EmailData): string {
  let html = '';
  
  if (data.wantsSiteVisit) {
    html += `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Plaatsbezoek gewenst:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Ja</td>
      </tr>
    `;
    
    if (data.addressStreet && data.addressCity) {
      html += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Adres:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.addressStreet}, ${data.addressCity}</td>
        </tr>
      `;
    }
  }
  
  if (data.wantsShowroomVisit) {
    html += `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Showroom bezoek gewenst:</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Ja</td>
      </tr>
    `;
  }
  
  return html;
}

/**
 * Generate HTML for project images
 */
export function getProjectImagesHTML(data: EmailData): string {
  if (!data.imageUrl) return '';
  
  return `
    <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2b6cb0;">
      <h2 style="color: #2b6cb0; margin-top: 0;">Projectafbeeldingen</h2>
      <img src="${data.imageUrl}" alt="Projectafbeelding" style="max-width: 100%; border-radius: 5px;">
    </div>
  `;
}
