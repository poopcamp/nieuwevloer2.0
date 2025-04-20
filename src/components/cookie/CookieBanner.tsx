
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";

interface CookieBannerProps {
  onAcceptAll: () => void;
  onCustomize: () => void;
}

const CookieBanner = ({ onAcceptAll, onCustomize }: CookieBannerProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-200 p-4 md:p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Wij respecteren uw privacy</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Wij gebruiken cookies om uw ervaring te verbeteren, statistieken bij te houden en relevante 
              advertenties te tonen. Door op "Alles accepteren" te klikken, stemt u in met ons gebruik van alle cookies. 
              U kunt uw voorkeuren aanpassen door op "Voorkeuren aanpassen" te klikken.
            </p>
            <div className="mt-2">
              <Link to="/privacy" className="text-primary text-sm flex items-center hover:underline">
                <Info className="h-3 w-3 mr-1" /> Meer informatie in onze privacyverklaring
              </Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onCustomize}
            >
              Voorkeuren aanpassen
            </Button>
            <Button 
              size="sm"
              onClick={onAcceptAll}
              className="gap-1"
            >
              Alles accepteren
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
