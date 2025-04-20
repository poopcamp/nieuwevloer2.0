
import { Card } from "@/components/ui/card";
import { InfoIcon, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const DisclaimerCard = () => {
  return (
    <Card className="overflow-hidden border-0 shadow-sm mt-6 bg-gray-50">
      <div className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <h3 className="text-sm font-medium text-gray-700">Juridische disclaimer</h3>
        </div>
        
        <p className="text-xs text-gray-600 leading-relaxed">
          Alle prijzen zijn richtprijzen excl. BTW en zonder tegels, onder voorbehoud van plaatsbezoek en 
          technische evaluatie volgens Buildwise-aanbevelingen. 
          NieuweVloer.be werkt met erkende partners. Voor extra werken zoals sanitair of 
          elektriciteit ontvangt u een afzonderlijke offerte.
        </p>
        
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-start gap-2">
            <InfoIcon className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500">
              De aanbiedingen en richtprijzen in deze configurator zijn 30 dagen geldig vanaf de offertedatum.
              Bekijk onze volledige <Link to="/privacy" className="text-primary hover:underline">algemene voorwaarden</Link>.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DisclaimerCard;
