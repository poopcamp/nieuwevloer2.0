
/**
 * Generate the HTML for the admin email footer
 */
export function adminEmailFooter(): string {
  return `
    <div style="margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 15px;">
      <p>
        Dit is een automatisch gegenereerd bericht van het NieuweVloer.be configuratie systeem.<br>
        Neem snel contact op met deze klant voor de beste kans op conversie.
      </p>
    </div>
  `;
}

/**
 * Generate the HTML for the customer email footer
 */
export function customerEmailFooter(): string {
  return `
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
      <p>
        NieuweVloer.be | Industrielaan 9, 9990 Maldegem | 09 273 76 13<br>
        <a href="https://nieuwevloer.be" style="color: #2b6cb0;">www.nieuwevloer.be</a>
      </p>
    </div>
  `;
}
