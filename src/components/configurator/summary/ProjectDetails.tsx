import React from 'react';
import { ConfiguratorState } from '../types';
import { Card, CardContent } from "@/components/ui/card";

interface ProjectDetailsProps {
  state: ConfiguratorState;
}

interface SummaryDetailProps {
  label: string;
  value: string | React.ReactNode;
}

const SummaryDetail: React.FC<SummaryDetailProps> = ({ label, value }) => (
  <div className="grid grid-cols-2 gap-x-4">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <span className="text-sm text-gray-600 text-right">{value}</span>
  </div>
);

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ state }) => {
  const hasRequiredSelections = () => {
    if (!state.projectType) return false;
    
    switch(state.projectType) {
      case 'vloer':
        return !!state.floorType && !!state.tileSize;
      case 'keukenwand':
        return !!state.wallType && !!state.wallTileSize;
      case 'badkamer':
        return !!state.bathroomTileSize;
      case 'andere':
        return !!state.otherDescription;
      default:
        return false;
    }
  };

  if (!hasRequiredSelections()) {
    return (
      <Card className="shadow-none border-0">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Project Details</h3>
          <p className="text-sm text-gray-500">
            Maak eerst uw projectkeuzes om een gedetailleerde prijsindicatie te zien.
          </p>
        </CardContent>
      </Card>
    );
  }

  const renderBathroomOptions = () => {
    if (state.projectType === 'badkamer' && state.bathroomOptions) {
      const hasSelectedOptions = state.bathroomOptions.walkInShower ||
        state.bathroomOptions.shower ||
        state.bathroomOptions.floor ||
        state.bathroomOptions.showerWall ||
        state.bathroomOptions.walls ||
        state.bathroomOptions.toilet ||
        state.bathroomOptions.sink;
      
      if (hasSelectedOptions) {
        return (
          <div className="flex flex-col space-y-1 mt-2">
            <p className="text-sm font-medium text-gray-700">Geselecteerde onderdelen:</p>
            <ul className="text-xs text-gray-600 list-disc pl-5">
              {state.bathroomOptions.walkInShower && <li>Inloopdouche</li>}
              {state.bathroomOptions.shower && <li>Douche</li>}
              {state.bathroomOptions.floor && <li>Vloer</li>}
              {state.bathroomOptions.showerWall && <li>Douchewand</li>}
              {state.bathroomOptions.walls && <li>Wanden</li>}
              {state.bathroomOptions.toilet && <li>Toilet</li>}
              {state.bathroomOptions.sink && <li>Wastafel</li>}
            </ul>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <Card className="shadow-none border-0">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Project Details</h3>
        
        <div className="flex flex-col space-y-4">
          <SummaryDetail 
            label="Project Type" 
            value={state.projectType || 'Niet geselecteerd'} 
          />
          
          {state.projectType === 'vloer' && (
            <>
              <SummaryDetail 
                label="Vloertype" 
                value={state.floorType || 'Niet geselecteerd'} 
              />
              <SummaryDetail 
                label="Tegelformaat" 
                value={state.tileSize || 'Niet geselecteerd'} 
              />
              <SummaryDetail 
                label="Tegelpatroon" 
                value={state.tilePattern || 'Standaard (recht)'} 
              />
              <SummaryDetail 
                label="Plinten" 
                value={state.needsPlinths ? 'Ja' : 'Nee'} 
              />
              <SummaryDetail 
                label="Chape" 
                value={state.needsChape ? 'Ja' : 'Nee'} 
              />
            </>
          )}
          
          {state.projectType === 'keukenwand' && (
            <>
              <SummaryDetail 
                label="Wandtype" 
                value={state.wallType || 'Niet geselecteerd'} 
              />
              <SummaryDetail 
                label="Tegelformaat" 
                value={state.wallTileSize || 'Niet geselecteerd'} 
              />
            </>
          )}
          
          {state.projectType === 'badkamer' && (
            <>
              <SummaryDetail 
                label="Tegelformaat" 
                value={state.bathroomTileSize || 'Niet geselecteerd'} 
              />
              {renderBathroomOptions()}
            </>
          )}
          
          {state.projectType === 'andere' && (
            <SummaryDetail 
              label="Omschrijving" 
              value={state.otherDescription || 'Geen omschrijving'} 
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectDetails;
