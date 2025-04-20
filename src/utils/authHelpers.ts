
/**
 * This file exports all auth-related helpers from their respective modules
 * for backward compatibility with existing imports
 */

// Admin helpers
export { checkIsAdmin, addAdminRole } from './auth/adminHelpers';

// Authentication helpers
export { signInWithEmail, signOut } from './auth/authenticationHelpers';
export { registerWithRecoveryCode } from './auth/registrationHelpers';

// Password management helpers
export { 
  sendRecoveryEmail, 
  updatePassword 
} from './auth/passwordHelpers';
