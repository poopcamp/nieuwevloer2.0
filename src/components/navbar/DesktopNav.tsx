
import NavLink from './NavLink';
import { Button } from '@/components/ui/button';

interface DesktopNavProps {
  textColorClass: string;
  isAdmin?: boolean;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ textColorClass, isAdmin = false }) => {
  return (
    <div className="hidden md:flex items-center space-x-6">
      <NavLink to="/" className={textColorClass}>
        Home
      </NavLink>
      <NavLink to="/diensten" className={textColorClass}>
        Diensten
      </NavLink>
      <NavLink to="/configurator" className={textColorClass}>
        Configurator
      </NavLink>
      <NavLink to="/projecten" className={textColorClass}>
        Projecten
      </NavLink>
      <NavLink to="/gids" className={textColorClass}>
        Tegels gids
      </NavLink>
      <NavLink to="/blog" className={textColorClass}>
        Blog
      </NavLink>
      <NavLink to="/contact" className={textColorClass}>
        Contact
      </NavLink>
      
      {isAdmin && (
        <Button asChild variant="outline" size="sm" className={`${textColorClass} border-current`}>
          <NavLink to="/admin" className={textColorClass}>
            Admin
          </NavLink>
        </Button>
      )}
    </div>
  );
};

export default DesktopNav;
