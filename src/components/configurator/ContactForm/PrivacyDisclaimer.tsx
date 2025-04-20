
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { CompanyInfo, tableNames } from "@/utils/supabase/customTypes";
import { getCompanyInfo } from "@/utils/companySettingsHelpers";

const defaultCompanyInfo: CompanyInfo = {
  id: "",
  created_at: "",
  updated_at: "",
  company_name: "Vloeren Vanderheyden",
  company_vat: "BE0123.456.789",
  company_address: "Vakekerkweg 111, 9990 Maldegem, België",
  company_email: "info@nieuwevloer.be",
  company_phone: "+32 472 00 00 00",
  privacy_policy_last_updated: new Date().toISOString(),
  terms_last_updated: new Date().toISOString(),
  showroom_visit_enabled: true,
  showroom_visit_text: "Showroom van Qtile bezoeken"
};

interface PrivacyDisclaimerProps {
  value?: boolean;
  onChange?: (checked: boolean) => void;
  required?: boolean;
}

const PrivacyDisclaimer = ({ 
  value = false, 
  onChange,
  required = true 
}: PrivacyDisclaimerProps) => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(defaultCompanyInfo);
  const [checked, setChecked] = useState(value);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const data = await getCompanyInfo();
        if (data) {
          setCompanyInfo(data);
        }
      } catch (error) {
        console.error("Error fetching company info:", error);
      }
    };

    fetchCompanyInfo();
  }, []);

  const handleCheckedChange = (isChecked: boolean) => {
    setChecked(isChecked);
    if (onChange) {
      onChange(isChecked);
    }
  };

  return (
    <div className="flex items-start space-x-2 mt-4 mb-2">
      <Checkbox 
        id="privacy-agreement" 
        checked={checked} 
        onCheckedChange={handleCheckedChange}
        className="mt-1"
        required={required}
        aria-required={required}
      />
      <div className="text-sm text-gray-600">
        <label htmlFor="privacy-agreement" className="cursor-pointer">
          Ik ga akkoord met de <Link to="/privacy" className="text-primary hover:underline" target="_blank">privacyvoorwaarden</Link> en geef toestemming om mijn gegevens te verwerken voor het opmaken en opvolgen van deze offerte conform de Belgische en Europese privacywetgeving (GDPR/AVG).
          {required && <span className="text-red-500">*</span>}
        </label>
        <p className="mt-1 text-xs">
          U kunt uw toestemming op elk moment intrekken of uw rechten uitoefenen (inzage, wijziging, verwijdering) door contact op te nemen met {companyInfo.company_email} of via ons <Link to="/gdpr-verzoek" className="text-primary hover:underline">GDPR-verzoekformulier</Link>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyDisclaimer;
