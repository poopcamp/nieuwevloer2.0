
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import FormField from "./FormField";

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

const EmailField = ({ value, onChange, error = false }: EmailFieldProps) => {
  return (
    <FormField 
      id="email"
      label="E-mailadres"
      icon={<Mail className="h-3.5 w-3.5 mr-1.5 text-primary-600/70" />}
      required
      error={error ? "E-mailadres is verplicht" : undefined}
    >
      <Input
        type="email"
        id="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="uw.email@voorbeeld.be"
        className={`bg-white ${error ? 'border-red-500 focus:border-red-500' : ''}`}
      />
    </FormField>
  );
};

export default EmailField;
