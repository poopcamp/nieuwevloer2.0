
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";
import { PricingInfo } from "@/types/homeContent";

const HomeInfoManager = () => {
  const [pricingInfo, setPricingInfo] = useState<PricingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPricingInfo();
  }, []);

  const fetchPricingInfo = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pricing_info')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPricingInfo(data);
      } else {
        // Initialize with default values if no record exists
        setPricingInfo({
          id: crypto.randomUUID(),
          base_m2_price: 45,
          base_bathroom_price: 1200,
          base_kitchen_price: 950,
          ontkoppelingsmat_included: true,
          chape_primer_included: true,
          voegmiddel_included: true,
          lijm_included: true,
          kit_included: false,
          waterafstotende_voeg_included: false,
          vloerverwarming_included: false,
          discount_percentage: 0,
          price_info_text: "Plaatsing (incl lijm + Voegkleur grijs) Excl Tegels!"
        });
      }
    } catch (error: any) {
      console.error('Error fetching pricing info:', error);
      toast({
        title: "Fout bij ophalen",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PricingInfo, value: any) => {
    if (!pricingInfo) return;
    
    setPricingInfo({
      ...pricingInfo,
      [field]: value
    });
  };

  const savePricingInfo = async () => {
    if (!pricingInfo) return;
    
    setSaving(true);
    try {
      const { data, error: selectError } = await supabase
        .from('pricing_info')
        .select('id')
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }

      let saveError;
      if (data) {
        // Update existing record
        const { error } = await supabase
          .from('pricing_info')
          .update(pricingInfo)
          .eq('id', data.id);
        saveError = error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('pricing_info')
          .insert(pricingInfo);
        saveError = error;
      }

      if (saveError) throw saveError;

      toast({
        title: "Opgeslagen",
        description: "Prijsinformatie is succesvol bijgewerkt.",
      });
    } catch (error: any) {
      console.error('Error saving pricing info:', error);
      toast({
        title: "Fout bij opslaan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleIncludedItem = (field: keyof PricingInfo) => {
    if (!pricingInfo) return;
    if (typeof pricingInfo[field] !== 'boolean') return;
    
    setPricingInfo({
      ...pricingInfo,
      [field]: !pricingInfo[field]
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beheer Prijsinformatie</CardTitle>
        <CardDescription>
          Bewerk de prijsinformatie die wordt weergegeven in de calculator en configurator.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : pricingInfo ? (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Basis Prijzen</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="base-m2-price">Basis prijs per m² (€)</Label>
                  <Input 
                    id="base-m2-price"
                    type="number"
                    min="0"
                    step="0.5"
                    value={pricingInfo.base_m2_price}
                    onChange={(e) => handleInputChange('base_m2_price', parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-gray-500">Dit is de basistariefprijs per vierkante meter.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="base-bathroom-price">Basis prijs badkamer (€)</Label>
                  <Input 
                    id="base-bathroom-price"
                    type="number"
                    min="0"
                    step="10"
                    value={pricingInfo.base_bathroom_price}
                    onChange={(e) => handleInputChange('base_bathroom_price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="base-kitchen-price">Basis prijs keuken (€)</Label>
                  <Input 
                    id="base-kitchen-price"
                    type="number"
                    min="0"
                    step="10"
                    value={pricingInfo.base_kitchen_price}
                    onChange={(e) => handleInputChange('base_kitchen_price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discount-percentage">Korting percentage (%)</Label>
                  <Input 
                    id="discount-percentage"
                    type="number"
                    min="0"
                    max="100"
                    value={pricingInfo.discount_percentage}
                    onChange={(e) => handleInputChange('discount_percentage', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Inclusief Items</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="ontkoppelingsmat" 
                      checked={pricingInfo.ontkoppelingsmat_included}
                      onChange={() => toggleIncludedItem('ontkoppelingsmat_included')}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="ontkoppelingsmat">Ontkoppelingsmat</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="chape-primer" 
                      checked={pricingInfo.chape_primer_included}
                      onChange={() => toggleIncludedItem('chape_primer_included')}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="chape-primer">Chape primer</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="voegmiddel" 
                      checked={pricingInfo.voegmiddel_included}
                      onChange={() => toggleIncludedItem('voegmiddel_included')}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="voegmiddel">Voegmiddel</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="lijm" 
                      checked={pricingInfo.lijm_included}
                      onChange={() => toggleIncludedItem('lijm_included')}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="lijm">Lijm</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="kit" 
                      checked={pricingInfo.kit_included}
                      onChange={() => toggleIncludedItem('kit_included')}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="kit">Afkitten</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="waterafstotende-voeg" 
                      checked={pricingInfo.waterafstotende_voeg_included}
                      onChange={() => toggleIncludedItem('waterafstotende_voeg_included')}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="waterafstotende-voeg">Waterafstotende voeg</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="vloerverwarming" 
                      checked={pricingInfo.vloerverwarming_included}
                      onChange={() => toggleIncludedItem('vloerverwarming_included')}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="vloerverwarming">Vloerverwarming</Label>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label htmlFor="price-info-text">Prijsinfo tekst</Label>
                  <Input 
                    id="price-info-text"
                    value={pricingInfo.price_info_text}
                    onChange={(e) => handleInputChange('price_info_text', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Deze tekst wordt weergegeven onder de totaalprijs in de calculator.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                onClick={savePricingInfo} 
                disabled={saving}
                className="gap-2"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Prijsinformatie Opslaan
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default HomeInfoManager;
