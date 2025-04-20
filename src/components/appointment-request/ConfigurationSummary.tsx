
import { formatCurrency } from "@/utils/formatters";

interface ConfigurationSummaryProps {
  tileFormat: string;
  squareMeters: number;
  calculatedPrice: number | null;
  wantsToBuyTiles?: boolean;
  tilePricePerSqm?: number | null;
  squareMetersWithCuttingLoss?: number;
  tileCost?: number;
}

const ConfigurationSummary = ({ 
  tileFormat, 
  squareMeters, 
  calculatedPrice,
  wantsToBuyTiles,
  tilePricePerSqm,
  squareMetersWithCuttingLoss,
  tileCost
}: ConfigurationSummaryProps) => {
  return (
    <div className="px-6 py-3">
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Uw configuratie</h3>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          <div className="text-gray-600">Tegelformaat:</div>
          <div className="font-medium text-right">{tileFormat}</div>
          
          <div className="text-gray-600">Oppervlakte:</div>
          <div className="font-medium text-right">{squareMeters} m²</div>
          
          <div className="text-gray-600">Richtprijs:</div>
          <div className="font-medium text-right text-primary">
            {calculatedPrice ? formatCurrency(calculatedPrice) : '€ 0,00'}
          </div>
          
          {wantsToBuyTiles && tilePricePerSqm && tileCost && (
            <>
              <div className="text-gray-600 text-xs col-span-2 mt-1 pt-1 border-t border-gray-200">
                Inclusief tegels:
              </div>
              <div className="text-gray-600 text-xs">Prijs per m²:</div>
              <div className="text-xs font-medium text-right">
                {formatCurrency(tilePricePerSqm)}
              </div>
              <div className="text-gray-600 text-xs">Tegelaankoop:</div>
              <div className="text-xs font-medium text-right">
                {formatCurrency(tileCost)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigurationSummary;
