
import React from 'react';
import { Spinner } from './spinner';

const RouteLoader: React.FC = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600">Pagina laden...</p>
    </div>
  );
};

export default RouteLoader;
