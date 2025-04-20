
import { DialogHeader as UIDialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarDays } from "lucide-react";

const DialogHeader = () => {
  return (
    <UIDialogHeader className="px-6 pt-6 pb-2">
      <div className="flex items-center justify-center mb-2">
        <div className="p-2.5 bg-primary/10 rounded-full">
          <CalendarDays className="h-6 w-6 text-primary" />
        </div>
      </div>
      <DialogTitle className="text-xl text-center font-semibold text-gray-900">
        Plan een afspraak
      </DialogTitle>
      <p className="text-sm text-center text-gray-500 mt-1">
        Wij nemen contact met u op om een afspraak te plannen
      </p>
    </UIDialogHeader>
  );
};

export default DialogHeader;
