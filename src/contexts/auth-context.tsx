
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: any | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>; // Add this property
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
  refreshAuth: async () => {}, // Add this property
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Implement actual login logic here
      setUser({ email, role: 'admin' });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Implement actual logout logic here
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add refreshAuth function
  const refreshAuth = async () => {
    setIsLoading(true);
    try {
      // Implement actual refresh logic here
      // For now, just check if user exists
      console.log('Refreshing auth state...');
      if (user) {
        // Refresh user data if needed
      }
    } catch (error) {
      console.error('Auth refresh error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        logout,
        refreshAuth, // Add this property
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
