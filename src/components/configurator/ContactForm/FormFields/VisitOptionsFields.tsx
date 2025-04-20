
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface VisitOptionsFieldsProps {
  wantsShowroomVisit: boolean;
  wantsSiteVisit: boolean;
  handleChange: (field: string, value: string | boolean) => void;
}

const VisitOptionsFields = ({ 
  wantsShowroomVisit, 
  wantsSiteVisit, 
  handleChange 
}: VisitOptionsFieldsProps) => {
  // State voor showroom opties
  const [showroomSettings, setShowroomSettings] = useState({
    showOption: true,
    labelText: "Showroom van Qtile bezoeken",
    descriptionText: "Om tegels en materialen te bekijken en te bespreken"
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
            showOption: data.showroom_visit_enabled !== false, // Default true als niet gespecificeerd
            labelText: data.showroom_visit_text || "Showroom van Qtile bezoeken",
            descriptionText: "Om tegels en materialen te bekijken en te bespreken"
          });
        }
      } catch (err) {
        console.error("Failed to fetch showroom settings:", err);
      }
    };
    
    fetchShowroomSettings();
  }, []);

  return (
    <div className="space-y-3">
      {showroomSettings.showOption && (
        <div className="flex items-start space-x-3">
          <Checkbox 
            id="showroomVisit" 
            checked={wantsShowroomVisit}
            onCheckedChange={(checked) => handleChange("wantsShowroomVisit", !!checked)}
            className="mt-1"
          />
          <div>
            <Label 
              htmlFor="showroomVisit" 
              className="flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <Calendar className="h-4 w-4 text-primary" />
              <span>{showroomSettings.labelText}</span>
            </Label>
            <p className="text-sm text-gray-500">
              {showroomSettings.descriptionText}
            </p>
          </div>
        </div>
      )}
      
      <div className="flex items-start space-x-3">
        <Checkbox 
          id="siteVisit" 
          checked={wantsSiteVisit}
          onCheckedChange={(checked) => handleChange("wantsSiteVisit", !!checked)}
          className="mt-1"
        />
        <div>
          <Label 
            htmlFor="siteVisit" 
            className="flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <MapPin className="h-4 w-4 text-primary" />
            <span>Ik wens een plaatsbezoek aan te vragen</span>
          </Label>
          <p className="text-sm text-gray-500">
            We nemen contact met u op om een afspraak te maken
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisitOptionsFields;
