
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import FormContainer from './form/FormContainer';
import NameField from './form/NameField';
import EmailField from './form/EmailField';
import PhoneField from './form/PhoneField';
import NotesField from './form/NotesField';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';

interface AppointmentFormProps {
  name: string;
  email: string;
  phone: string;
  notes: string;
  onChange: (formData: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  }) => void;
  onSubmit: () => void;
  onBack: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  name,
  email,
  phone,
  notes,
  onChange,
  onSubmit,
  onBack,
  onCancel,
  isSubmitting,
}) => {
  // Local state for form validation
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
  });

  const handleChange = (field: keyof typeof errors | "notes", value: string) => {
    // Update parent component state
    onChange({
      name: field === 'name' ? value : name,
      email: field === 'email' ? value : email,
      phone: field === 'phone' ? value : phone,
      notes: field === 'notes' ? value : notes,
    });

    // Clear error for the field being changed if it exists in errors object
    if (field !== "notes" && errors[field]) {
      setErrors({
        ...errors,
        [field]: false,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      name: !name.trim(),
      email: !email.trim() || !/^\S+@\S+\.\S+$/.test(email),
      phone: !phone.trim(),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <FormContainer>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Uw contactgegevens</h2>
        <p className="text-gray-600">
          Wij nemen zo snel mogelijk contact met u op om een afspraak in te plannen.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <NameField
          value={name}
          onChange={(value) => handleChange('name', value)}
          error={errors.name}
        />

        <EmailField
          value={email}
          onChange={(value) => handleChange('email', value)}
          error={errors.email}
        />

        <PhoneField
          value={phone}
          onChange={(value) => handleChange('phone', value)}
          error={errors.phone}
        />

        <NotesField
          value={notes}
          onChange={(value) => handleChange('notes', value)}
        />

        <div className="flex flex-col sm:flex-row gap-3 justify-between mt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Annuleren
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={onBack}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug
            </Button>
          </div>
          
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-primary hover:bg-primary-600"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verzenden...
              </>
            ) : (
              <>
                Versturen
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default AppointmentForm;
