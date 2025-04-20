
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarRange, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface VisitOptionsSectionProps {
  wantsShowroomVisit: boolean;
  wantsSiteVisit: boolean;
  handleChange: (field: string, value: string | boolean) => void;
}

const VisitOptionsSection = ({ 
  wantsShowroomVisit, 
  wantsSiteVisit, 
  handleChange 
}: VisitOptionsSectionProps) => {
  // State voor showroom opties
  const [showroomSettings, setShowroomSettings] = useState({
    showOption: true,
    labelText: "Showroom van Qtile bezoeken",
    descriptionText: "Onze showroom bekijken"
  });
  
  // Haal showroom instellingen op uit database
  useEffect(() => {
    const fetchShowroomSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('*')
          .single();
          
        if (error) {
          console.error("Error fetching showroom settings:", error);
          return;
        }
        
        if (data) {
          setShowroomSettings({
            // Use nullish coalescing for potentially undefined fields
            showOption: data.showroom_visit_enabled !== false, 
            labelText: data.showroom_visit_text || "Showroom van Qtile bezoeken",
            descriptionText: "Onze showroom bekijken"
          });
        }
      } catch (err) {
        console.error("Failed to fetch showroom settings:", err);
      }
    };
    
    fetchShowroomSettings();
  }, []);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium block mb-2">Bezoekopties</Label>
      
      <div className="space-y-3">
        {showroomSettings.showOption && (
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="wantsShowroomVisit"
              checked={wantsShowroomVisit}
              onCheckedChange={(checked) => handleChange("wantsShowroomVisit", !!checked)}
              className="mt-0.5"
            />
            <div>
              <Label 
                htmlFor="wantsShowroomVisit"
                className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
              >
                <Home className="h-4 w-4 text-gray-500" />
                {showroomSettings.labelText}
              </Label>
              <p className="text-xs text-gray-500 mt-0.5">{showroomSettings.descriptionText}</p>
            </div>
          </div>
        )}
        
        <div className="flex items-start space-x-3">
          <Checkbox 
            id="wantsSiteVisit"
            checked={wantsSiteVisit}
            onCheckedChange={(checked) => handleChange("wantsSiteVisit", !!checked)}
            className="mt-0.5"
          />
          <div>
            <Label 
              htmlFor="wantsSiteVisit"
              className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
            >
              <CalendarRange className="h-4 w-4 text-gray-500" />
              Plaatsbezoek aanvragen
            </Label>
            <p className="text-xs text-gray-500 mt-0.5">Een vakman komt ter plaatse voor advies en opmeting</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitOptionsSection;
