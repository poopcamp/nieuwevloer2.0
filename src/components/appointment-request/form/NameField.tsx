
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import FormField from "./FormField";

interface NameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

const NameField = ({ value, onChange, error = false }: NameFieldProps) => {
  return (
    <FormField 
      id="name"
      label="Uw naam"
      icon={<User className="h-3.5 w-3.5 mr-1.5 text-primary-600/70" />}
      required
      error={error ? "Naam is verplicht" : undefined}
    >
      <Input
        type="text"
        id="name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Uw volledige naam"
        className={`bg-white ${error ? 'border-red-500 focus:border-red-500' : ''}`}
      />
    </FormField>
  );
};

export default NameField;
