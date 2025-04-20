
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  isOpen: boolean;
  toggleMenu: () => void;
  textColorClass: string;
}

const MobileMenuButton = ({ isOpen, toggleMenu, textColorClass }: MobileMenuButtonProps) => {
  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className={textColorClass}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Sluit menu" : "Open menu"}
        aria-controls="mobile-menu"
        style={{ 
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none'
        }}
      >
        {isOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
};

export default MobileMenuButton;
