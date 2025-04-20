
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle, Home, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TileExamplesManager from "@/components/admin/home/tile-examples/TileExamplesManager";
import InspirationManager from "@/components/admin/home/inspiration/InspirationManager";

const AdminInspirationalContentPage = () => {
  const [error, setError] = useState<string | null>(null);
  
  // Error boundary
  const handleError = (error: Error) => {
    console.error("Error in InspirationalContentPage:", error);
    setError(error.message || "Er is een fout opgetreden bij het laden van de content.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inspirationele Content Beheer</h1>
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

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fout</AlertTitle>
          <AlertDescription>
            {error}
            <Button 
              variant="link" 
              className="p-0 ml-2 h-auto" 
              onClick={() => window.location.reload()}
            >
              Probeer te verversen
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Beheer Tegelvoorbeelden en Inspiratiecorner</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tile-examples">
            <TabsList className="mb-6">
              <TabsTrigger value="tile-examples">Tegelvoorbeelden</TabsTrigger>
              <TabsTrigger value="inspiration-corner">Inspiratiecorner</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tile-examples">
              <TileExamplesManager />
            </TabsContent>
            
            <TabsContent value="inspiration-corner">
              <div className="overflow-auto max-w-full">
                <InspirationManager />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInspirationalContentPage;
