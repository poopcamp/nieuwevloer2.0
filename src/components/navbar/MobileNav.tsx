
import MobileNavLink from './MobileNavLink';
import { Button } from '@/components/ui/button';

interface MobileNavProps {
  isOpen: boolean;
  isHomePage: boolean;
  isScrolled: boolean;
  isAdmin?: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ 
  isOpen, 
  isHomePage, 
  isScrolled,
  isAdmin = false 
}) => {
  // Background color based on scroll state and current page
  const bgColorClass = isScrolled || !isHomePage
    ? "bg-white"
    : "bg-gradient-to-b from-black/70 to-black/40 backdrop-blur-lg";
  
  // Text color class based on scroll state and current page
  const textColorClass = isScrolled || !isHomePage
    ? "text-gray-800"
    : "text-white";
  
  return (
    <div
      className={`
        md:hidden fixed inset-x-0 top-16 z-40 overflow-y-auto
        transform transition-all duration-300 ease-in-out
        ${isOpen ? "translate-y-0 opacity-100" : "translate-y-[-100%] opacity-0"}
        ${bgColorClass}
        h-[calc(100vh-4rem)]
      `}
      style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
    >
      <div className="container mx-auto px-4 pt-4 pb-8 flex flex-col items-start space-y-4">
        <MobileNavLink to="/" textColorClass={textColorClass}>
          Home
        </MobileNavLink>
        <MobileNavLink to="/diensten" textColorClass={textColorClass}>
          Diensten
        </MobileNavLink>
        <MobileNavLink to="/configurator" textColorClass={textColorClass}>
          Configurator
        </MobileNavLink>
        <MobileNavLink to="/projecten" textColorClass={textColorClass}>
          Projecten
        </MobileNavLink>
        <MobileNavLink to="/gids" textColorClass={textColorClass}>
          Tegels gids
        </MobileNavLink>
        <MobileNavLink to="/blog" textColorClass={textColorClass}>
          Blog
        </MobileNavLink>
        <MobileNavLink to="/contact" textColorClass={textColorClass}>
          Contact
        </MobileNavLink>
        
        {isAdmin && (
          <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 w-full">
            <Button asChild variant="default" className="w-full">
              <MobileNavLink to="/admin" textColorClass={textColorClass}>
                Admin Dashboard
              </MobileNavLink>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNav;
