import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import ImageUploadField from '@/components/common/ImageUploadField';

interface ContactFormProps {
  formState: {
    name: string;
    email: string;
    phone: string;
    notes: string;
    wantsSiteVisit: boolean;
    wantsShowroomVisit: boolean;
    receivesNewsletter: boolean;
    uploadedImage: File | null;
    uploadedImageUrl: string | null;
    addressStreet?: string;
    addressCity?: string;
  };
  onUpdateForm: (updates: any) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const ContactForm = ({
  formState,
  onUpdateForm,
  onSubmit,
  isSubmitting
}: ContactFormProps) => {
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdateForm({ [name]: value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    onUpdateForm({ [name]: checked });
  };
  
  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!privacyAgreed) {
      // Show privacy agreement error
      alert("U moet akkoord gaan met ons privacybeleid om door te gaan.");
      return;
    }
    
    if (!formState.name || !formState.email || !formState.phone) {
      alert("Vul a.u.b. uw naam, e-mail en telefoonnummer in.");
      return;
    }
    
    // Check if address is required but not filled in
    if (formState.wantsSiteVisit && (!formState.addressStreet || !formState.addressCity)) {
      alert("Vul a.u.b. het volledige adres in voor het plaatsbezoek.");
      return;
    }
    
    onSubmit();
  };
  
  const handleImageUpload = (file: File) => {
    onUpdateForm({ uploadedImage: file });
  };
  
  const clearImage = () => {
    onUpdateForm({ uploadedImage: null, uploadedImageUrl: null });
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Uw gegevens</h3>
      
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="customerName">Naam <span className="text-destructive">*</span></Label>
            <Input
              id="customerName"
              name="customerName"
              value={formState.name}
              onChange={handleInputChange}
              placeholder="Uw volledige naam"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Telefoon <span className="text-destructive">*</span></Label>
            <Input
              id="customerPhone"
              name="customerPhone"
              value={formState.phone}
              onChange={handleInputChange}
              placeholder="Uw telefoonnummer"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="customerEmail">E-mail <span className="text-destructive">*</span></Label>
          <Input
            id="customerEmail"
            name="customerEmail"
            type="email"
            value={formState.email}
            onChange={handleInputChange}
            placeholder="voorbeeld@email.be"
            required
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Afspraak opties</h3>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="wantsShowroomVisit"
              checked={formState.wantsShowroomVisit}
              onCheckedChange={(checked) => handleCheckboxChange("wantsShowroomVisit", checked as boolean)}
            />
            <Label htmlFor="wantsShowroomVisit">Ik wil een showroom bezoek plannen</Label>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="wantsSiteVisit"
              checked={formState.wantsSiteVisit}
              onCheckedChange={(checked) => handleCheckboxChange("wantsSiteVisit", checked as boolean)}
            />
            <Label htmlFor="wantsSiteVisit">Ik wil een plaatsbezoek plannen</Label>
          </div>
        </div>
        
        {formState.wantsSiteVisit && (
          <div className="pl-6 space-y-4 border-l-2 border-primary/20">
            <div className="space-y-2">
              <Label htmlFor="addressStreet">Straat en huisnummer</Label>
              <Input
                id="addressStreet"
                name="addressStreet"
                value={formState.addressStreet || ''}
                onChange={handleInputChange}
                placeholder="Straatnaam 123"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="addressCity">Postcode en gemeente</Label>
              <Input
                id="addressCity"
                name="addressCity"
                value={formState.addressCity || ''}
                onChange={handleInputChange}
                placeholder="1000 Brussel"
              />
            </div>
          </div>
        )}
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Project afbeelding</h3>
        <p className="text-sm text-gray-600">Upload een foto van uw ruimte (optioneel)</p>
        
        <ImageUploadField
          imagePreview={formState.uploadedImageUrl}
          onUpload={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleImageUpload(e.target.files[0]);
            }
          }}
          onClear={clearImage}
        />
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notes">Aanvullende opmerkingen</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formState.notes}
            onChange={handleInputChange}
            placeholder="Typ hier eventuele aanvullende informatie over uw project..."
            className="min-h-[100px]"
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="receivesNewsletter"
            checked={formState.receivesNewsletter}
            onCheckedChange={(checked) => handleCheckboxChange("receivesNewsletter", checked as boolean)}
          />
          <Label htmlFor="receivesNewsletter" className="text-sm">Houd mij op de hoogte van aanbiedingen en nieuws</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="privacyAgreed"
            checked={privacyAgreed}
            onCheckedChange={(checked) => setPrivacyAgreed(checked as boolean)}
            required
          />
          <Label htmlFor="privacyAgreed" className="text-sm">
            Ik ga akkoord met het <a href="/privacy-policy" className="text-primary underline" target="_blank">privacybeleid</a> <span className="text-destructive">*</span>
          </Label>
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
        onClick={handleSubmitClick}
      >
        {isSubmitting ? "Bezig met verzenden..." : "Offerte aanvragen"}
      </Button>
    </div>
  );
};

export default ContactForm;
