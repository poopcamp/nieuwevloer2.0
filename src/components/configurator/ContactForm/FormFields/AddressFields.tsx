
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AddressFieldsProps {
  street: string;
  city: string;
  onStreetChange: (value: string) => void;
  onCityChange: (value: string) => void;
}

const AddressFields = ({
  street,
  city,
  onStreetChange,
  onCityChange,
}: AddressFieldsProps) => {
  return (
    <div className="space-y-4 pl-6 border-l-2 border-primary/20 mt-2">
      <div className="space-y-2">
        <Label htmlFor="addressStreet">Straat en nummer</Label>
        <Input
          id="addressStreet"
          value={street}
          onChange={(e) => onStreetChange(e.target.value)}
          placeholder="Straatnaam 123"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressCity">Postcode en gemeente</Label>
        <Input
          id="addressCity"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          placeholder="1234 Gemeente"
        />
      </div>
    </div>
  );
};

export default AddressFields;
