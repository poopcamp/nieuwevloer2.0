
import { Button } from "@/components/ui/button";
import { ConfiguratorState } from "../types";
import { formatPrice } from "@/utils/configuratorPricing";
import { CalendarDays } from "lucide-react";

interface TotalPriceProps {
  price: number;
  priceDisplay: string;
  isRequestPrice: boolean;
  state: ConfiguratorState;
  onRequestAppointment: () => void;
  wantsToBuyTiles: boolean;
  tilePricePerSqm: number | undefined;
  squareMetersWithCuttingLoss: number;
  tileCost: number;
  hasRequiredSelections?: boolean;
}

const TotalPrice = ({
  price,
  priceDisplay,
  isRequestPrice,
  state,
  onRequestAppointment,
  wantsToBuyTiles,
  tilePricePerSqm,
  squareMetersWithCuttingLoss,
  tileCost,
  hasRequiredSelections = true,
}: TotalPriceProps) => {
  // Formatteren van de totale prijs inclusief tegels indien van toepassing
  const formatTotalPrice = () => {
    if (isRequestPrice) return "Op aanvraag";

    if (wantsToBuyTiles && tilePricePerSqm && squareMetersWithCuttingLoss > 0) {
      const totalPrice = price + tileCost;
      return formatPrice(totalPrice.toString());
    }

    return priceDisplay;
  };

  if (!hasRequiredSelections) {
    return (
      <div className="mt-6 text-center">
        <p className="text-gray-500 mb-4">
          Maak uw projectkeuzes om een prijsschatting te zien
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-700">Totale richtprijs</h3>
          <p className="text-sm text-gray-500">Exclusief BTW</p>
          {wantsToBuyTiles && (
            <div className="mt-1 text-xs text-gray-500">
              Incl. tegels: {formatPrice(tileCost.toString())}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary">
            {formatTotalPrice()}
          </div>
        </div>
      </div>

      <Button
        onClick={onRequestAppointment}
        className="w-full py-6 text-lg"
      >
        <CalendarDays className="mr-2 h-5 w-5" />
        Afspraak inplannen
      </Button>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Ontvang een exacte prijsofferte na een vrijblijvend plaatsbezoek
      </p>
    </div>
  );
};

export default TotalPrice;
