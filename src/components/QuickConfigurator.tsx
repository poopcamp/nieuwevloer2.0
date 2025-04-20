
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import AppointmentRequestDialog from "@/components/appointment-request/AppointmentRequestDialog";
import TileFormatDialog from "@/components/appointment-request/TileFormatDialog";

// Simple placeholder component until we can implement the real dependencies
const QuickConfigurator = () => {
  const [wantsToBuyTiles, setWantsToBuyTiles] = useState<boolean>(true);
  const [tilePricePerSqm, setTilePricePerSqm] = useState<string>("");
  const [squareMeters, setSquareMeters] = useState<string>("10");
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("60x60");
  const [formatDialogOpen, setFormatDialogOpen] = useState(false);
  
  // Tile format options
  const tileFormatOptions = [
    { value: "30x30", label: "30 x 30 cm" },
    { value: "45x45", label: "45 x 45 cm" },
    { value: "60x60", label: "60 x 60 cm", selected: true },
    { value: "80x80", label: "80 x 80 cm" },
    { value: "90x90", label: "90 x 90 cm" },
    { value: "120x120", label: "120 x 120 cm" }
  ];
  
  // Handle tile price input change
  const handleTilePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTilePricePerSqm(e.target.value);
  };
  
  // Explicitly handle yes/no button clicks with console logging
  const handleYesClick = () => {
    console.log("Yes button clicked in QuickConfigurator");
    setWantsToBuyTiles(true);
    // Reset price when switching to Yes
    setTilePricePerSqm("");
  };

  const handleNoClick = () => {
    console.log("No button clicked in QuickConfigurator");
    setWantsToBuyTiles(false);
  };
  
  const handleSquareMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSquareMeters(e.target.value);
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
  
  // Handle format selection
  const handleFormatSelect = (format: string) => {
    console.log("Format selected:", format);
    setSelectedFormat(format);
  };
  
  // Handle format dialog open
  const handleFormatDialogOpen = () => {
    console.log("Opening tile format selector dialog");
    setFormatDialogOpen(true);
  };
  
  // Get the label of the selected format for display
  const selectedFormatLabel = tileFormatOptions.find(option => option.value === selectedFormat)?.label || selectedFormat;
  
  return (
    <div className="max-w-3xl mx-auto py-4 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 space-y-6">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Snelle Prijsindicatie</h1>
            <p className="text-sm text-gray-600 mt-1">Vloertegelplaatsing</p>
          </div>
          
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Tegelformaat</h3>
              <div 
                className="border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-all"
                onClick={handleFormatDialogOpen}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-3 rounded-full border-4 border-primary" />
                    <span className="text-sm">{selectedFormatLabel}</span>
                  </div>
                  <span className="text-xs text-gray-500">Klik om te wijzigen</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Oppervlakte (m²)</h3>
              <div className="relative">
                <Input 
                  type="text" 
                  inputMode="decimal" 
                  value={squareMeters} 
                  onChange={handleSquareMetersChange}
                  className="pr-10" 
                  placeholder="Voer oppervlakte in" 
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  m²
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Wil je dat wij zorgen voor de tegels?
              </h3>
              
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={handleYesClick} 
                  className={`flex items-center justify-center py-3 px-4 rounded-md border text-center transition-all ${
                    wantsToBuyTiles 
                      ? "bg-teal-600 text-white border-teal-700 hover:bg-teal-700" 
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm font-medium">Ja</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleNoClick}
                  className={`flex items-center justify-center py-3 px-4 rounded-md border text-center transition-all ${
                    !wantsToBuyTiles 
                      ? "bg-teal-600 text-white border-teal-700 hover:bg-teal-700" 
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm font-medium">Nee</span>
                </button>
              </div>
              
              {!wantsToBuyTiles && (
                <div className="mt-4 animate-fadeIn p-4 border border-gray-200 rounded-lg">
                  <Label htmlFor="tilePrice" className="text-sm text-gray-700 block mb-2">
                    Prijs per m² van uw tegel (incl. btw)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
                    <Input
                      id="tilePrice"
                      type="text"
                      value={tilePricePerSqm}
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
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-4">Uw prijsindicatie</h3>
                <p className="text-xs text-gray-500 mb-4">Excl. BTW</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Prijs per m²:</span>
                    <span className="font-medium">€ 45.00</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Oppervlakte:</span>
                    <span className="font-medium">{squareMeters} m²</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Subtotaal (excl. btw):</span>
                    <span className="font-medium">€ {(Number(squareMeters) * 45).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Richtprijs:</span>
                  <span className="text-xl font-bold text-primary">€ {(Number(squareMeters) * 45).toFixed(2)}</span>
                </div>
                
                <Button className="w-full mb-3" onClick={handleAppointmentRequest}>
                  Afspraak aanvragen
                </Button>
                
                <Button variant="outline" className="w-full text-sm rounded-sm" onClick={handleDetailedCalculator}>
                  Uitgebreide calculator
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Appointment Dialog */}
      <AppointmentRequestDialog
        open={appointmentDialogOpen}
        onOpenChange={setAppointmentDialogOpen}
        tileFormat={selectedFormat + " cm"}
        squareMeters={Number(squareMeters)}
        calculatedPrice={Number(squareMeters) * 45}
        wantsToBuyTiles={wantsToBuyTiles}
        tilePricePerSqm={parseFloat(tilePricePerSqm) || null}
      />
      
      {/* Tile Format Selection Dialog */}
      <TileFormatDialog
        open={formatDialogOpen}
        onOpenChange={setFormatDialogOpen}
        options={tileFormatOptions}
        selectedFormat={selectedFormat}
        onSelect={handleFormatSelect}
      />
    </div>
  );
};

export default QuickConfigurator;
