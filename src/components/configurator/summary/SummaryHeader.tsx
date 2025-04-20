
import React from "react";

interface SummaryHeaderProps {
  title?: string;
  subtitle?: string;
}

const SummaryHeader = ({ 
  title = "Uw offerte", 
  subtitle = "Richtprijs exclusief BTW en tegels" 
}: SummaryHeaderProps) => {
  return (
    <div className="border-b border-gray-200 px-4 py-4">
      <h3 className="font-bold text-primary text-xl">{title}</h3>
      <p className="text-sm text-gray-600">{subtitle}</p>
      <div className="mt-2 text-xs text-gray-500 italic">
        Prijzen zijn vrijblijvend en geldig voor 30 dagen
      </div>
    </div>
  );
};

export default SummaryHeader;
