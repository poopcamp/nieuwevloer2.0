
import { useMemo, Fragment, useState } from "react";
import { TileOption } from "./hooks/types";
import { Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TileFormatSelectorProps {
  selectedFormat: string;
  onChange: (value: string) => void;
  options: TileOption[];
  isLoading: boolean;
  error?: string | null;
}

const TileFormatSelector = ({
  selectedFormat,
  onChange,
  options,
  isLoading,
  error
}: TileFormatSelectorProps) => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  
  // Get the selected option label
  const selectedOptionLabel = useMemo(() => {
    const selected = options.find(option => option.value === selectedFormat);
    return selected ? selected.label : "";
  }, [selectedFormat, options]);

  const renderedOptions = useMemo(() => {
    // Add Romeins Verband if it's not in the options
    const hasRomeinsVerband = options.some(option => option.value === 'romeins');
    const allOptions = hasRomeinsVerband
      ? options
      : [...options, { value: 'romeins', label: 'Romeins Verband (verschillende formaten)', price_per_sqm: 0, id: "romeins" }];

    return allOptions.map(option => (
      <div
        key={option.value}
        onClick={() => {
          onChange(option.value);
          setSelectorOpen(false);
        }}
        className={cn(
          "border rounded-md p-4 cursor-pointer transition-all mb-2",
          selectedFormat === option.value
            ? "border-primary bg-primary/5"
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        )}
      >
        <div className="flex items-center">
          <div
            className={cn(
              "w-5 h-5 mr-3 rounded-full border flex-shrink-0",
              selectedFormat === option.value
                ? "border-4 border-primary"
                : "border border-gray-300"
            )}
          />
          <span className="text-sm">{option.label}</span>
        </div>
      </div>
    ));
  }, [options, selectedFormat, onChange]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-700 text-sm">
        <p>Fout bij het laden van tegelformaten: {error}</p>
        <p className="text-xs mt-1">
          Probeer de pagina te vernieuwen of neem contact op met de klantenservice als het probleem aanhoudt.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Current selection (clickable) */}
      <div 
        onClick={() => setSelectorOpen(true)}
        className="border rounded-md p-4 cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center">
          <div
            className={cn(
              "w-5 h-5 mr-3 rounded-full border flex-shrink-0",
              "border-4 border-primary"
            )}
          />
          <span className="text-sm">{selectedOptionLabel}</span>
        </div>
        <ChevronDown className="h-5 w-5 text-gray-400" />
      </div>

      {/* Tile Format Selection Dialog */}
      <Dialog open={selectorOpen} onOpenChange={setSelectorOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kies uw tegelformaat</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {renderedOptions}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TileFormatSelector;
