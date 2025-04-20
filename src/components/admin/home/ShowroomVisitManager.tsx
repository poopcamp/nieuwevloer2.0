
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ActionButton from "../common/ActionButton";
import { Save } from "lucide-react";

const ShowroomVisitManager = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showroomVisitEnabled, setShowroomVisitEnabled] = useState(true);
  const [showroomVisitText, setShowroomVisitText] = useState("Showroom van Qtile bezoeken");
  const [settingsId, setSettingsId] = useState<string | null>(null);

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('*')
          .single();

        if (error) {
          console.error("Error loading settings:", error);
          toast({
            title: "Fout bij laden instellingen",
            description: "Er ging iets mis bij het ophalen van de instellingen.",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          // Store the ID for later use
          setSettingsId(data.id);
          
          // Use nullish coalescing to handle possibly undefined properties
          setShowroomVisitEnabled(data.showroom_visit_enabled ?? true);
          setShowroomVisitText(data.showroom_visit_text ?? "Showroom van Qtile bezoeken");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Make sure we have a valid settingsId
      if (!settingsId) {
        toast({
          title: "Fout bij opslaan",
          description: "Geen instellingen ID gevonden. Probeer de pagina te vernieuwen.",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from('admin_settings')
        .update({
          showroom_visit_enabled: showroomVisitEnabled,
          showroom_visit_text: showroomVisitText,
          updated_at: new Date().toISOString()
        })
        .eq('id', settingsId); // Use the stored ID instead of a hardcoded string

      if (error) {
        console.error("Error saving settings:", error);
        toast({
          title: "Fout bij opslaan",
          description: "Er is een fout opgetreden bij het opslaan van de instellingen.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Instellingen opgeslagen",
        description: "De showroom bezoek instellingen zijn bijgewerkt.",
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Onverwachte fout",
        description: "Er is een onverwachte fout opgetreden.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Showroom bezoek opties</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Showroom bezoek opties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="showroom-visit-enabled" className="flex flex-col">
            <span>Showroom bezoek optie tonen</span>
            <span className="font-normal text-sm text-muted-foreground">
              Schakel in/uit of klanten de optie krijgen om de showroom te bezoeken
            </span>
          </Label>
          <Switch
            id="showroom-visit-enabled"
            checked={showroomVisitEnabled}
            onCheckedChange={setShowroomVisitEnabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="showroom-visit-text">Tekst voor showroom bezoek</Label>
          <Input
            id="showroom-visit-text"
            value={showroomVisitText}
            onChange={(e) => setShowroomVisitText(e.target.value)}
            placeholder="Showroom van Qtile bezoeken"
          />
          <p className="text-sm text-muted-foreground">
            De tekst die getoond wordt bij de showroom bezoek optie
          </p>
        </div>

        <ActionButton 
          onClick={handleSave} 
          loading={isSaving}
          className="mt-4"
          icon={<Save className="h-4 w-4" />}
        >
          Wijzigingen opslaan
        </ActionButton>
      </CardContent>
    </Card>
  );
};

export default ShowroomVisitManager;
