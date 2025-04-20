
import { useState, useEffect, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { authService } from "@/services/auth/authService";

/**
 * Hook for managing authentication state
 * Refactored to use the centralized auth service
 */
export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [lastAdminCheck, setLastAdminCheck] = useState<number>(0);
  const [adminCheckInProgress, setAdminCheckInProgress] = useState(false);

  // Handle auth state change
  const handleAuthChange = useCallback(async (newSession: Session | null) => {
    console.log("[useAuthState] Handling auth change:", newSession ? "Session present" : "No session");
    
    if (newSession?.user) {
      // Simplified admin check - any authenticated user is considered an admin
      setIsAdmin(true);
      setLastAdminCheck(Date.now());
      setIsLoading(false);
      setAdminCheckInProgress(false);
      setAuthInitialized(true);
    } else {
      console.log("[useAuthState] No user authenticated");
      setIsAdmin(false);
      setIsLoading(false);
      setAdminCheckInProgress(false);
      setAuthInitialized(true);
    }
  }, []);

  // Refresh auth state manually
  const refreshAuth = useCallback(async () => {
    try {
      console.log("[useAuthState] Refreshing auth state manually");
      setIsLoading(true);
      setAdminCheckInProgress(true);
      
      // Get current session using the auth service
      const currentSession = await authService.getCurrentSession();
      
      // Update state with session data
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Set admin status based on whether user is authenticated
      if (currentSession?.user) {
        console.log("[useAuthState] User found during refresh, setting admin to true");
        setIsAdmin(true);
        setLastAdminCheck(Date.now());
      } else {
        setIsAdmin(false);
        console.log("[useAuthState] No user found during refresh, clearing admin status");
      }
    } catch (error) {
      console.error("[useAuthState] Error refreshing auth:", error);
    } finally {
      setIsLoading(false);
      setAdminCheckInProgress(false);
    }
  }, []);

  // Initialize auth on component mount
  useEffect(() => {
    console.log("[useAuthState] Setting up auth...");
    
    // Initialize auth
    const initializeAuth = async () => {
      try {
        console.log("[useAuthState] Initializing auth");
        setAdminCheckInProgress(true);
        
        // Setup auth listener using the auth service
        const unsubscribe = authService.setupAuthListener(
          setSession,
          setUser,
          handleAuthChange
        );
        
        // Initial session check
        const initialSession = await authService.getCurrentSession();
        console.log("[useAuthState] Initial session:", initialSession ? "Present" : "None");
        
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          console.log("[useAuthState] Initial session has user, setting admin to true");
          setIsAdmin(true);
          setLastAdminCheck(Date.now());
        }
        
        // Mark auth as initialized and loading as complete
        setAuthInitialized(true);
        setIsLoading(false);
        setAdminCheckInProgress(false);
        
        return unsubscribe;
      } catch (error) {
        console.error("[useAuthState] Error during initialization:", error);
        setAuthInitialized(true);
        setIsLoading(false);
        setAdminCheckInProgress(false);
        return () => {};
      }
    };
    
    // Initialize auth and store cleanup function
    const authCleanup = initializeAuth();
    
    // Return cleanup function
    return () => {
      authCleanup.then(cleanup => cleanup());
    };
  }, [handleAuthChange]);

  // For debugging - log state changes
  useEffect(() => {
    console.log("[useAuthState] Auth state updated:", {
      isLoading, 
      isAdmin, 
      hasUser: !!user,
      hasSession: !!session,
      authInitialized,
      userId: user?.id,
      adminCheckInProgress,
      lastAdminCheck: lastAdminCheck ? new Date(lastAdminCheck).toISOString() : 'never'
    });
  }, [isLoading, isAdmin, user, session, authInitialized, lastAdminCheck, adminCheckInProgress]);

  return {
    user,
    session,
    isLoading,
    isAdmin,
    authInitialized,
    refreshAuth
  };
};
