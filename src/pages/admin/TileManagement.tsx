
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TileTypeManager from '@/components/admin/tile-management/TileTypeManager';
import TileSizeManager from '@/components/admin/tile-management/TileSizeManager';
import TileStyleManager from '@/components/admin/tile-management/TileStyleManager';
import ExtraOptionsManager from '@/components/admin/tile-management/ExtraOptionsManager';
import TileExamplesManager from '@/components/admin/home/tile-examples/TileExamplesManager';
import WallTypesManager from '@/components/admin/tile-management/WallTypesManager';
import WallTileSizeManager from '@/components/admin/tile-management/WallTileSizeManager';
import TileFormatsManager from '@/components/admin/tile-management/calculator/TileFormatsManager';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const AdminTilePage = () => {
  const [activeTab, setActiveTab] = useState('tile-types');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tegels Beheer</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle>Snelle Prijsindicatie</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-muted-foreground mb-6">
              Beheer de opties en prijzen voor de eenvoudige prijsindicatie op de homepage.
            </p>
            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center">✓ Tegelformaten (30x30, 60x60, etc.)</li>
              <li className="flex items-center">✓ Basisprijs per m²</li>
              <li className="flex items-center">✓ Snijverlies (vaste 10%)</li>
            </ul>
            <Button asChild>
              <Link to="/admin/quick-calculator">
                Beheer Snelle Calculator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle>Uitgebreide Calculator</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-muted-foreground mb-6">
              Beheer de geavanceerde calculator met uitgebreide opties en projecttypes.
            </p>
            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center">✓ Vloertegels, wandtegels, meerdere projecttypes</li>
              <li className="flex items-center">✓ Verschillende prijsmodules per type</li>
              <li className="flex items-center">✓ Extra opties (chape, elektriciteit, etc.)</li>
            </ul>
            <Button asChild>
              <Link to="/admin/extended-calculator">
                Beheer Uitgebreide Calculator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Algemene Tegels & Stijlen</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="overflow-x-auto whitespace-nowrap w-full pb-1">
              <TabsTrigger value="tile-types">Tegelsoorten</TabsTrigger>
              <TabsTrigger value="tile-sizes">Tegelmaten</TabsTrigger>
              <TabsTrigger value="wall-types">Wandtypes</TabsTrigger>
              <TabsTrigger value="wall-tile-sizes">Wandtegelmaten</TabsTrigger>
              <TabsTrigger value="tile-styles">Tegelstijlen</TabsTrigger>
              <TabsTrigger value="tile-formats">Tegelformaten</TabsTrigger>
              <TabsTrigger value="extra-options">Extra Opties</TabsTrigger>
              <TabsTrigger value="tile-examples">Tegelvoorbeelden</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tile-types">
              <TileTypeManager />
            </TabsContent>
            
            <TabsContent value="tile-sizes">
              <TileSizeManager />
            </TabsContent>
            
            <TabsContent value="wall-types">
              <WallTypesManager />
            </TabsContent>
            
            <TabsContent value="wall-tile-sizes">
              <WallTileSizeManager />
            </TabsContent>
            
            <TabsContent value="tile-styles">
              <TileStyleManager />
            </TabsContent>
            
            <TabsContent value="tile-formats">
              <TileFormatsManager />
            </TabsContent>
            
            <TabsContent value="extra-options">
              <ExtraOptionsManager />
            </TabsContent>
            
            <TabsContent value="tile-examples">
              <TileExamplesManager />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTilePage;
