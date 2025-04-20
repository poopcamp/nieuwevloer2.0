
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ContactFormProps {
  name: string;
  email: string;
  phone: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ContactForm = ({ 
  name, 
  email, 
  phone, 
  onNameChange, 
  onEmailChange, 
  onPhoneChange, 
  onSubmit 
}: ContactFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Uw gegevens</h3>
      
      <div className="space-y-2">
        <Label htmlFor="name">Naam</Label>
        <Input 
          id="name"
          value={name} 
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Uw volledige naam"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input 
          id="email"
          type="email"
          value={email} 
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="voorbeeld@email.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefoonnummer</Label>
        <Input 
          id="phone"
          type="tel"
          value={phone} 
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="+32 123 456 789"
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary-600"
        onClick={onSubmit}
      >
        Offerte aanvragen
      </Button>
    </div>
  );
};

export default ContactForm;
