
// Error handling utilities for email service

/**
 * Create a standardized network error
 */
export function createNetworkError(originalError: any) {
  return {
    name: 'EmailError',
    message: 'Netwerkfout bij het verzenden van de e-mail',
    cause: originalError,
    code: 'NETWORK_ERROR',
  };
}

/**
 * Create a standardized service error
 */
export function createServiceError(details: { error: string, status?: number, rawResponse?: string, responseText?: string }) {
  return {
    name: 'EmailError',
    message: `Fout bij e-mailservice: ${details.error}`,
    cause: details,
    code: 'SERVICE_ERROR',
  };
}

/**
 * Create a standardized timeout error
 */
export function createTimeoutError() {
  return {
    name: 'EmailError',
    message: 'Timeout bij het verzenden van de e-mail',
    code: 'TIMEOUT',
  };
}

/**
 * Format error details for consistent logging and reporting
 */
export function getFormattedErrorDetails(error: any) {
  return {
    name: error.name || 'UnknownError',
    message: error.message || 'Unknown error occurred',
    code: error.code || 'UNKNOWN',
    cause: error.cause || null,
    stack: error.stack || null,
  };
}
