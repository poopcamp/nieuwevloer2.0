
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { ContactFormData } from "./useContactForm";

interface FormFieldsProps {
  formData: ContactFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormFields = ({ formData, handleChange, handleCheckboxChange }: FormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Naam <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
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
            onChange={handleChange}
            placeholder="voorbeeld@email.be"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefoonnummer <span className="text-red-500">*</span></Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+32 ..."
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Uw bericht <span className="text-red-500">*</span></Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Stel uw vraag of vertel ons meer over uw project..."
          rows={5}
          required
          className="resize-y min-h-[120px]"
        />
      </div>
      
      <div className="flex items-start space-x-2 pt-2">
        <Checkbox 
          id="receives_newsletter"
          name="receives_newsletter"
          checked={formData.receives_newsletter}
          onCheckedChange={(checked) => {
            const event = {
              target: {
                name: "receives_newsletter",
                checked: checked === true
              }
            } as React.ChangeEvent<HTMLInputElement>;
            handleCheckboxChange(event);
          }}
          className="mt-1"
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="receives_newsletter"
            className="text-sm text-gray-700 cursor-pointer"
          >
            Ik wil graag nieuws en aanbiedingen ontvangen
          </label>
          <p className="text-xs text-gray-500">
            U kunt zich op elk moment uitschrijven via de link in onze e-mails.
          </p>
        </div>
      </div>
      
      <div className="flex items-start space-x-2 pt-2">
        <Checkbox 
          id="privacy-agreement" 
          name="privacy_agreement"
          checked={true}
          className="mt-1"
          required
          aria-required={true}
          disabled // Altijd aangevinkt, verplicht voor formulier
        />
        <div className="text-sm text-gray-600">
          <label htmlFor="privacy-agreement" className="cursor-pointer">
            Door dit formulier te verzenden ga ik akkoord met de <Link to="/privacy" className="text-primary hover:underline" target="_blank">privacyvoorwaarden</Link> en geef ik toestemming om mijn gegevens te verwerken voor het beantwoorden van mijn vraag conform de GDPR/AVG.
            <span className="text-red-500">*</span>
          </label>
          <p className="mt-1 text-xs">
            U kunt uw rechten uitoefenen (inzage, correctie, verwijdering) via ons <Link to="/gdpr-verzoek" className="text-primary hover:underline">GDPR-verzoekformulier</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormFields;
