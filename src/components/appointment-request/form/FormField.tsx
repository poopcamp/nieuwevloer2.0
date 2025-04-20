
import { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  icon?: ReactNode;
  required?: boolean;
  error?: string;
}

const FormField = ({ id, label, children, icon, required = false, error }: FormFieldProps) => {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center text-sm font-medium text-gray-700">
        {icon}
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      
      {children}
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;
