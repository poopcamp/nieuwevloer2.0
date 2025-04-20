
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const ActionButton = ({ 
  children, 
  loading, 
  icon, 
  className, 
  variant = 'default',
  ...props 
}: ActionButtonProps) => {
  return (
    <Button
      variant={variant}
      className={cn("gap-2", className)}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : icon}
      {children}
    </Button>
  );
};

export default ActionButton;
