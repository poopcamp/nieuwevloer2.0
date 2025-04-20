
import { Link } from "react-router-dom";

interface NavLinkProps {
  to: string;
  className?: string;
  children: React.ReactNode;
}

const NavLink = ({ to, className = "", children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 hover:text-gray-900 ${className}`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
