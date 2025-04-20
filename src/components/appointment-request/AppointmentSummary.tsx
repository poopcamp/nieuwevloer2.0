
import { formatCurrency } from "@/utils/formatters";

interface AppointmentSummaryProps {
  tileFormat: string;
  squareMeters: number;
  calculatedPrice: number | null;
  wantsToBuyTiles?: boolean;
  tilePricePerSqm?: number | null;
  squareMetersWithCuttingLoss?: number;
  tileCost?: number;
}

const AppointmentSummary = ({
  tileFormat,
  squareMeters,
  calculatedPrice,
  wantsToBuyTiles = false,
  tilePricePerSqm = null,
  squareMetersWithCuttingLoss = 0,
  tileCost = 0
}: AppointmentSummaryProps) => {
  // Safe price formatting to avoid NaN
  const formatSafePrice = (price: number | null): string => {
    if (price === null || isNaN(price)) {
      return "Prijs op aanvraag";
    }
    return formatCurrency(price);
  };

  return (
    <div className="bg-muted/50 rounded-md p-4 space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Tegelformaat:</span>
        <span className="font-medium">{tileFormat}</span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-gray-600">Oppervlakte:</span>
        <span className="font-medium">{squareMeters} m²</span>
      </div>
      
      <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
        <span className="text-gray-700 font-medium">Richtprijs (excl. tegels):</span>
        <span className="font-bold text-primary">
          {formatSafePrice(calculatedPrice)}
        </span>
      </div>
      
      <p className="text-xs text-gray-500">Excl. BTW, basisprijs indicatief tot plaatsbezoek</p>
      
      {!wantsToBuyTiles && tilePricePerSqm && tilePricePerSqm > 0 && (
        <div className="pt-2 mt-2 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-600">Tegels per m²:</span>
            <span className="font-medium">{formatCurrency(tilePricePerSqm)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Benodigde m² (+10%):</span>
            <span className="font-medium">{squareMetersWithCuttingLoss?.toFixed(1)} m²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Tegels totaal:</span>
            <span className="font-bold">{formatSafePrice(tileCost)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentSummary;
