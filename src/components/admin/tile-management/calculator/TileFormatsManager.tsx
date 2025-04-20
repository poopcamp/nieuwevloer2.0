
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TileFormatManager from './TileFormatManager'; // Zorg ervoor dat deze import correct is

const TileFormatsManager = () => {
  const [activeTab, setActiveTab] = React.useState('floor');

  return (
    <div>
      <Tabs defaultValue="floor" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="floor">Vloertegel Formaten</TabsTrigger>
          <TabsTrigger value="wall">Wandtegel Formaten</TabsTrigger>
        </TabsList>
        
        <TabsContent value="floor">
          <TileFormatManager tileType="floor" />
        </TabsContent>
        
        <TabsContent value="wall">
          <TileFormatManager tileType="wall" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TileFormatsManager;
