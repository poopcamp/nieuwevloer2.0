
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tileFormat: string;
  squareMeters: number;
  calculatedPrice: number | null;
  // Tile purchase properties
  wantsToBuyTiles?: boolean;
  tilePricePerSqm?: number | null;
  squareMetersWithCuttingLoss?: number;
  tileCost?: number;
}

const AppointmentRequestDialog = ({ 
  open, 
  onOpenChange, 
  tileFormat, 
  squareMeters, 
  calculatedPrice,
  wantsToBuyTiles = false,
  tilePricePerSqm = null
}: AppointmentDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hier zou je normaal gesproken de data verzenden naar je backend
    console.log("Form submitted:", formData);
    alert("Bedankt voor uw aanvraag! We nemen spoedig contact met u op.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <div className="p-8 space-y-6">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold">Afspraak aanvragen</DialogTitle>
            <DialogDescription>
              Vul onderstaand formulier in om een afspraak aan te vragen.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Projectdetails:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded-md">
                <span className="text-gray-600">Tegelformaat:</span>
                <span className="font-medium">{tileFormat}</span>
                
                <span className="text-gray-600">Oppervlakte:</span>
                <span className="font-medium">{squareMeters} m²</span>
                
                <span className="text-gray-600">Geschatte prijs (excl. BTW):</span>
                <span className="font-medium">€ {calculatedPrice?.toFixed(2) || '0.00'}</span>
                
                <span className="text-gray-600">Tegels via ons:</span>
                <span className="font-medium">{wantsToBuyTiles ? 'Ja' : 'Nee'}</span>
                
                {!wantsToBuyTiles && tilePricePerSqm && (
                  <>
                    <span className="text-gray-600">Prijs tegels (incl. BTW):</span>
                    <span className="font-medium">€ {tilePricePerSqm.toFixed(2)}/m²</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Naam</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Uw naam" 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="uw.email@voorbeeld.be" 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Telefoonnummer</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Uw telefoonnummer" 
                />
              </div>
              
              <div>
                <Label htmlFor="message">Bericht (optioneel)</Label>
                <Textarea 
                  id="message" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Eventuele extra informatie of vragen" 
                  rows={3} 
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuleren
              </Button>
              <Button type="submit">
                Versturen
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentRequestDialog;

