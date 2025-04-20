
import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import QuickConfigurator from "@/components/quick-configurator/QuickConfigurator";

interface QuickConfiguratorDialogProps {
  trigger?: React.ReactNode;
}

const QuickConfiguratorDialog = ({ 
  trigger 
}: QuickConfiguratorDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2" variant="default">
            <Calculator size={16} />
            <span>Prijsindicatie berekenen</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <QuickConfigurator />
      </DialogContent>
    </Dialog>
  );
};

export default QuickConfiguratorDialog;
