
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  bgColor?: string;
}

export const PageHeader = ({ title, subtitle, bgColor = 'bg-primary-50' }: PageHeaderProps) => {
  return (
    <div className={`${bgColor} py-12 px-4`}>
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-3">{title}</h1>
        {subtitle && (
          <p className="text-lg text-primary-700">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
