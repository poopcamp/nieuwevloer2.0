
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { inspirationTiles } from "@/components/home/inspiration/inspirationData";
import { InspirationTile } from "@/components/home/inspiration/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExternalLink } from "lucide-react";
import { TileExample } from "@/types/homeContent";
import StepBasedConfigurator from "@/components/configurator/StepBasedConfigurator";

const Configurator = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectType = searchParams.get("projectType");
  const styleId = searchParams.get("style");
  const styleTitle = searchParams.get("title");
  const tileName = searchParams.get("tile");
  const tileSize = searchParams.get("size");
  
  const [selectedStyle, setSelectedStyle] = useState<InspirationTile | null>(null);
  const [selectedTile, setSelectedTile] = useState<TileExample | null>(null);
  
  useEffect(() => {
    // Als er een stijl ID is doorgegeven, zoek dan de stijl op in de inspirationTiles
    if (styleId) {
      const styleIdNum = parseInt(styleId, 10);
      const style = inspirationTiles.find(tile => tile.id === styleIdNum);
      if (style) {
        setSelectedStyle(style);
      }
    }
    
    // Als er een tegel is doorgegeven, sla die informatie op
    if (tileName && tileSize) {
      setSelectedTile({
        id: `selected-${Date.now()}`,
        name: tileName,
        size: tileSize,
        image: "", // We hebben de afbeelding niet in de URL, deze wordt niet getoond
        description: "Geselecteerde tegel uit onze voorbeelden"
      });
    }
  }, [styleId, tileName, tileSize]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Tegelconfigurator | NieuweVloer.be</title>
        <meta name="description" content="Bereken in 1 minuut uw richtprijs voor tegels en plaatsing. Eenvoudig en snel een accurate prijsindicatie krijgen." />
        <meta name="keywords" content="tegelconfigurator,tegels berekenen,tegelprijs,vloertegels,wandtegels,offerte tegels" />
        <meta property="og:title" content="Tegelconfigurator | NieuweVloer.be" />
        <meta property="og:description" content="Bereken in 1 minuut uw richtprijs voor tegels en plaatsing. Stap voor stap naar een accurate offerte." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nieuwevloer.be/configurator" />
      </Helmet>
      
      <Navbar />
      <main className="flex-grow py-6 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Tegelconfigurator</h1>
              
              {selectedStyle && (
                <div className="bg-primary-50 p-4 rounded-lg flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={selectedStyle.image} 
                      alt={selectedStyle.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/placeholder-tile.jpg";
                      }}
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-primary-600">Geselecteerde inspiratiestijl</p>
                    <p className="text-base font-bold">{selectedStyle.title}</p>
                  </div>
                </div>
              )}
              
              {selectedTile && (
                <Alert className="mb-6 bg-blue-50 border-blue-200">
                  <div className="flex items-center">
                    <ExternalLink className="h-5 w-5 text-blue-600 mr-2" />
                    <AlertTitle>Geselecteerde tegel</AlertTitle>
                  </div>
                  <AlertDescription className="mt-2">
                    U heeft gekozen voor <strong>{selectedTile.name}</strong> ({selectedTile.size})
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="px-4 sm:px-0">
              <StepBasedConfigurator initialProjectType={projectType || undefined} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Configurator;
