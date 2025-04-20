
import React from "react";

interface SummaryDetailProps {
  label: string;
  value: React.ReactNode;
}

const SummaryDetail = ({ label, value }: SummaryDetailProps) => {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
};

export default SummaryDetail;
