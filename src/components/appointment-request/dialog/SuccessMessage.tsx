
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

interface SuccessMessageProps {
  email: string;
}

const SuccessMessage = ({ email }: SuccessMessageProps) => {
  return (
    <div className="p-6 flex flex-col items-center text-center space-y-4">
      <DialogHeader>
        <DialogTitle className="text-xl text-center">Afspraak aangevraagd!</DialogTitle>
      </DialogHeader>
      
      <div className="flex justify-center my-6">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>
      
      <p className="text-gray-700">
        Bedankt voor je aanvraag. We hebben een bevestiging gestuurd naar:
      </p>
      
      <p className="font-medium text-primary bg-primary-50 px-4 py-2 rounded-md">
        {email}
      </p>
      
      <div className="text-sm text-gray-500 mt-4">
        <p>We nemen binnen 24 uur contact met je op om een afspraak in te plannen.</p>
      </div>
    </div>
  );
};

export default SuccessMessage;
