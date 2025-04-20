
/**
 * Standardized error handling utilities
 */

export interface ServiceError {
  message: string;
  code?: string;
  originalError?: any;
}

/**
 * Create a standardized service error
 */
export function createServiceError(message: string, originalError?: any, code?: string): ServiceError {
  return {
    message,
    code,
    originalError
  };
}

/**
 * Format error for logging
 */
export function formatErrorForLogging(error: any): Record<string, any> {
  if (error?.originalError) {
    return {
      message: error.message,
      code: error.code,
      originalError: error.originalError?.message || String(error.originalError),
      stack: error.originalError?.stack
    };
  }
  
  return {
    message: error?.message || String(error),
    stack: error?.stack,
    code: error?.code
  };
}

/**
 * Handle service errors consistently
 * @param error The error to handle
 * @param context Optional context information
 * @param fallbackMessage Default message if none is provided
 */
export function handleServiceError(
  error: any, 
  context: string,
  fallbackMessage = 'An unexpected error occurred'
): ServiceError {
  // Log the error with context
  console.error(`Error in ${context}:`, formatErrorForLogging(error));
  
  // Return a standardized error
  return createServiceError(
    error?.message || fallbackMessage,
    error,
    error?.code
  );
}

/**
 * Extract user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  return error?.message || 'An unexpected error occurred';
}
