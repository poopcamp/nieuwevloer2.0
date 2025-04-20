import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/utils/formatters";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DialogContentProps {
  tileFormat: string;
  squareMeters: number;
  calculatedPrice: number;
  formData: {
    name: string;
    email: string;
    phone: string;
    additionalNotes: string;
    wantsSiteVisit: boolean;
    wantsShowroomVisit: boolean;
    addressStreet: string;
    addressCity: string;
  };
  onFormChange: (field: string, value: string | boolean) => void;
  wantsToBuyTiles?: boolean;
  tilePricePerSqm?: number | null;
  squareMetersWithCuttingLoss?: number;
  tileCost?: number;
  imagePreview: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage: () => void;
}

const DialogContentComponent = ({ 
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
    <>
      <div className="p-6 sm:p-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Uw gegevens</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Naam <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => onFormChange('name', e.target.value)}
              placeholder="Uw naam"
              className="w-full border-gray-300 focus:border-primary focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              E-mail <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="email" 
              type="email"
              value={formData.email}
              onChange={(e) => onFormChange('email', e.target.value)}
              placeholder="uw@email.be"
              className="w-full border-gray-300 focus:border-primary focus:ring-primary"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Telefoon <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="phone" 
              type="tel"
              value={formData.phone}
              onChange={(e) => onFormChange('phone', e.target.value)}
              placeholder="+32 ..."
              className="w-full border-gray-300 focus:border-primary focus:ring-primary"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="showroomVisit"
                checked={formData.wantsShowroomVisit}
                onCheckedChange={(checked) => onFormChange('wantsShowroomVisit', checked === true)}
              />
              <Label 
                htmlFor="showroomVisit" 
                className="text-sm font-normal cursor-pointer"
              >
                Ik wil graag een showroombezoeek inplannen
              </Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="siteVisit"
                checked={formData.wantsSiteVisit}
                onCheckedChange={(checked) => onFormChange('wantsSiteVisit', checked === true)}
              />
              <Label 
                htmlFor="siteVisit" 
                className="text-sm font-normal cursor-pointer"
              >
                Ik wil graag een plaatsbezoek inplannen
              </Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additionalNotes" className="text-sm font-medium">
              Extra opmerkingen
            </Label>
            <Textarea 
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => onFormChange('additionalNotes', e.target.value)}
              placeholder="Eventuele vragen of extra informatie..."
              className="w-full border-gray-300 focus:border-primary focus:ring-primary min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Foto's van uw ruimte (optioneel)
            </Label>
            
            <input 
              type="file"
              id="projectImage"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {imagePreview ? (
              <div className="relative mt-2">
                <img 
                  src={imagePreview}
                  alt="Project preview"
                  className="w-full h-48 object-cover rounded-md border border-gray-200"
                />
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-white rounded-full h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div 
                onClick={() => document.getElementById('projectImage')?.click()}
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:border-primary transition-colors"
              >
                <Camera className="h-10 w-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Klik om foto's toe te voegen</span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG, etc. (max 5MB)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DialogContentComponent;
