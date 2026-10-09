
import { useNavigate, useLocation } from "react-router-dom";
import { isPathActive } from "@/seo/links.mjs";

export const useAdminNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => isPathActive(location.pathname, path);

  return {
    handleNavigation,
    isActive,
    currentPath: location.pathname
  };
};

