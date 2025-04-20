
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Save, Loader2, AlertCircle, Info } from "lucide-react";
import { useInspirationTiles } from "./hooks/useInspirationTiles";
import InspirationTileForm from "./InspirationTileForm";
import LoadingSpinner from "../common/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageUploadState } from "./hooks/useImageUpload";

const InspirationManagerWrapper = () => {
  const {
    inspirationTiles,
    loading,
    saving,
    imageUploading,
    handleInputChange,
    handleColorChange,
    addColor,
    removeColor,
    addTile,
    removeTile,
    handleImageUpload,
    saveTiles
  } = useInspirationTiles();
  
  const [error, setError] = useState<string | null>(null);

  // Validate if there are missing required fields  
  const validateTiles = () => {
    const invalidTiles = inspirationTiles.filter(tile => !tile.title || !tile.image);
    if (invalidTiles.length > 0) {
      setError(`${invalidTiles.length} tegel(s) missen een titel of afbeelding. Vul deze eerst in.`);
      return false;
    }
    setError(null);
    return true;
  };
  
  const handleSave = async () => {
    if (!validateTiles()) {
      return;
    }
    
    try {
      setError(null);
      await saveTiles();
    } catch (err: any) {
      setError(err.message || "Er is een fout opgetreden bij het opslaan");
    }
  };
  
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle>Beheer Inspiratietegels</CardTitle>
        <CardDescription>
          Bewerk de inspiratietegels die worden weergegeven in de inspiratiecorner.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {error && (
          <Alert variant="destructive" className="mx-6 mt-6 mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="p-6">
            <LoadingSpinner />
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-300px)] px-6 py-4">
            <div className="space-y-8 mb-8">
              {inspirationTiles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Geen inspiratietegels gevonden. Voeg een nieuwe tegel toe om te beginnen.</p>
                  <Button 
                    variant="outline" 
                    onClick={addTile} 
                    className="gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Inspiratietegel Toevoegen
                  </Button>
                </div>
              ) : (
                <>
                  {inspirationTiles.length > 0 && (
                    <Alert variant="default" className="bg-blue-50 border-blue-200 mb-6">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-700">
                        Vergeet niet om op "Tegels Opslaan" te klikken om uw wijzigingen te bewaren.
                      </AlertDescription>
                    </Alert>
                  )}
                
                  {inspirationTiles.map((tile, index) => (
                    <InspirationTileForm
                      key={tile.id}
                      tile={tile}
                      index={index}
                      onRemove={removeTile}
                      onInputChange={handleInputChange}
                      onColorChange={handleColorChange}
                      onAddColor={addColor}
                      onRemoveColor={removeColor}
                      onImageUpload={(index, e) => handleImageUpload(index, e)}
                      imageUploading={imageUploading as ImageUploadState}
                    />
                  ))}
                  
                  <div className="flex flex-col sm:flex-row justify-between pt-4 gap-4 sticky bottom-0">
                    <Button 
                      variant="outline" 
                      onClick={addTile} 
                      className="gap-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Inspiratietegel Toevoegen
                    </Button>
                    
                    <Button 
                      onClick={handleSave} 
                      disabled={saving || inspirationTiles.length === 0}
                      className="gap-2"
                      size="lg"
                      style={{
                        backgroundColor: '#00847E',
                        borderColor: '#00847E' 
                      }}
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {saving ? "Bezig met opslaan..." : "Tegels Opslaan"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default InspirationManagerWrapper;
