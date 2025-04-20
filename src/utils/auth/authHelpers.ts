
/**
 * This file exports all auth-related helpers from their respective modules
 * for backward compatibility with existing imports
 */

// Admin helpers
export { checkIsAdmin, addAdminRole } from './adminHelpers';

// Authentication helpers
export { signInWithEmail } from './emailAuth';
export { signOut } from './sessionManagement';
export { registerWithRecoveryCode } from './registrationHelpers';

// Password management helpers
export { 
  sendRecoveryEmail, 
  updatePassword 
} from './passwordHelpers';
