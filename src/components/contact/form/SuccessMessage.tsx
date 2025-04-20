
import { CheckCircle } from "lucide-react";

interface SuccessMessageProps {
  email: string;
  emailStatus: {
    sentToCustomer: boolean;
    sentToAdmin: boolean;
    details?: any;
  } | null;
}

const SuccessMessage = ({ email, emailStatus }: SuccessMessageProps) => (
  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
    <CheckCircle className="text-green-500 h-5 w-5 mt-1 mr-3 flex-shrink-0" />
    <div>
      <h3 className="font-medium text-green-800">Bericht succesvol verzonden!</h3>
      <p className="text-green-700 text-sm mt-1">
        Bedankt voor uw bericht. We hebben een bevestiging gestuurd naar {email} en nemen zo spoedig mogelijk contact met u op.
      </p>
      {emailStatus && !emailStatus.sentToCustomer && (
        <p className="text-amber-600 text-sm mt-2">
          <strong>Let op:</strong> Er was een probleem bij het verzenden van de bevestigingsmail.
          Controleer uw e-mailadres of uw spamfolder.
        </p>
      )}
    </div>
  </div>
);

export default SuccessMessage;
