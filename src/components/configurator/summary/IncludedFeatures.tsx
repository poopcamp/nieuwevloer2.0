
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface IncludedFeaturesProps {
  selectedTileSize: string;
  selectedPattern: string;
}

const IncludedFeatures = ({ selectedTileSize, selectedPattern }: IncludedFeaturesProps) => {
  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-sm font-semibold mb-3">Inbegrepen in de prijs:</h3>
      <ul className="space-y-2">
        <li className="text-xs flex items-start">
          <CheckCircle className="h-3.5 w-3.5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
          <span>Professionele plaatsing van vloertegels</span>
        </li>
        <li className="text-xs flex items-start">
          <CheckCircle className="h-3.5 w-3.5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
          <span>Voorafgaande inspectie en nivellering</span>
        </li>
        <li className="text-xs flex items-start">
          <CheckCircle className="h-3.5 w-3.5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
          <span>Standaard voegmiddel en tegellijm</span>
        </li>
        <li className="text-xs flex items-start">
          <CheckCircle className="h-3.5 w-3.5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
          <span>Snijwerk en afwerking</span>
        </li>
        <li className="text-xs flex items-start">
          <CheckCircle className="h-3.5 w-3.5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
          <span>Eindreiniging van de werkplek</span>
        </li>
      </ul>
    </div>
  );
};

export default IncludedFeatures;
