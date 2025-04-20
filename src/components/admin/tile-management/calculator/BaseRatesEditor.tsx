
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface BaseRatesEditorProps {
  onUpdatePreview: (config: any) => void;
}

interface PricingInfo {
  id: string;
  base_m2_price: number;
  base_bathroom_price: number;
  base_kitchen_price: number;
  price_info_text: string;
  ontkoppelingsmat_included: boolean;
  chape_primer_included: boolean;
}

const BaseRatesEditor = ({ onUpdatePreview }: BaseRatesEditorProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pricingInfo, setPricingInfo] = useState<PricingInfo | null>(null);
  
  // Fetch the pricing info from the database
  useEffect(() => {
    const fetchPricingInfo = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('pricing_info')
          .select('*')
          .limit(1)
          .single();
        
        if (error) throw error;
        setPricingInfo(data);
      } catch (error: any) {
        console.error('Error fetching pricing info:', error);
        toast({
          title: "Fout bij ophalen prijsinformatie",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPricingInfo();
  }, []);
  
  // Update local state when input values change
  const handleInputChange = (field: keyof PricingInfo, value: string | boolean) => {
    if (!pricingInfo) return;
    
    if (typeof value === 'string' && !isNaN(parseFloat(value))) {
      // Numeric string value
      setPricingInfo({
        ...pricingInfo,
        [field]: parseFloat(value),
      });
    } else {
      // Boolean or text value
      setPricingInfo({
        ...pricingInfo,
        [field]: value,
      });
    }
  };
  
  // Save the updated pricing info to the database
  const handleSave = async () => {
    if (!pricingInfo) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('pricing_info')
        .update({
          base_m2_price: pricingInfo.base_m2_price,
          base_bathroom_price: pricingInfo.base_bathroom_price,
          base_kitchen_price: pricingInfo.base_kitchen_price,
          price_info_text: pricingInfo.price_info_text,
          ontkoppelingsmat_included: pricingInfo.ontkoppelingsmat_included,
          chape_primer_included: pricingInfo.chape_primer_included,
        })
        .eq('id', pricingInfo.id);
      
      if (error) throw error;
      
      toast({
        title: "Prijsinformatie bijgewerkt",
        description: "De basistarieven zijn succesvol opgeslagen.",
      });
      
      // Update the preview
      onUpdatePreview({});
    } catch (error: any) {
      console.error('Error updating pricing info:', error);
      toast({
        title: "Fout bij opslaan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!pricingInfo) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <p className="text-center text-gray-500">Geen prijsinformatie gevonden.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="base_m2_price">Basisprijs per m² (vloer)</Label>
            <Input
              id="base_m2_price"
              type="number"
              step="0.01"
              value={pricingInfo.base_m2_price}
              onChange={(e) => handleInputChange('base_m2_price', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="base_kitchen_price">Basisprijs keuken</Label>
            <Input
              id="base_kitchen_price"
              type="number"
              step="0.01"
              value={pricingInfo.base_kitchen_price}
              onChange={(e) => handleInputChange('base_kitchen_price', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="base_bathroom_price">Basisprijs badkamer</Label>
            <Input
              id="base_bathroom_price"
              type="number"
              step="0.01"
              value={pricingInfo.base_bathroom_price}
              onChange={(e) => handleInputChange('base_bathroom_price', e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="price_info_text">Prijs Info Tekst</Label>
            <Input
              id="price_info_text"
              value={pricingInfo.price_info_text}
              onChange={(e) => handleInputChange('price_info_text', e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-4">
            <input
              type="checkbox"
              id="ontkoppelingsmat_included"
              checked={pricingInfo.ontkoppelingsmat_included}
              onChange={(e) => handleInputChange('ontkoppelingsmat_included', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="ontkoppelingsmat_included" className="cursor-pointer">
              Ontkoppelingsmat inbegrepen
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="chape_primer_included"
              checked={pricingInfo.chape_primer_included}
              onChange={(e) => handleInputChange('chape_primer_included', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="chape_primer_included" className="cursor-pointer">
              Chape primer inbegrepen
            </Label>
          </div>
        </div>
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Opslaan...
            </>
          ) : (
            'Wijzigingen opslaan'
          )}
        </Button>
      </div>
    </div>
  );
};

export default BaseRatesEditor;
