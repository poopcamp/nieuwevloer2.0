
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import ImageUploadField from "@/components/common/ImageUploadField";

interface ContactFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    addressStreet: string;
    addressCity: string;
    additionalNotes: string;
    wantsShowroomVisit: boolean;
    wantsSiteVisit: boolean;
  };
  isSubmitting?: boolean;
  emailSubscribed?: boolean;
  setEmailSubscribed?: (value: boolean) => void;
  handleChange?: (field: string, value: string | boolean) => void;
  handleSubmit?: (e: React.FormEvent) => Promise<void>;
  onCancel?: () => void;
  imageFile?: File | null;
  imagePreview?: string | null;
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage?: () => void;
  onSuccess?: (data: any) => void;
}

const ContactForm = ({
  formData,
  isSubmitting = false,
  emailSubscribed = true,
  setEmailSubscribed = () => {},
  handleChange = () => {},
  handleSubmit = async () => {},
  onCancel = () => {},
  imageFile = null,
  imagePreview = null,
  handleImageUpload = () => {},
  clearImage = () => {},
  onSuccess = () => {}
}: ContactFormProps) => {
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e.target.name, e.target.value);
  };

  const handleCheckboxChange = (field: string) => (checked: boolean) => {
    handleChange(field, checked);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-5">Uw gegevens</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Naam <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleFieldChange}
              placeholder="Uw naam"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-mail <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleFieldChange}
              placeholder="uw@email.be"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefoon <span className="text-red-500">*</span></Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleFieldChange}
              placeholder="+32 ..."
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showroomVisit"
                checked={formData.wantsShowroomVisit}
                onCheckedChange={handleCheckboxChange("wantsShowroomVisit")}
                disabled={isSubmitting}
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
                checked={formData.wantsSiteVisit}
                onCheckedChange={handleCheckboxChange("wantsSiteVisit")}
                disabled={isSubmitting}
              />
              <Label
                htmlFor="siteVisit"
                className="text-sm font-normal cursor-pointer"
              >
                Ik wil graag een plaatsbezoek inplannen
              </Label>
            </div>
          </div>
          
          {formData.wantsSiteVisit && (
            <div className="space-y-4 border-l-2 border-primary-100 pl-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="addressStreet">Straat en huisnummer</Label>
                <Input
                  id="addressStreet"
                  name="addressStreet"
                  value={formData.addressStreet}
                  onChange={handleFieldChange}
                  placeholder="Uw straatnaam en nummer"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="addressCity">Postcode en gemeente</Label>
                <Input
                  id="addressCity"
                  name="addressCity"
                  value={formData.addressCity}
                  onChange={handleFieldChange}
                  placeholder="Uw postcode en gemeente"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Extra opmerkingen</Label>
            <Textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleFieldChange}
              placeholder="Extra informatie of vragen..."
              disabled={isSubmitting}
              className="min-h-[100px]"
            />
          </div>
          
          {/* Image upload field */}
          {handleImageUpload && (
            <div className="space-y-2">
              <Label>Foto's van uw ruimte (optioneel)</Label>
              <ImageUploadField
                imagePreview={imagePreview}
                onUpload={handleImageUpload}
                onClear={clearImage}
                disabled={isSubmitting}
                acceptedFileTypes="image/*"
              />
              {imagePreview && (
                <p className="text-xs text-gray-500">Foto wordt meegestuurd met uw aanvraag</p>
              )}
            </div>
          )}
          
          {setEmailSubscribed && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newsletter"
                  checked={emailSubscribed}
                  onCheckedChange={(checked) => setEmailSubscribed(!!checked)}
                  disabled={isSubmitting}
                />
                <Label
                  htmlFor="newsletter"
                  className="text-sm font-normal cursor-pointer"
                >
                  Houd me op de hoogte van aanbiedingen en nieuws
                </Label>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuleren
        </Button>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Bezig met verzenden...
            </>
          ) : (
            "Aanvraag versturen"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
