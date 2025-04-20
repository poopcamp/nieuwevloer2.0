
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BaseRatesEditor from "./BaseRatesEditor";
import PricePreview from "./PricePreview";
import TileFormatManager from "./TileFormatManager";
import TileTypeManager from "./TileTypeManager";
import ExtraOptionsManager from "./ExtraOptionsManager";
import ProjectTypeRates from "./rates/ProjectTypeRates";

const CalculatorPricingManager = () => {
  const [previewConfig, setPreviewConfig] = useState({
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

  // Monitor voor updates die voorbeeldberekening moeten bijwerken
  const handleUpdatePreview = (config: any) => {
    setPreviewConfig(prev => ({
      ...prev,
      ...config
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calculator Prijsstructuur</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="base" className="space-y-4">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 w-full">
                  <TabsTrigger value="base">Basistarief</TabsTrigger>
                  <TabsTrigger value="vloer-formaten">Vloertegel Formaten</TabsTrigger>
                  <TabsTrigger value="vloer-types">Vloertegel Types</TabsTrigger>
                  <TabsTrigger value="vloer-opties">Extra Opties Vloer</TabsTrigger>
                  <TabsTrigger value="wand-formaten">Wandtegel Formaten</TabsTrigger>
                  <TabsTrigger value="wand-types">Wandtegel Types</TabsTrigger>
                  <TabsTrigger value="wand-opties">Extra Opties Wand</TabsTrigger>
                  <TabsTrigger value="legacy-rates">Legacy Tarieven</TabsTrigger>
                </TabsList>

                <TabsContent value="base">
                  <BaseRatesEditor onUpdatePreview={handleUpdatePreview} />
                </TabsContent>
                
                <TabsContent value="vloer-formaten">
                  <TileFormatManager tileType="floor" />
                </TabsContent>
                
                <TabsContent value="vloer-types">
                  <TileTypeManager category="floor" />
                </TabsContent>
                
                <TabsContent value="vloer-opties">
                  <ExtraOptionsManager category="floor" />
                </TabsContent>
                
                <TabsContent value="wand-formaten">
                  <TileFormatManager tileType="wall" />
                </TabsContent>
                
                <TabsContent value="wand-types">
                  <TileTypeManager category="wall" />
                </TabsContent>
                
                <TabsContent value="wand-opties">
                  <ExtraOptionsManager category="wall" />
                </TabsContent>

                <TabsContent value="legacy-rates">
                  <ProjectTypeRates projectType="vloer" onUpdatePreview={handleUpdatePreview} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <PricePreview config={previewConfig} setConfig={setPreviewConfig} />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Hulp & Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              <strong>Prijsberekening tegelplaatsing:</strong> De totaalprijs wordt berekend op basis van het basistarief per m², 
              vermenigvuldigd met de multiplier van het gekozen tegelformaat en tegeltype, plus eventuele extra opties.
            </p>
            
            <p>
              <strong>Basistarief:</strong> Dit is de startprijs per vierkante meter voor tegelplaatsing zonder extra's.
            </p>
            
            <p>
              <strong>Tegelformaten:</strong> Voor elk formaat tegel kunt u een prijsmultiplier instellen. 
              Bijvoorbeeld: 60x60 cm = 1.0 (standaard), 120x120 cm = 1.4 (40% duurder dan standaard).
            </p>
            
            <p>
              <strong>Extra opties:</strong> Additionele werkzaamheden of materialen die apart berekend worden, 
              zoals chapewerken of hoekprofielen.
            </p>
            
            <p>
              <strong>Minimumprijs:</strong> De minimale prijs die in rekening wordt gebracht, ongeacht de berekende prijs.
              Dit zorgt ervoor dat kleine projecten rendabel blijven.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculatorPricingManager;
