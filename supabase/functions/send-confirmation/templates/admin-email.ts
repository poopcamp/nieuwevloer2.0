
import { EmailData } from './types.ts';
import { formatPrice, formatProjectType, formatTileSize } from '../utils.ts';

/**
 * Build email HTML for admin notifications
 */
export function buildAdminNotificationEmail(data: EmailData): string {
  const isQuickCalculator = data.projectType === "quick_calculator";
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${isQuickCalculator ? 'Nieuwe prijsindicatie aanvraag' : 'Nieuwe tegelaanvraag'}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header { 
      background-color: #1e3a8a;
      padding: 20px;
      text-align: center;
      border-radius: 5px 5px 0 0;
    }
    .header img {
      max-width: 200px;
    }
    .content {
      background-color: #f9fafb;
      padding: 20px;
      border-left: 1px solid #e5e7eb;
      border-right: 1px solid #e5e7eb;
    }
    .footer {
      background-color: #f3f4f6;
      padding: 15px 20px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
      border-radius: 0 0 5px 5px;
      border: 1px solid #e5e7eb;
    }
    h1 {
      color: #1e3a8a;
      font-size: 24px;
      margin-bottom: 20px;
    }
    h2 {
      font-size: 18px;
      margin-top: 25px;
      margin-bottom: 10px;
      color: #1e3a8a;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    table td {
      padding: 8px 5px;
      border-bottom: 1px solid #e5e7eb;
    }
    table tr:last-child td {
      border-bottom: none;
    }
    .label {
      font-weight: bold;
      width: 40%;
    }
    .price {
      font-weight: bold;
      font-size: 18px;
      color: #1e3a8a;
    }
    .highlight {
      background-color: #dbeafe;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
      border-left: 4px solid #1e3a8a;
    }
    .priority {
      background-color: #fee2e2;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
      border-left: 4px solid #dc2626;
    }
    .cta {
      display: inline-block;
      background-color: #1e3a8a;
      color: white;
      text-decoration: none;
      padding: 12px 20px;
      border-radius: 5px;
      margin: 15px 0;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/logo/NieuweVloer_white.png" alt="NieuweVloer.be Logo">
  </div>
  
  <div class="content">
    <h1>${isQuickCalculator ? 'Nieuwe snelle prijsindicatie aanvraag' : 'Nieuwe tegelaanvraag'}</h1>
    
    ${data.wantsSiteVisit || data.wantsShowroomVisit ? `
    <div class="${data.wantsSiteVisit ? 'priority' : 'highlight'}">
      <p><strong>⚠️ Afspraak gewenst</strong></p>
      ${data.wantsSiteVisit ? `<p>Deze klant wil graag een plaatsbezoek inplannen.</p>` : ''}
      ${data.wantsShowroomVisit ? `<p>Deze klant wil graag een showroombezoek inplannen.</p>` : ''}
    </div>` : ''}
    
    <h2>Klantgegevens</h2>
    <table>
      <tr>
        <td class="label">Naam</td>
        <td>${data.name}</td>
      </tr>
      <tr>
        <td class="label">E-mail</td>
        <td><a href="mailto:${data.email}">${data.email}</a></td>
      </tr>
      <tr>
        <td class="label">Telefoon</td>
        <td><a href="tel:${data.phone}">${data.phone}</a></td>
      </tr>
      ${data.wantsSiteVisit && data.addressStreet && data.addressCity ? `
      <tr>
        <td class="label">Adres</td>
        <td>${data.addressStreet}, ${data.addressCity}</td>
      </tr>` : ''}
    </table>
    
    <h2>Projectinformatie</h2>
    <table>
      <tr>
        <td class="label">Type project</td>
        <td>${formatProjectType(data.projectType)}</td>
      </tr>
      ${data.squareMeters ? `
      <tr>
        <td class="label">Oppervlakte</td>
        <td>${data.squareMeters} m²</td>
      </tr>` : ''}
      ${data.tileSize ? `
      <tr>
        <td class="label">Tegelformaat</td>
        <td>${formatTileSize(data.tileSize)}</td>
      </tr>` : ''}
      ${data.totalPrice ? `
      <tr>
        <td class="label">Prijsindicatie</td>
        <td class="price">€ ${formatPrice(data.totalPrice)}</td>
      </tr>` : ''}
    </table>
    
    ${!isQuickCalculator && data.projectType === 'badkamer' && data.bathroomOptions ? `
    <h2>Badkamer opties</h2>
    <table>
      <tr>
        <td class="label">Volledige renovatie</td>
        <td>${data.fullBathroomRenovation ? 'Ja' : 'Nee'}</td>
      </tr>
      <tr>
        <td class="label">Douchenis</td>
        <td>${data.showerNis ? `Ja${data.showerNisSize ? `, formaat: ${data.showerNisSize === 'custom' ? data.showerNisCustomSize : data.showerNisSize}` : ''}` : 'Nee'}</td>
      </tr>
    </table>` : ''}
    
    ${data.wantsToBuyTiles ? `
    <h2>Tegelaankoop</h2>
    <table>
      <tr>
        <td class="label">Wil tegels aankopen</td>
        <td>Ja</td>
      </tr>
      ${data.tilePricePerSqm ? `
      <tr>
        <td class="label">Prijs per m²</td>
        <td>€ ${formatPrice(data.tilePricePerSqm)}</td>
      </tr>` : ''}
      ${data.squareMetersWithCuttingLoss ? `
      <tr>
        <td class="label">M² incl. snijverlies</td>
        <td>${data.squareMetersWithCuttingLoss} m²</td>
      </tr>` : ''}
      ${data.tileCost ? `
      <tr>
        <td class="label">Tegelkosten</td>
        <td>€ ${formatPrice(data.tileCost)}</td>
      </tr>` : ''}
    </table>` : ''}
    
    ${data.additionalNotes ? `
    <h2>Opmerkingen van klant</h2>
    <p>${data.additionalNotes}</p>` : ''}
    
    ${data.imageUrl ? `
    <h2>Opgeladen afbeelding</h2>
    <p><img src="${data.imageUrl}" alt="Project afbeelding" style="max-width: 100%; border-radius: 4px;"></p>` : ''}
  </div>
  
  <div class="footer">
    <p>Dit is een automatisch gegenereerde e-mail van het configuratiesysteem.</p>
    <p>© ${new Date().getFullYear()} NieuweVloer.be | Automatische notificatie</p>
  </div>
</body>
</html>
  `;
}
