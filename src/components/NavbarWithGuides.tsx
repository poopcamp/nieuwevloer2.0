
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "@/contexts/auth-context";
import DesktopNav from "./navbar/DesktopNav";
import MobileNav from "./navbar/MobileNav";
import MobileMenuButton from "./navbar/MobileMenuButton";

export const NavbarWithGuides = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
    
    // Prevent scrolling when mobile menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [location.pathname, isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isHomePage = location.pathname === "/";

  // Text color based on scroll state and current page
  const textColorClass = isScrolled || !isHomePage
    ? "text-gray-800"
    : "text-white";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ 
        backgroundColor: isScrolled ? 'white' : isHomePage ? 'transparent' : 'white',
        boxShadow: isScrolled ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
      }}
      aria-label="Hoofdnavigatie"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo with "Vakman sinds 2017" */}
          <div className="flex items-center">
            <Logo textColor={textColorClass} />
            <span className={`text-xs md:text-sm ml-2 font-medium ${textColorClass} opacity-80`}>
              Vakman sinds 2017
            </span>
          </div>

          {/* Desktop Navigation */}
          <DesktopNav textColorClass={textColorClass} isAdmin={isAdmin} />

          {/* Mobile menu button */}
          <MobileMenuButton 
            isOpen={isMenuOpen} 
            toggleMenu={toggleMenu} 
            textColorClass={textColorClass} 
          />
        </div>
      </div>

      {/* Mobile menu */}
      <MobileNav 
        isOpen={isMenuOpen} 
        isHomePage={isHomePage} 
        isScrolled={isScrolled} 
        isAdmin={isAdmin} 
      />
    </nav>
  );
};
