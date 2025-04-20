
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  error: string | null;
}

const ErrorMessage = ({ error }: ErrorMessageProps) => (
  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
    <AlertCircle className="text-red-500 h-5 w-5 mt-1 mr-3 flex-shrink-0" />
    <div>
      <h3 className="font-medium text-red-800">Er is een fout opgetreden</h3>
      <p className="text-red-700 text-sm mt-1">
        {error || "We konden uw bericht niet versturen. Probeer het later opnieuw of neem telefonisch contact op."}
      </p>
      <p className="text-red-700 text-sm mt-2">
        U kunt rechtstreeks contact opnemen via telefoon: <strong>0479304986</strong>
      </p>
    </div>
  </div>
);

export default ErrorMessage;
