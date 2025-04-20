
import { useNavigate, useLocation } from "react-router-dom";

export const useAdminNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    // Special case for root admin path
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    
    // For other admin paths, check if the current path starts with the given path
    // This ensures that sub-pages also show their parent as active
    return path !== '/admin' && location.pathname.startsWith(path);
  };

  return {
    handleNavigation,
    isActive,
    currentPath: location.pathname
  };
};

