
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import StepIndicator from "./StepIndicator";
import { useState, useEffect } from "react";

interface ProgressCardProps {
  progress: number;
  currentStep: number;
  totalSteps: number;
}

const ProgressCard = ({ progress, currentStep, totalSteps }: ProgressCardProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  useEffect(() => {
    // Animate progress bar
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [progress]);
  
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-100 p-4 md:p-6 mb-6 bg-white">
      <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="space-y-1 mb-2 sm:mb-0">
          <h3 className="text-lg font-medium text-gray-800">Uw configuratie</h3>
          <p className="text-sm text-gray-500">Stap {currentStep} van {totalSteps}</p>
        </div>
        <span className="text-sm font-medium bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full inline-block">
          {Math.round(progress)}% voltooid
        </span>
      </div>
      
      <div className="relative w-full h-2 bg-gray-100 rounded-full mb-6">
        <div 
          className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${animatedProgress}%` }}
        ></div>
      </div>
      
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
    </Card>
  );
};

export default ProgressCard;
