
import React from 'react';
import { Link } from 'react-router-dom';

interface MobileNavLinkProps {
  to: string;
  children: React.ReactNode;
  textColorClass: string;
  className?: string;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ 
  to, 
  children, 
  textColorClass,
  className = "" 
}) => {
  return (
    <Link
      to={to}
      className={`block w-full px-4 py-2 text-base font-medium ${textColorClass} hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors ${className}`}
    >
      {children}
    </Link>
  );
};

export default MobileNavLink;
