
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface BathroomOptionItemProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  additionalContent?: React.ReactNode;
  disabled?: boolean;
}

const BathroomOptionItem = ({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  additionalContent,
  disabled = false
}: BathroomOptionItemProps) => {
  return (
    <div className={`flex items-start space-x-3 p-4 border rounded-md ${disabled ? 'bg-gray-50 opacity-75' : 'hover:border-gray-300 hover:shadow-sm'} border-gray-200 transition-all`}>
      <Checkbox 
        id={id} 
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(!!checked)}
        className="mt-1"
        disabled={disabled}
      />
      <div>
        <Label 
          htmlFor={id}
          className={`font-medium cursor-pointer ${disabled ? 'text-gray-500' : ''}`}
        >
          {label}
        </Label>
        <p className={`text-sm mt-1 ${disabled ? 'text-gray-500' : 'text-gray-600'}`}>
          {description}
        </p>
        {additionalContent}
      </div>
    </div>
  );
};

export default BathroomOptionItem;
