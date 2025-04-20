
import React from "react";
import { ConfiguratorState } from "../types";

interface PriceBreakdownProps {
  isRequestPrice: boolean;
  breakdown: { label: string; amount: string }[];
}

const PriceBreakdown = ({ isRequestPrice, breakdown }: PriceBreakdownProps) => {
  // As per client request, we never show the price breakdown
  return null;
};

export default PriceBreakdown;
