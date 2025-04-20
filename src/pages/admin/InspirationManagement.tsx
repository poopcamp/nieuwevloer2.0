
import { useInspirationTiles } from "@/components/admin/home/inspiration/hooks/useInspirationTiles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Save, Loader2, ArrowLeftCircle, Home } from "lucide-react";
import { Link } from "react-router-dom";
import InspirationTileForm from "@/components/admin/home/inspiration/InspirationTileForm";
import LoadingSpinner from "@/components/admin/home/common/LoadingSpinner";
import { ImageUploadState } from "@/components/admin/home/inspiration/hooks/useImageUpload";

const AdminInspirationPage = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inspiratietegels Beheer</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            asChild
          >
            <Link to="/admin">
              <ArrowLeftCircle className="h-4 w-4" />
              Terug
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            asChild
          >
            <Link to="/">
              <Home className="h-4 w-4" />
              Homepagina
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Beheer Inspiratietegels</CardTitle>
          <CardDescription>
            Bewerk de inspiratietegels die worden weergegeven in de inspiratiecorner op de homepagina. Upload nieuwe afbeeldingen en pas kleurpalets aan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-8">
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
              
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={addTile} 
                  className="gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Inspiratietegel Toevoegen
                </Button>
                
                <Button 
                  onClick={saveTiles} 
                  disabled={saving}
                  className="gap-2"
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
                  Tegels Opslaan
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInspirationPage;
