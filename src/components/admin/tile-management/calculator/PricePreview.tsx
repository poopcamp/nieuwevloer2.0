
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getPriceByArea, getFloorTypeMultiplier } from "@/utils/pricing/basePricing";

// Define a simplified preview config type to avoid the error
interface PreviewConfig {
  projectType: string;
  tileSize: string;
  floorType: string;
  squareMeters: number;
  needPlinths: boolean;
  needsChape: boolean;
  tilePattern: string;
  wallType: string;
  wallTileSize: string;
  bathroomTileSize: string;
  bathroomOptions: {
    floor: boolean;
    showerWall: boolean;
    walkInShower: boolean;
    shower: boolean;
  };
  needsElectrician: boolean;
  fullBathroomRenovation: boolean;
  [key: string]: any;
}

interface PricePreviewProps {
  config: PreviewConfig;
  setConfig: (config: PreviewConfig) => void;
}

const PricePreview = ({ config, setConfig }: PricePreviewProps) => {
  const [price, setPrice] = useState<number | null>(null);

  // Calculate price based on configuration
  useEffect(() => {
    if (config.projectType === "vloer") {
      // For floor projects
      let basePrice = getPriceByArea(config.tileSize, config.squareMeters);
      let multiplier = getFloorTypeMultiplier(config.floorType);
      let total = basePrice * multiplier * config.squareMeters;
      
      // Add plinths cost if needed
      if (config.needPlinths) {
        const perimeter = Math.ceil(Math.sqrt(config.squareMeters) * 4);
        total += 15 * perimeter;
      }
      
      // Add chape costs if needed
      if (config.needsChape) {
        total += 25 * config.squareMeters;
      }
      
      setPrice(total);
    } else if (config.projectType === "wand") {
      // Simple wall pricing for now
      const basePrice = 31; // Base price per sqm for walls
      setPrice(basePrice * config.squareMeters);
    } else if (config.projectType === "badkamer") {
      // Simple bathroom pricing for now
      const basePrice = 65; // Base price per sqm for bathrooms
      setPrice(basePrice * config.squareMeters);
    }
  }, [config]);

  // Handle config changes
  const handleChange = (key: string, value: any) => {
    setConfig({
      ...config,
      [key]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prijsvoorbeeld</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="config">
          <TabsList className="mb-4">
            <TabsTrigger value="config">Configuratie</TabsTrigger>
            <TabsTrigger value="price">Prijs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="config">
            <div className="space-y-4">
              <div>
                <Label htmlFor="preview-project-type">Projecttype</Label>
                <select 
                  id="preview-project-type"
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  value={config.projectType}
                  onChange={(e) => handleChange('projectType', e.target.value)}
                >
                  <option value="vloer">Vloerbetegeling</option>
                  <option value="wand">Wandbetegeling</option>
                  <option value="badkamer">Badkamerbetegeling</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="preview-area">Oppervlakte (m²)</Label>
                <Input 
                  id="preview-area"
                  type="number" 
                  min="1"
                  value={config.squareMeters}
                  onChange={(e) => handleChange('squareMeters', parseInt(e.target.value) || 1)}
                />
              </div>
              
              {config.projectType === "vloer" && (
                <>
                  <div>
                    <Label htmlFor="preview-floor-type">Vloertype</Label>
                    <select 
                      id="preview-floor-type"
                      className="w-full border border-gray-300 rounded-md p-2 mt-1"
                      value={config.floorType}
                      onChange={(e) => handleChange('floorType', e.target.value)}
                    >
                      <option value="betonlook">Betonlook</option>
                      <option value="marmerlook">Marmerlook</option>
                      <option value="houtlook">Houtlook</option>
                      <option value="natuursteen">Natuursteen</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="preview-tile-size">Tegelformaat</Label>
                    <select 
                      id="preview-tile-size"
                      className="w-full border border-gray-300 rounded-md p-2 mt-1"
                      value={config.tileSize}
                      onChange={(e) => handleChange('tileSize', e.target.value)}
                    >
                      <option value="30x30">30x30 cm</option>
                      <option value="60x60">60x60 cm</option>
                      <option value="80x80">80x80 cm</option>
                      <option value="90x90">90x90 cm</option>
                      <option value="120x60">120x60 cm</option>
                      <option value="120x120">120x120 cm</option>
                      <option value="parket">Parket tegels</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="preview-plinths"
                      checked={config.needPlinths}
                      onCheckedChange={(checked) => handleChange('needPlinths', checked)}
                    />
                    <Label htmlFor="preview-plinths">Plinten nodig</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="preview-chape"
                      checked={config.needsChape}
                      onCheckedChange={(checked) => handleChange('needsChape', checked)}
                    />
                    <Label htmlFor="preview-chape">Chapewerken nodig</Label>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="price">
            <div className="space-y-4">
              <div className="p-6 bg-gray-50 rounded-lg border text-center">
                <p className="text-sm text-gray-500 mb-1">Berekende Richtprijs</p>
                <p className="text-3xl font-bold text-primary">
                  {price !== null ? `€${price.toFixed(2)}` : 'Geen prijs'}
                </p>
                <p className="text-xs text-gray-400 mt-1">excl. BTW</p>
              </div>
              
              <p className="text-sm text-gray-500">
                Deze prijs is een indicatie gebaseerd op de huidige instellingen in het calculatorbeheer.
              </p>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  // Reset to default configuration
                  setConfig({
                    projectType: "vloer",
                    tileSize: "60x60",
                    floorType: "betonlook",
                    squareMeters: 15,
                    needPlinths: true,
                    needsChape: false,
                    tilePattern: "recht",
                    wallType: "keramisch",
                    wallTileSize: "30x60",
                    bathroomTileSize: "30x30",
                    bathroomOptions: {
                      floor: true,
                      showerWall: false,
                      walkInShower: false,
                      shower: false
                    },
                    needsElectrician: false,
                    fullBathroomRenovation: false
                  });
                }}
              >
                Reset voorbeeld
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PricePreview;
