
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Home } from "lucide-react";

interface AddressSectionProps {
  addressStreet: string;
  addressCity: string;
  handleChange: (field: string, value: string | boolean) => void;
}

const AddressSection = ({ addressStreet, addressCity, handleChange }: AddressSectionProps) => {
  return (
    <div className="space-y-4 border-l-2 border-primary-100 pl-4">
      <div className="space-y-2">
        <Label htmlFor="addressStreet" className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span>Straat en huisnummer</span>
        </Label>
        <Input
          id="addressStreet"
          value={addressStreet}
          onChange={(e) => handleChange("addressStreet", e.target.value)}
          placeholder="Vakebuurtstraat 123"
          className="border-gray-300"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="addressCity" className="flex items-center gap-1.5">
          <Home className="h-4 w-4 text-gray-500" />
          <span>Postcode en gemeente</span>
        </Label>
        <Input
          id="addressCity"
          value={addressCity}
          onChange={(e) => handleChange("addressCity", e.target.value)}
          placeholder="9990 Maldegem"
          className="border-gray-300"
        />
      </div>
    </div>
  );
};

export default AddressSection;
