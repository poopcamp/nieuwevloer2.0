
import { Input } from "@/components/ui/input";
import { PhoneCall } from "lucide-react";
import FormField from "./FormField";

interface PhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

const PhoneField = ({ value, onChange, error = false }: PhoneFieldProps) => {
  return (
    <FormField 
      id="phone"
      label="Telefoonnummer"
      icon={<PhoneCall className="h-3.5 w-3.5 mr-1.5 text-primary-600/70" />}
      required
      error={error ? "Telefoonnummer is verplicht" : undefined}
    >
      <Input
        type="tel"
        id="phone"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="+32 ..."
        className={`bg-white ${error ? 'border-red-500 focus:border-red-500' : ''}`}
      />
    </FormField>
  );
};

export default PhoneField;
