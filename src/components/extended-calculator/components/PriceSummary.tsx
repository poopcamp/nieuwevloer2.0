
import { ExtendedProject, TileStyle, TileFormat, CalculatorOption, PriceBreakdown } from '../types';
import { formatPrice } from '@/utils/configuratorPricing';
import { Separator } from '@/components/ui/separator';
import { DollarSign, ExternalLink } from 'lucide-react';

interface PriceSummaryProps {
  priceBreakdown: PriceBreakdown;
  selectedProject: ExtendedProject | null;
  selectedTileStyle: TileStyle | null;
  selectedTileFormat: TileFormat | null;
  selectedOptions: CalculatorOption[];
}

const PriceSummary = ({
  priceBreakdown,
  selectedProject,
  selectedTileStyle,
  selectedTileFormat,
  selectedOptions
}: PriceSummaryProps) => {
  const {
    basePricePerSqm,
    squareMeters,
    subtotalBase,
    optionsCost,
    totalCustomerPrice,
    cuttingLossPercentage
  } = priceBreakdown;

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <DollarSign className="h-5 w-5 mr-2 text-gray-600" />
        <h3 className="text-base font-medium">Prijsoverzicht</h3>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span>Basisprijs per m²:</span>
          <span className="font-medium">{formatPrice(basePricePerSqm)}/m²</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Oppervlakte:</span>
          <span>{squareMeters} m²</span>
        </div>
        
        {selectedTileStyle && (
          <div className="flex justify-between text-sm">
            <span>Tegelstijl:</span>
            <span>{selectedTileStyle.name}</span>
          </div>
        )}
        
        {selectedTileFormat && (
          <div className="flex justify-between text-sm">
            <span>Tegelformaat:</span>
            <span>{selectedTileFormat.name} ({selectedTileFormat.dimensions})</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span>Subtotaal:</span>
          <span className="font-medium">{formatPrice(subtotalBase)}</span>
        </div>
        
        {selectedOptions.length > 0 && (
          <>
            <Separator className="my-2" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Extra opties:</span>
                <span>{formatPrice(optionsCost)}</span>
              </div>
              
              {selectedOptions.map(option => (
                <div key={option.id} className="flex justify-between text-sm pl-4 text-gray-600">
                  <span>- {option.name}</span>
                  {option.price_addition > 0 && (
                    <span>{formatPrice(option.price_addition)}</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        
        <Separator className="my-2" />
        
        <div className="flex justify-between text-base">
          <span className="font-medium">Totaal (excl. BTW):</span>
          <span className="font-bold text-primary">{formatPrice(totalCustomerPrice)}</span>
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          <p>
            * Richtprijs inclusief plaatsing, lijm en voegmiddel.
          </p>
          <p>
            * {cuttingLossPercentage}% snijverlies inbegrepen.
          </p>
          <p>
            * Excl. BTW en tegels.
          </p>
          <p className="flex items-center mt-1">
            <ExternalLink className="h-3 w-3 mr-1" />
            <a href="/waarom-richtprijzen" className="underline hover:text-primary">
              Waarom richtprijzen?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceSummary;
