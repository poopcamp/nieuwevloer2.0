
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export interface QuickActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  buttonLabel: string;
  buttonAction: string; // Changed from ReactNode to string to hold URL path
  color?: "green" | "blue" | "amber" | "emerald" | "primary";
}

const QuickActionCard = ({
  title,
  description,
  icon,
  buttonLabel,
  buttonAction,
  color = "primary",
}: QuickActionCardProps) => {
  // Map color names to Tailwind classes
  const colorClasses = {
    primary: "bg-primary hover:bg-primary/90",
    green: "bg-green-600 hover:bg-green-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    amber: "bg-amber-600 hover:bg-amber-700",
    emerald: "bg-emerald-600 hover:bg-emerald-700",
  };

  const buttonClass = colorClasses[color];

  return (
    <Card className="shadow-sm h-full flex flex-col">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="flex items-center gap-2 text-base font-medium truncate">
          {icon}
          <span className="truncate">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
        <Button 
          className={`w-full text-white ${buttonClass} py-2.5 h-12 text-base font-medium flex items-center justify-center`}
          asChild
        >
          <Link to={buttonAction}>{buttonLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionCard;
