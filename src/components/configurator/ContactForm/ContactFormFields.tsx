
import PersonalInfoFields from "./FormFields/PersonalInfoFields";
import VisitOptionsFields from "./FormFields/VisitOptionsFields";
import AddressFields from "./FormFields/AddressFields";
import AdditionalNotesField from "./FormFields/AdditionalNotesField";
import EmailSubscriptionField from "./FormFields/EmailSubscriptionField";

interface ContactFormFieldsProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    additionalNotes: string;
    wantsShowroomVisit: boolean;
    wantsSiteVisit: boolean;
    addressStreet: string;
    addressCity: string;
  };
  emailSubscribed: boolean;
  setEmailSubscribed: (value: boolean) => void;
  handleChange: (field: string, value: string | boolean) => void;
}

const ContactFormFields = ({ 
  formData, 
  emailSubscribed, 
  setEmailSubscribed, 
  handleChange 
}: ContactFormFieldsProps) => {
  return (
    <>
      <PersonalInfoFields
        name={formData.name}
        email={formData.email}
        phone={formData.phone}
        handleChange={handleChange}
      />
      
      <VisitOptionsFields
        wantsShowroomVisit={formData.wantsShowroomVisit}
        wantsSiteVisit={formData.wantsSiteVisit}
        handleChange={handleChange}
      />
      
      {formData.wantsSiteVisit && (
        <AddressFields
          street={formData.addressStreet}
          city={formData.addressCity}
          onStreetChange={(value) => handleChange("addressStreet", value)}
          onCityChange={(value) => handleChange("addressCity", value)}
        />
      )}
      
      <AdditionalNotesField
        additionalNotes={formData.additionalNotes}
        handleChange={handleChange}
      />
      
      <EmailSubscriptionField
        emailSubscribed={emailSubscribed}
        setEmailSubscribed={setEmailSubscribed}
      />
    </>
  );
};

export default ContactFormFields;
