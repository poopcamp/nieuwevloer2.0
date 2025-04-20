
// Re-exports from the various email utility files
export { 
  sendEmailRequest 
} from './emailService';

export { 
  sendTestEmail 
} from './testEmail';

export {
  EMAIL_TYPES
} from './config';

// Export types with proper TypeScript syntax
export type { 
  EmailResponse,
  EmailRequestPayload,
  EdgeFunctionResponse,
  EmailSendOptions
} from './types';
