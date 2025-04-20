
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface EmailSubscriptionFieldProps {
  emailSubscribed: boolean;
  setEmailSubscribed: (value: boolean) => void;
}

const EmailSubscriptionField = ({
  emailSubscribed,
  setEmailSubscribed
}: EmailSubscriptionFieldProps) => {
  return (
    <div className="flex items-start space-x-3">
      <Checkbox 
        id="emailConsent"
        checked={emailSubscribed}
        onCheckedChange={(checked) => setEmailSubscribed(!!checked)}
        className="mt-1"
      />
      <div>
        <Label 
          htmlFor="emailConsent" 
          className="cursor-pointer"
        >
          Ik wil graag tegelinspiratie en promoties ontvangen
        </Label>
        <p className="text-sm text-gray-500">
          Maximaal één keer per maand, u kunt zich altijd uitschrijven
        </p>
      </div>
    </div>
  );
};

export default EmailSubscriptionField;
