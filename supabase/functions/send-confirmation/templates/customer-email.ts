
import { EmailData } from './types.ts';
import { formatPrice, formatProjectType, formatTileSize } from '../utils.ts';

/**
 * Build email HTML for customer confirmation
 */
export function buildCustomerEmail(data: EmailData): string {
  const isQuickCalculator = data.projectType === "quick_calculator";
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${isQuickCalculator ? 'Prijsindicatie' : 'Bevestiging'} van NieuweVloer.be</title>
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
    .banner {
      background-color: #dbeafe;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
      border-left: 4px solid #1e3a8a;
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
    .disclaimer {
      font-size: 11px;
      color: #6b7280;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/logo/NieuweVloer_white.png" alt="NieuweVloer.be Logo">
  </div>
  
  <div class="content">
    <h1>Beste ${data.name},</h1>
    
    ${isQuickCalculator ? 
      `<p>Bedankt voor uw interesse in onze diensten! We hebben uw aanvraag voor een snelle prijsindicatie ontvangen.</p>
       <p>Hieronder vindt u een overzicht van de prijsindicatie gebaseerd op de informatie die u heeft verstrekt:</p>`
      : 
      `<p>Bedankt voor uw interesse in onze diensten! We hebben uw aanvraag voor een tegelproject ontvangen.</p>
       <p>Hieronder vindt u een overzicht van uw aanvraag:</p>`
    }
    
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
    
    ${data.wantsSiteVisit || data.wantsShowroomVisit ? `
    <h2>Afspraak</h2>
    <table>
      ${data.wantsSiteVisit ? `
      <tr>
        <td class="label">Plaatsbezoek gewenst</td>
        <td>Ja</td>
      </tr>
      ${data.addressStreet && data.addressCity ? `
      <tr>
        <td class="label">Adres</td>
        <td>${data.addressStreet}, ${data.addressCity}</td>
      </tr>` : ''}` : ''}
      ${data.wantsShowroomVisit ? `
      <tr>
        <td class="label">Showroombezoek gewenst</td>
        <td>Ja</td>
      </tr>` : ''}
    </table>` : ''}
    
    ${data.additionalNotes ? `
    <h2>Uw opmerkingen</h2>
    <p>${data.additionalNotes}</p>` : ''}
    
    <div class="banner">
      <p><strong>Wat gebeurt er nu?</strong></p>
      <p>We nemen binnen 48 uur contact met u op om uw project te bespreken en eventuele vragen te beantwoorden. ${
        data.wantsSiteVisit ? 'We zullen ook een afspraak inplannen voor een plaatsbezoek.' : 
        data.wantsShowroomVisit ? 'We zullen ook een afspraak inplannen voor een showroombezoek.' : ''
      }</p>
    </div>
    
    <p>Heeft u ondertussen nog vragen? Neem gerust contact met ons op via <a href="mailto:info@nieuwevloer.be">info@nieuwevloer.be</a> of telefonisch op <a href="tel:+32476698329">+32 476 69 83 29</a>.</p>
    
    <p>Met vriendelijke groeten,<br>
    Het team van NieuweVloer.be</p>
    
    ${isQuickCalculator ? `
    <p class="disclaimer">* Dit is een richtprijs gebaseerd op de door u verstrekte informatie. De definitieve prijs kan variëren na een gedetailleerde opname en/of plaatsbezoek. Prijzen zijn exclusief tegels en exclusief BTW (6% bij renovatie ouder dan 10 jaar, anders 21%).</p>` : ''}
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} NieuweVloer.be | Vakmanschap sinds 2002</p>
    <p>Industrielaan 101, 9800 Deinze | BTW BE0727973482</p>
  </div>
</body>
</html>
  `;
}
