
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useTileExamples } from "./hooks/useTileExamples";
import TileExamplesList from "./TileExamplesList";

const TileExamplesManager = () => {
  const {
    tileExamples,
    setTileExamples,
    loading,
    saving,
    saveExamples
  } = useTileExamples();

  const handleSave = () => {
    saveExamples(tileExamples);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beheer Tegelvoorbeelden</CardTitle>
        <CardDescription>
          Bewerk de populaire tegelcombinaties die worden weergegeven op de homepage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <TileExamplesList
            tileExamples={tileExamples}
            onExamplesChange={setTileExamples}
            onSave={handleSave}
            saving={saving}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TileExamplesManager;
