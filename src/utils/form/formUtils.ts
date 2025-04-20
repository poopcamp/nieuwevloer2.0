
/**
 * Generic form state handler for controlled inputs
 */
export function handleFormChange<T>(
  setter: React.Dispatch<React.SetStateAction<T>>,
  field: keyof T,
  value: any
): void {
  setter(prevState => ({
    ...prevState,
    [field]: value
  }));
}

/**
 * Helper function to validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Helper function to validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  // Allow various formats including international and local Belgian formats
  const phoneRegex = /^(?:\+|00)?[0-9\s-()]{8,20}$/;
  return phoneRegex.test(phone);
}

/**
 * Helper function to validate required fields in a form
 */
export function validateRequiredFields<T extends Record<string, any>>(
  data: T,
  requiredFields: Array<keyof T>
): { isValid: boolean, errors: Partial<Record<keyof T, string>> } {
  const errors: Partial<Record<keyof T, string>> = {};
  let isValid = true;
  
  for (const field of requiredFields) {
    const value = data[field];
    
    if (value === undefined || value === null || value === '') {
      errors[field] = 'Dit veld is verplicht';
      isValid = false;
    } else if (field === 'email' && !isValidEmail(value as string)) {
      errors[field] = 'Ongeldig e-mailadres';
      isValid = false;
    } else if (field === 'phone' && !isValidPhone(value as string)) {
      errors[field] = 'Ongeldig telefoonnummer';
      isValid = false;
    }
  }
  
  return { isValid, errors };
}
