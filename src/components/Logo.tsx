
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  textColor?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  textColor = 'text-gray-800', 
  size = 'md',
  showText = true 
}) => {
  // Size mappings
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const logoSize = sizeClasses[size];
  const textSize = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl';

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`} aria-label="NieuweVloer.be Home">
      <div className={`${logoSize}`}>
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          <rect x="10" y="10" width="80" height="80" stroke="currentColor" strokeWidth="10" fill="none" />
          <rect x="10" y="100" width="80" height="80" stroke="currentColor" strokeWidth="10" fill="none" />
          <rect x="100" y="10" width="80" height="170" stroke="currentColor" strokeWidth="10" fill="none" />
        </svg>
      </div>
      
      {showText && (
        <span className={`font-bold ${textSize} ${textColor}`}>
          NieuweVloer.be
        </span>
      )}
    </Link>
  );
};

export default Logo;
