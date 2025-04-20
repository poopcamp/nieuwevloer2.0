
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import AdminLayout from './AdminLayout';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // Eenvoudige loading state tijdens het laden van de auth status
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner size="lg" />
        <p className="ml-4 text-gray-600">Even geduld...</p>
      </div>
    );
  }
  
  // Indien niet ingelogd, doorsturen naar login pagina
  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  
  // Indien ingelogd, altijd toegang geven
  return <AdminLayout>{children}</AdminLayout>;
};

export default ProtectedRoute;
