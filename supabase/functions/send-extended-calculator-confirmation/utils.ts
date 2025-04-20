
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function constructStatusMessage(customerEmailResponse: any, adminEmailResponse: any): string {
  if (!customerEmailResponse.error && !adminEmailResponse.error) {
    return "Beide e-mails succesvol verzonden";
  }
  
  if (customerEmailResponse.error && adminEmailResponse.error) {
    return "Geen e-mails konden worden verzonden";
  }
  
  if (customerEmailResponse.error) {
    return "Admin e-mail verzonden, klant e-mail mislukt";
  }
  
  return "Klant e-mail verzonden, admin e-mail mislukt";
}
