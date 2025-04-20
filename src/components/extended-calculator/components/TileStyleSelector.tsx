
import { TileStyle } from '../types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Palette } from 'lucide-react';

interface TileStyleSelectorProps {
  tileStyles: TileStyle[];
  selectedTileStyle: TileStyle | null;
  onSelect: (style: TileStyle) => void;
}

const TileStyleSelector = ({ tileStyles, selectedTileStyle, onSelect }: TileStyleSelectorProps) => {
  if (tileStyles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Palette className="h-5 w-5 mr-2 text-gray-600" />
        <h3 className="text-base font-medium">Tegelstijl</h3>
      </div>
      
      <RadioGroup
        value={selectedTileStyle?.id || ''}
        onValueChange={(value) => {
          const style = tileStyles.find(s => s.id === value);
          if (style) {
            onSelect(style);
          }
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tileStyles.map((style) => (
            <div key={style.id} className="space-y-2">
              <RadioGroupItem
                value={style.id}
                id={`style-${style.id}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`style-${style.id}`}
                className="flex flex-col border rounded-lg p-4 h-full cursor-pointer hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary-50"
              >
                {style.image_url && (
                  <div className="w-full h-24 mb-2 overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={style.image_url}
                      alt={style.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/placeholder-tile.jpg';
                      }}
                    />
                  </div>
                )}
                <p className="font-medium">{style.name}</p>
                {style.description && (
                  <p className="text-sm text-gray-500 mt-1">{style.description}</p>
                )}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default TileStyleSelector;
