
import TileTypeSelector from "./TileTypeSelector";
import TileFormatSelector from "./TileFormatSelector";
import TileStyleSelector from "./TileStyleSelector";
import AreaSlider from "./AreaSlider";
import ExtraOptions from "./ExtraOptions";
import PriceSummary from "./PriceSummary";
import ContactForm from "./ContactForm";
import { TileType, TileSize, TileStyle, ExtraOption } from "./types";

interface ConfiguratorFormProps {
  state: {
    tileType: string;
    tileSize: string;
    tileStyle: string;
    squareMeters: number;
    extras: string[];
    name: string;
    email: string;
    phone: string;
  };
  totalPrice: number;
  handleChange: (name: string, value: any) => void;
  handleExtraToggle: (id: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  tileTypes: TileType[];
  tileSizes: TileSize[];
  tileStyles: TileStyle[];
  extraOptions: ExtraOption[];
}

const ConfiguratorForm = ({
  state,
  totalPrice,
  handleChange,
  handleExtraToggle,
  handleSubmit,
  tileTypes,
  tileSizes,
  tileStyles,
  extraOptions
}: ConfiguratorFormProps) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Tile configurator section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Tegelkeuze</h3>
            
            <TileTypeSelector
              tileTypes={tileTypes}
              selectedType={state.tileType}
              onSelect={(value) => handleChange("tileType", value)}
            />
            
            <TileFormatSelector
              tileSizes={tileSizes}
              selectedSize={state.tileSize}
              onSelect={(value) => handleChange("tileSize", value)}
              label="Tegelformaat"
            />
            
            <TileStyleSelector
              tileStyles={tileStyles}
              selectedStyle={state.tileStyle}
              onSelect={(value) => handleChange("tileStyle", value)}
            />
            
            <AreaSlider
              value={state.squareMeters}
              onChange={(value) => handleChange("squareMeters", value)}
            />
            
            <ExtraOptions
              options={extraOptions}
              selectedOptions={state.extras}
              onToggle={handleExtraToggle}
            />
          </div>
        </div>
        
        {/* Price and contact form */}
        <div className="space-y-6">
          <PriceSummary totalPrice={totalPrice} />
          
          <ContactForm
            name={state.name}
            email={state.email}
            phone={state.phone}
            onNameChange={(value) => handleChange("name", value)}
            onEmailChange={(value) => handleChange("email", value)}
            onPhoneChange={(value) => handleChange("phone", value)}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </form>
  );
};

export default ConfiguratorForm;
