
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const TechnicalDisclaimer = () => {
  return (
    <Card className="overflow-hidden border border-amber-200 shadow-sm my-6 bg-amber-50">
      <div className="p-4">
        <div className="flex items-start gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <h3 className="text-sm font-medium text-amber-800">Belangrijke informatie</h3>
        </div>
        
        <div className="text-xs text-amber-700 leading-relaxed space-y-2">
          <p>
            <strong>NieuweVloer.be is geen webshop.</strong> Alle getoonde prijzen zijn richtprijzen voor 
            professionele plaatsing, exclusief materialen (tegels) en exclusief BTW.
          </p>
          <p>
            Een definitieve offerte volgt pas na een plaatsbezoek waarbij we de situatie ter plaatse kunnen beoordelen.
            Eventuele ondergrondproblemen (bv. tegel op tegel plaatsing) of meerwerken zoals chapewerken 
            worden tijdens dit bezoek besproken.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TechnicalDisclaimer;
