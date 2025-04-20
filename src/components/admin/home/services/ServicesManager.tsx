
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, PlusCircle, Loader2 } from "lucide-react";
import ServiceItem from "./ServiceItem";
import { useServices } from "./useServices";
import LoadingSpinner from "../common/LoadingSpinner";

const ServicesManager = () => {
  const { 
    services, 
    loading, 
    saving, 
    handleInputChange, 
    addService, 
    removeService, 
    saveServices 
  } = useServices();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beheer Diensten</CardTitle>
        <CardDescription>
          Bewerk de diensten die worden weergegeven op de homepage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-6">
            {services.map((service, index) => (
              <ServiceItem 
                key={service.id}
                service={service}
                index={index}
                onInputChange={handleInputChange}
                onRemove={removeService}
              />
            ))}
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={addService} 
                className="gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Dienst Toevoegen
              </Button>
              
              <Button 
                onClick={saveServices} 
                disabled={saving}
                className="gap-2"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Diensten Opslaan
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServicesManager;
