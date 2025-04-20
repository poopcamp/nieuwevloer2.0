
import { useTileConfigurator } from "./hooks/useTileConfigurator";
import ConfiguratorForm from "./ConfiguratorForm";

const TileConfigurator = () => {
  const {
    state,
    totalPrice,
    handleChange,
    handleExtraToggle,
    handleSubmit,
    tileTypes,
    tileSizes,
    tileStyles,
    extraOptions
  } = useTileConfigurator();
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <ConfiguratorForm
        state={state}
        totalPrice={totalPrice}
        handleChange={handleChange}
        handleExtraToggle={handleExtraToggle}
        handleSubmit={handleSubmit}
        tileTypes={tileTypes}
        tileSizes={tileSizes}
        tileStyles={tileStyles}
        extraOptions={extraOptions}
      />
    </div>
  );
};

export default TileConfigurator;
