
import { Mail, User, Phone, Camera, Home, Calendar } from "lucide-react";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface ContactFormLayoutProps {
  email: string;
  name: string;
  phone: string;
  onFieldChange: (field: string, value: string | boolean) => void;
  addImage?: boolean;
  onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showVisitOptions?: boolean;
  wantsShowroomVisit?: boolean;
  wantsSiteVisit?: boolean;
  additionalNotes?: string;
  addressStreet?: string;
  addressCity?: string;
  showAddress?: boolean;
  imagePreview?: string | null;
  onClearImage?: () => void;
}

const ContactFormLayout = ({
  email,
  name,
  phone,
  onFieldChange,
  addImage = false,
  onImageUpload,
  showVisitOptions = false,
  wantsShowroomVisit = false,
  wantsSiteVisit = false,
  additionalNotes = "",
  addressStreet = "",
  addressCity = "",
  showAddress = false,
  imagePreview = null,
  onClearImage
}: ContactFormLayoutProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const triggerFileInput = () => {
    if (fileInputRef.current && onImageUpload) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onImageUpload) {
      onImageUpload(e);
      if (e.target.files && e.target.files[0]) {
        setUploadedFileName(e.target.files[0].name);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-1.5">
            <Mail className="h-4 w-4 text-gray-500" />
            <span>E-mailadres *</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onFieldChange("email", e.target.value)}
            placeholder="voorbeeld@email.be"
            required
            className="border-gray-300"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-gray-500" />
            <span>Naam</span>
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            placeholder="Uw volledige naam"
            className="border-gray-300"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-1.5">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>Telefoonnummer</span>
          </Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => onFieldChange("phone", e.target.value)}
            placeholder="+32..."
            className="border-gray-300"
          />
        </div>
        
        {addImage && (
          <div className="space-y-2">
            <Label htmlFor="photoUpload" className="flex items-center gap-1.5">
              <Camera className="h-4 w-4 text-gray-500" />
              <span>Foto's toevoegen</span>
            </Label>
            <input
              ref={fileInputRef}
              id="photoUpload"
              name="photoUpload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div 
              className="border border-dashed border-gray-300 rounded-md p-4 text-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={triggerFileInput}
            >
              <Camera className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              {uploadedFileName || imagePreview ? (
                <p className="text-sm text-green-600">
                  {uploadedFileName ? `Geüpload: ${uploadedFileName}` : "Foto toegevoegd"}
                </p>
              ) : (
                <p className="text-sm text-gray-500">Klik om foto's toe te voegen</p>
              )}
            </div>
          </div>
        )}

        {imagePreview && (
          <div className="md:col-span-2">
            <div className="relative rounded-md overflow-hidden h-40 w-full md:w-1/2 mx-auto">
              <img 
                src={imagePreview} 
                alt="Geüploade afbeelding" 
                className="object-cover w-full h-full" 
              />
              <button
                type="button"
                onClick={onClearImage}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {showVisitOptions && (
        <>
          <h3 className="font-medium text-gray-900">Bezoekopties</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="showroomVisit" 
                checked={wantsShowroomVisit}
                onCheckedChange={(checked) => onFieldChange("wantsShowroomVisit", !!checked)}
                className="mt-1"
              />
              <div>
                <Label 
                  htmlFor="showroomVisit" 
                  className="flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <Home className="h-4 w-4 text-primary" />
                  <span>Showroom van Qtile bezoeken</span>
                </Label>
                <p className="text-sm text-gray-500">
                  Onze showroom bekijken
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="siteVisit" 
                checked={wantsSiteVisit}
                onCheckedChange={(checked) => onFieldChange("wantsSiteVisit", !!checked)}
                className="mt-1"
              />
              <div>
                <Label 
                  htmlFor="siteVisit" 
                  className="flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Plaatsbezoek aanvragen</span>
                </Label>
                <p className="text-sm text-gray-500">
                  Een vakman komt ter plaatse voor advies en opmeting
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      
      {showAddress && wantsSiteVisit && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Adresgegevens</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="addressStreet">Straat en huisnummer</Label>
              <Input
                id="addressStreet"
                value={addressStreet}
                onChange={(e) => onFieldChange("addressStreet", e.target.value)}
                placeholder="Straatnaam 123"
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressCity">Postcode en gemeente</Label>
              <Input
                id="addressCity"
                value={addressCity}
                onChange={(e) => onFieldChange("addressCity", e.target.value)}
                placeholder="1234 Gemeente"
                className="border-gray-300"
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">Opmerkingen</h3>
        <div>
          <Textarea
            id="additionalNotes"
            value={additionalNotes || ""}
            onChange={(e) => onFieldChange("additionalNotes", e.target.value)}
            placeholder="Eventuele extra informatie of wensen..."
            className="min-h-[120px] resize-y border-gray-300"
          />
          <p className="text-xs text-gray-500 mt-1">Scrollbaar veld voor al uw vragen en opmerkingen</p>
        </div>
      </div>
    </div>
  );
};

export default ContactFormLayout;
