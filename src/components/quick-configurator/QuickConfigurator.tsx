
import { useMemo } from "react";
import { useQuickConfigurator } from "@/components/quick-configurator/hooks/useQuickConfigurator";
import TileFormatSelector from "@/components/quick-configurator/TileFormatSelector";
import AreaInput from "@/components/quick-configurator/AreaInput";
import PriceDisplay from "@/components/quick-configurator/PriceDisplay";
import IncludedFeatures from "@/components/configurator/summary/IncludedFeatures";
import AppointmentRequestDialog from "@/components/appointment-request/AppointmentRequestDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const QuickConfigurator = () => {
  const {
    selectedTileFormat,
    setSelectedTileFormat,
    squareMeters,
    setSquareMeters,
    calculatedPrice,
    installationPrice,
    tileOptions,
    isLoading,
    connectionError,
    appointmentDialogOpen,
    setAppointmentDialogOpen,
    basePricePerSqm,
    wantsToBuyTiles,
    setWantsToBuyTiles,
    tilePricePerSqm,
    setTilePricePerSqm,
    squareMetersWithCuttingLoss,
    tileCost,
    retryConnection,
    connectionAttempts
  } = useQuickConfigurator();

  // Default to recht pattern for quick configurator
  const selectedPattern = "recht";

  // Handle tile price input change
  const handleTilePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(',', '.');
    const parsedValue = parseFloat(value);
    
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setTilePricePerSqm(parsedValue);
    } else if (value === '') {
      setTilePricePerSqm(null);
    }
  };
  
  // Explicitly handle yes/no button clicks with console logging
  const handleYesClick = () => {
    console.log("Yes button clicked in QuickConfigurator - Setting wantsToBuyTiles to TRUE");
    setWantsToBuyTiles(true);
    // Als we van nee naar ja wisselen, eventuele tegelprijs resetten
    if (!wantsToBuyTiles) {
      setTilePricePerSqm(null);
    }
  };

  const handleNoClick = () => {
    console.log("No button clicked in QuickConfigurator - Setting wantsToBuyTiles to FALSE");
    setWantsToBuyTiles(false);
  };
  
  // Handle appointment request button click
  const handleAppointmentRequest = () => {
    console.log("Opening appointment dialog");
    setAppointmentDialogOpen(true);
  };
  
  // Handle "Uitgebreide calculator" button click
  const handleDetailedCalculator = () => {
    console.log("Navigating to detailed calculator");
    window.location.href = "/configurator";
  };
  
  // Memoize component sections to prevent unnecessary re-renders
  const tileFormatSelectorSection = useMemo(() => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Tegelformaat</h3>
      <TileFormatSelector 
        selectedFormat={selectedTileFormat}
        onChange={setSelectedTileFormat}
        options={tileOptions}
        isLoading={isLoading}
        error={connectionError}
      />
      
      {connectionError && connectionAttempts > 0 && (
        <div className="mt-3 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={retryConnection} 
            className="text-xs"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${connectionAttempts > 0 ? 'animate-spin' : ''}`} />
            Opnieuw verbinden
          </Button>
        </div>
      )}
    </div>
  ), [selectedTileFormat, tileOptions, isLoading, connectionError, retryConnection, connectionAttempts]);

  const areaInputSection = useMemo(() => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Oppervlakte (m²)</h3>
      <AreaInput 
        value={squareMeters}
        onChange={setSquareMeters}
      />
    </div>
  ), [squareMeters]);
  
  return (
    <div className="max-w-3xl mx-auto py-4 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 space-y-6">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Snelle Prijsindicatie</h1>
            <p className="text-sm text-gray-600 mt-1">Vloertegelplaatsing</p>
          </div>
          
          <div className="space-y-6">
            {tileFormatSelectorSection}
            {areaInputSection}
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Wil je dat wij zorgen voor de tegels?
              </h3>
              
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={handleYesClick} 
                  className={`py-3 px-4 rounded-md border text-center transition-all ${
                    wantsToBuyTiles 
                      ? "bg-teal-600 text-white border-teal-700 hover:bg-teal-700" 
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Ja
                </button>
                
                <button
                  type="button"
                  onClick={handleNoClick}
                  className={`py-3 px-4 rounded-md border text-center transition-all ${
                    wantsToBuyTiles === false
                      ? "bg-teal-600 text-white border-teal-700 hover:bg-teal-700" 
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Nee
                </button>
              </div>
              
              {wantsToBuyTiles === false && (
                <div className="mt-4 animate-fadeIn">
                  <Label htmlFor="tilePrice" className="text-sm text-gray-700">
                    Prijs per m² van uw tegel (incl. btw)
                  </Label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
                    <Input
                      id="tilePrice"
                      type="text"
                      value={tilePricePerSqm || ''}
                      onChange={handleTilePriceChange}
                      className="pl-7"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    We rekenen 10% snijverlies
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2">
          <PriceDisplay 
            calculatedPrice={calculatedPrice}
            installationPrice={installationPrice}
            squareMeters={squareMeters}
            selectedTileFormat={selectedTileFormat}
            tileOptions={tileOptions}
            onRequestAppointment={handleAppointmentRequest}
            isLoading={isLoading}
            basePricePerSqm={basePricePerSqm}
            wantsToBuyTiles={wantsToBuyTiles}
            tilePricePerSqm={tilePricePerSqm}
            squareMetersWithCuttingLoss={squareMetersWithCuttingLoss}
            tileCost={tileCost}
          />
          
          <div className="mt-6">
            <IncludedFeatures 
              selectedTileSize={selectedTileFormat} 
              selectedPattern={selectedPattern}
            />
          </div>
          
          <div className="mt-4">
            <button 
              onClick={handleDetailedCalculator}
              className="w-full py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-800 hover:bg-gray-50 transition-colors"
            >
              Uitgebreide calculator
            </button>
          </div>
        </div>
      </div>

      <AppointmentRequestDialog
        open={appointmentDialogOpen}
        onOpenChange={setAppointmentDialogOpen}
        tileFormat={tileOptions.find(o => o.value === selectedTileFormat)?.label || selectedTileFormat}
        squareMeters={squareMeters}
        calculatedPrice={calculatedPrice}
        wantsToBuyTiles={wantsToBuyTiles}
        tilePricePerSqm={tilePricePerSqm}
        squareMetersWithCuttingLoss={squareMetersWithCuttingLoss}
        tileCost={tileCost}
      />
    </div>
  );
};

export default QuickConfigurator;
