
import { TileFormat } from '../types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { GridIcon } from 'lucide-react';

interface TileFormatSelectorProps {
  tileFormats: TileFormat[];
  selectedTileFormat: TileFormat | null;
  onSelect: (format: TileFormat) => void;
}

const TileFormatSelector = ({ tileFormats, selectedTileFormat, onSelect }: TileFormatSelectorProps) => {
  if (tileFormats.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <GridIcon className="h-5 w-5 mr-2 text-gray-600" />
        <h3 className="text-base font-medium">Tegelformaat</h3>
      </div>
      
      <RadioGroup
        value={selectedTileFormat?.id || ''}
        onValueChange={(value) => {
          const format = tileFormats.find(f => f.id === value);
          if (format) {
            onSelect(format);
          }
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tileFormats.map((format) => (
            <div key={format.id} className="space-y-2">
              <RadioGroupItem
                value={format.id}
                id={`format-${format.id}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`format-${format.id}`}
                className="flex flex-col border rounded-lg p-4 h-full cursor-pointer hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary-50"
              >
                {format.image_url && (
                  <div className="w-full h-20 mb-2 overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={format.image_url}
                      alt={format.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/placeholder-tile.jpg';
                      }}
                    />
                  </div>
                )}
                <p className="font-medium">{format.name}</p>
                <p className="text-sm text-gray-700">{format.dimensions}</p>
                {format.description && (
                  <p className="text-xs text-gray-500 mt-1">{format.description}</p>
                )}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default TileFormatSelector;
