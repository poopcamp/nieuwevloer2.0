import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Save, PlusCircle, Trash, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "../common/LoadingSpinner";

interface ServicePage {
  id: string;
  title: string;
  description: string;
  details: string;
  image: string;
  route: string;
  configType: string;
}

interface ServicePageDB {
  id: string;
  title: string;
  description: string;
  details: string;
  image: string;
  route: string;
  configtype: string;
  created_at?: string;
  updated_at?: string;
}

const ServicePagesManager = () => {
  const [services, setServices] = useState<ServicePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('service_pages')
          .select('*')
          .order('created_at');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const mappedData: ServicePage[] = (data as ServicePageDB[]).map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            details: item.details,
            image: item.image,
            route: item.route,
            configType: item.configtype
          }));
          
          setServices(mappedData);
        } else {
          setServices([
            {
              id: crypto.randomUUID(),
              title: "Vloer",
              description: "Professionele plaatsing van vloertegels voor uw keuken, badkamer, woonkamer en andere ruimtes.",
              details: "Onze vloertegels zijn verkrijgbaar in verschillende formaten en stijlen. We gebruiken alleen hoogwaardige materialen en zorgen voor een perfecte afwerking.",
              image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              route: "/vloertegelplaatsing",
              configType: "vloer"
            },
            {
              id: crypto.randomUUID(),
              title: "Wand",
              description: "Stijlvolle wandtegels voor een elegante afwerking van uw badkamer, keuken of andere ruimtes.",
              details: "Onze wandtegels geven uw ruimte een geheel nieuwe uitstraling. We bieden diverse stijlen aan, van modern tot klassiek, en zorgen voor een professionele plaatsing.",
              image: "https://images.unsplash.com/photo-1609840533428-4d9f338a9848?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              route: "/wandtegelplaatsing",
              configType: "keukenwand"
            }
          ]);
        }
      } catch (error: any) {
        console.error("Error fetching services:", error);
        toast({
          title: "Fout bij ophalen",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [toast]);

  const handleInputChange = (index: number, field: keyof ServicePage, value: string) => {
    const updatedServices = [...services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value
    };
    setServices(updatedServices);
  };

  const addService = () => {
    setServices([
      ...services,
      {
        id: crypto.randomUUID(),
        title: "",
        description: "",
        details: "",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        route: "",
        configType: "vloer"
      }
    ]);
  };

  const removeService = (index: number) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };

  const saveServices = async () => {
    setSaving(true);
    try {
      const { error: deleteError } = await supabase
        .from('service_pages')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (deleteError) throw deleteError;

      const dbData: ServicePageDB[] = services.map(service => ({
        id: service.id,
        title: service.title,
        description: service.description,
        details: service.details,
        image: service.image,
        route: service.route,
        configtype: service.configType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error: insertError } = await supabase
        .from('service_pages')
        .insert(dbData);

      if (insertError) throw insertError;

      toast({
        title: "Opgeslagen",
        description: "Diensten zijn succesvol opgeslagen.",
      });
    } catch (error: any) {
      console.error("Error saving services:", error);
      toast({
        title: "Fout bij opslaan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const fileId = crypto.randomUUID();
    
    setUploading(prev => ({ ...prev, [services[index].id]: true }));
    
    try {
      const { data, error } = await supabase
        .storage
        .from('service-images')
        .upload(`service-${fileId}`, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) throw error;
      
      const imageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/service-images/${data.path}`;
      
      const updatedServices = [...services];
      updatedServices[index] = {
        ...updatedServices[index],
        image: imageUrl
      };
      setServices(updatedServices);
      
      toast({
        title: "Afbeelding geüpload",
        description: "De afbeelding is succesvol geüpload.",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Fout bij uploaden",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(prev => ({ ...prev, [services[index].id]: false }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beheer Service Pagina's</CardTitle>
        <CardDescription>
          Beheer de diensten die worden weergegeven op de website
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-8">
            {services.map((service, index) => (
              <div key={service.id} className="border p-6 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Dienst {index + 1}</h3>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => removeService(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor={`service-title-${index}`}>Titel</Label>
                    <Input 
                      id={`service-title-${index}`}
                      value={service.title}
                      onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                      placeholder="Bijv. Vloer"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`service-route-${index}`}>Route</Label>
                    <Input 
                      id={`service-route-${index}`}
                      value={service.route}
                      onChange={(e) => handleInputChange(index, 'route', e.target.value)}
                      placeholder="Bijv. /vloertegelplaatsing"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor={`service-configType-${index}`}>Configurator Type</Label>
                    <select
                      id={`service-configType-${index}`}
                      value={service.configType}
                      onChange={(e) => handleInputChange(index, 'configType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="vloer">Vloer</option>
                      <option value="keukenwand">Keukenwand</option>
                      <option value="badkamer">Badkamer</option>
                      <option value="andere">Andere</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`service-image-${index}`}>Afbeelding</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id={`service-image-url-${index}`}
                        value={service.image}
                        onChange={(e) => handleInputChange(index, 'image', e.target.value)}
                        placeholder="URL van afbeelding"
                        className="flex-grow"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          id={`service-image-${index}`}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, index)}
                        />
                        <Button type="button" variant="outline" className="relative">
                          {uploading[service.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`service-description-${index}`}>Korte beschrijving</Label>
                  <Textarea 
                    id={`service-description-${index}`}
                    value={service.description}
                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                    rows={2}
                    placeholder="Korte beschrijving van de dienst"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`service-details-${index}`}>Uitgebreide details</Label>
                  <Textarea 
                    id={`service-details-${index}`}
                    value={service.details}
                    onChange={(e) => handleInputChange(index, 'details', e.target.value)}
                    rows={4}
                    placeholder="Uitgebreide beschrijving van de dienst"
                  />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md mt-2">
                  <h4 className="font-medium mb-2">Voorbeeld afbeelding</h4>
                  <div className="aspect-video bg-gray-200 rounded-md overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title || "Dienst afbeelding"} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/600x400/png?text=Afbeelding+niet+gevonden";
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between pt-6">
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

export default ServicePagesManager;
