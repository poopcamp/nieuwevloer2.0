
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/utils/formatters";
import ImageUploadSection from "../../appointment-request/dialog/ImageUploadSection";
import { FormValues } from "./hooks/useConfiguratorAppointmentDialog";

interface DialogContentProps {
  tileFormat: string;
  squareMeters: number;
  calculatedPrice: number;
  formData: FormValues;
  onFormChange: (field: string, value: string | boolean) => void;
  wantsToBuyTiles?: boolean;
  tilePricePerSqm?: number | null;
  squareMetersWithCuttingLoss?: number;
  tileCost?: number;
  imagePreview?: string | null;
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage?: () => void;
}

const DialogContent = ({ 
  tileFormat,
  squareMeters, 
  calculatedPrice,
  formData,
  onFormChange,
  wantsToBuyTiles = false,
  tilePricePerSqm = null,
  squareMetersWithCuttingLoss = 0,
  tileCost = 0,
  imagePreview,
  handleImageUpload,
  clearImage
}: DialogContentProps) => {
  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-2">Afspraak aanvragen</h2>
      <p className="text-sm text-gray-600 mb-4">
        Vul uw gegevens in en wij nemen zo snel mogelijk contact met u op.
      </p>

      <div className="bg-primary/5 p-3 rounded-md border border-primary/10 mb-5">
        <p className="text-sm"><span className="font-semibold">Tegelformaat:</span> {tileFormat}</p>
        <p className="text-sm"><span className="font-semibold">Oppervlakte:</span> {squareMeters} m²</p>
        <p className="text-sm"><span className="font-semibold">Richtprijs:</span> {formatCurrency(calculatedPrice)} excl. BTW</p>
        
        {/* Display tile purchase options */}
        <p className="text-sm mt-2">
          <span className="font-semibold">Tegels:</span> {wantsToBuyTiles ? 'Via ons' : 'Zelf voorzien'}
        </p>
        
        {!wantsToBuyTiles && tilePricePerSqm && (
          <>
            <p className="text-sm">
              <span className="font-semibold">Tegelprijs per m²:</span> {formatCurrency(tilePricePerSqm)} incl. BTW
            </p>
            <p className="text-sm">
              <span className="font-semibold">Tegels totaal:</span> {formatCurrency(tileCost)} (incl. 10% snijverlies)
            </p>
          </>
        )}
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-sm">Naam*</Label>
            <Input 
              id="name"
              value={formData.name} 
              onChange={(e) => onFormChange('name', e.target.value)}
              className="mt-1"
              placeholder="Volledige naam"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm">E-mailadres*</Label>
            <Input 
              id="email"
              type="email"
              value={formData.email} 
              onChange={(e) => onFormChange('email', e.target.value)}
              className="mt-1"
              placeholder="voorbeeld@email.com"
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="phone" className="text-sm">Telefoonnummer*</Label>
          <Input 
            id="phone"
            type="tel"
            value={formData.phone} 
            onChange={(e) => onFormChange('phone', e.target.value)}
            className="mt-1"
            placeholder="+32 0000 00000"
            required
          />
        </div>

        {/* Site visit options */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="wantsSiteVisit" 
              checked={formData.wantsSiteVisit}
              onCheckedChange={(checked) => onFormChange('wantsSiteVisit', Boolean(checked))}
            />
            <Label htmlFor="wantsSiteVisit" className="text-sm font-normal">
              Ik wens een plaatsbezoek voor een definitieve offerte
            </Label>
          </div>
          
          {formData.wantsSiteVisit && (
            <div className="pl-6 space-y-3 mt-2 animate-fadeIn">
              <div>
                <Label htmlFor="addressStreet" className="text-sm">Straat en nummer</Label>
                <Input 
                  id="addressStreet"
                  value={formData.addressStreet} 
                  onChange={(e) => onFormChange('addressStreet', e.target.value)}
                  className="mt-1"
                  placeholder="Straatnaam 123"
                />
              </div>
              <div>
                <Label htmlFor="addressCity" className="text-sm">Postcode en gemeente</Label>
                <Input 
                  id="addressCity"
                  value={formData.addressCity} 
                  onChange={(e) => onFormChange('addressCity', e.target.value)}
                  className="mt-1"
                  placeholder="1000 Brussel"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="wantsShowroomVisit" 
              checked={formData.wantsShowroomVisit}
              onCheckedChange={(checked) => onFormChange('wantsShowroomVisit', Boolean(checked))}
            />
            <Label htmlFor="wantsShowroomVisit" className="text-sm font-normal">
              Ik wens een bezoek aan de showroom in te plannen
            </Label>
          </div>
        </div>

        {/* Image upload section */}
        {handleImageUpload && clearImage && (
          <ImageUploadSection
            imagePreview={imagePreview}
            handleImageUpload={handleImageUpload}
            clearImage={clearImage}
          />
        )}

        <div>
          <Label htmlFor="additionalInfo" className="text-sm">Opmerkingen</Label>
          <Textarea 
            id="additionalInfo"
            value={formData.notes}
            onChange={(e) => onFormChange('notes', e.target.value)}
            className="mt-1"
            placeholder="Deel hier eventuele extra informatie over uw project"
            rows={3}
          />
        </div>
      </form>
    </div>
  );
};

export default DialogContent;
