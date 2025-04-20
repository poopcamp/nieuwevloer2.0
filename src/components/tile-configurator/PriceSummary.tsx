
import { Card, CardContent } from "@/components/ui/card";

interface PriceSummaryProps {
  totalPrice: number;
}

const PriceSummary = ({ totalPrice }: PriceSummaryProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Prijsindicatie</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tegels + plaatsing</span>
            <span>€{totalPrice} (excl. BTW)</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Totaalprijs</span>
              <span>€{totalPrice}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              * Dit is een indicatieve prijs. Voor een exacte offerte vragen wij u onderstaand formulier in te vullen.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceSummary;
