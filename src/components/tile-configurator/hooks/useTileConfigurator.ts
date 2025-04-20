
import { useState, useEffect } from 'react';
import { tileTypes, tileSizes, tileStyles, extraOptions } from '../data/tileConfiguratorData';
import { TileConfiguratorState } from '../types';

export const useTileConfigurator = () => {
  const [state, setState] = useState<TileConfiguratorState>({
    tileType: tileTypes[0].id,
    tileSize: tileSizes[0].id,
    tileStyle: tileStyles[0].id,
    squareMeters: 10,
    extras: [],
    name: '',
    email: '',
    phone: '',
  });

  const [totalPrice, setTotalPrice] = useState(0);

  // Calculate the total price whenever state changes
  useEffect(() => {
    const calculate = () => {
      let price = 0;
      
      // Find the selected tile type, size, and style
      const selectedTileType = tileTypes.find(type => type.id === state.tileType);
      const selectedTileSize = tileSizes.find(size => size.id === state.tileSize);
      const selectedTileStyle = tileStyles.find(style => style.id === state.tileStyle);
      
      if (selectedTileType && selectedTileSize && selectedTileStyle) {
        // Calculate the base price
        price = selectedTileType.basePrice * selectedTileSize.price_multiplier * selectedTileStyle.price_multiplier * state.squareMeters;
        
        // Add extra options
        state.extras.forEach(extraId => {
          const extra = extraOptions.find(opt => opt.id === extraId);
          if (extra) {
            price += extra.price * state.squareMeters;
          }
        });
      }
      
      setTotalPrice(parseFloat(price.toFixed(2)));
    };
    
    calculate();
  }, [state]);

  // Handle input changes
  const handleChange = (name: string, value: any) => {
    setState((prev) => ({ ...prev, [name]: value }));
  };

  // Handle extras toggle
  const handleExtraToggle = (id: string) => {
    setState((prev) => {
      const extras = [...prev.extras];
      const index = extras.indexOf(id);
      
      if (index === -1) {
        extras.push(id);
      } else {
        extras.splice(index, 1);
      }
      
      return { ...prev, extras };
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic (e.g., API call) would go here
    console.log('Form submitted:', state, 'Total price:', totalPrice);
    alert(`Offerte aangevraagd voor €${totalPrice}. We nemen snel contact met u op!`);
  };

  return {
    state,
    totalPrice,
    handleChange,
    handleExtraToggle,
    handleSubmit,
    tileTypes,
    tileSizes,
    tileStyles,
    extraOptions
  };
};

export default useTileConfigurator;
