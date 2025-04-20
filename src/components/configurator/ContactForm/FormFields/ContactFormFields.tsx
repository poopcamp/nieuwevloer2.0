
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUploadField from "@/components/common/ImageUploadField";
import AddressFields from "./AddressFields";

interface ContactFormFieldsProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    additionalNotes: string;
    wantsShowroomVisit?: boolean;
    wantsSiteVisit?: boolean;
    addressStreet?: string;
    addressCity?: string;
  };
  emailSubscribed: boolean;
  setEmailSubscribed: (value: boolean) => void;
  handleChange: (field: string, value: string | boolean) => void;
}

const ContactFormFields = ({
  formData,
  emailSubscribed,
  setEmailSubscribed,
  handleChange,
}: ContactFormFieldsProps) => {
  const [showAddressFields, setShowAddressFields] = useState(!!formData.wantsSiteVisit);

  const handleCheckboxChange = (field: string, checked: boolean) => {
    handleChange(field, checked);
    
    if (field === "wantsSiteVisit") {
      setShowAddressFields(checked);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Naam <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Uw volledige naam"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">E-mail <span className="text-red-500">*</span></Label>
        <Input
          id="email"
          name="email"
          type="email" 
          value={formData.email}
          onChange={handleInputChange}
          placeholder="uwmail@voorbeeld.be"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefoon <span className="text-red-500">*</span></Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="+32 ..."
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="newsletter" 
            checked={emailSubscribed}
            onCheckedChange={(checked) => setEmailSubscribed(checked as boolean)}
          />
          <Label 
            htmlFor="newsletter" 
            className="text-sm font-normal cursor-pointer"
          >
            Houd me op de hoogte van nieuws en aanbiedingen
          </Label>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="showroomVisit"
            checked={formData.wantsShowroomVisit || false}
            onCheckedChange={(checked) => handleCheckboxChange("wantsShowroomVisit", checked as boolean)}
          />
          <Label 
            htmlFor="showroomVisit" 
            className="text-sm font-normal cursor-pointer"
          >
            Ik wil graag een showroombezoek inplannen
          </Label>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="siteVisit"
            checked={formData.wantsSiteVisit || false}
            onCheckedChange={(checked) => handleCheckboxChange("wantsSiteVisit", checked as boolean)}
          />
          <Label 
            htmlFor="siteVisit" 
            className="text-sm font-normal cursor-pointer"
          >
            Ik wil graag een plaatsbezoek inplannen
          </Label>
        </div>
      </div>
      
      {showAddressFields && (
        <AddressFields
          street={formData.addressStreet || ""}
          city={formData.addressCity || ""}
          onStreetChange={(value) => handleChange("addressStreet", value)}
          onCityChange={(value) => handleChange("addressCity", value)}
        />
      )}
      
      <div className="space-y-2">
        <Label htmlFor="additionalNotes">Opmerkingen</Label>
        <Textarea
          id="additionalNotes"
          name="additionalNotes"
          value={formData.additionalNotes || ""}
          onChange={handleInputChange}
          placeholder="Eventuele extra informatie of wensen..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};

export default ContactFormFields;
