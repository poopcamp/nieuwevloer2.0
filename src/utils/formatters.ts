
/**
 * Format a number as currency in Euro (Belgium format)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a date in Belgian format (DD/MM/YYYY)
 */
export const formatDate = (date: Date): string => {
  return new Intl.NumberFormat('nl-BE').format(date.getDate()) + '/' +
         new Intl.NumberFormat('nl-BE').format(date.getMonth() + 1) + '/' +
         date.getFullYear();
};

/**
 * Format a string to capitalize first letter
 */
export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Format a number as area in square meters
 */
export const formatArea = (area: number): string => {
  return `${area} m²`;
};
