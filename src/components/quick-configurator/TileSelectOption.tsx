
import { RadioGroupItem } from "@/components/ui/radio-group";

interface TileSelectOptionProps {
  value: string;
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  icon?: React.ReactNode;
}

const TileSelectOption = ({
  value,
  id,
  label,
  checked,
  onChange,
  icon
}: TileSelectOptionProps) => {
  return (
    <label
      htmlFor={id}
      className={`
        flex items-center justify-center border rounded-md p-3 cursor-pointer transition-all duration-200
        ${checked
          ? "border-primary bg-primary text-white font-medium shadow-sm"
          : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
        }
      `}
      onClick={onChange}
    >
      <div className="flex flex-col items-center">
        <RadioGroupItem value={value} id={id} className="sr-only" />
        {icon && <span className="mb-1">{icon}</span>}
        <span className="text-sm font-medium">{label}</span>
      </div>
    </label>
  );
};

export default TileSelectOption;
