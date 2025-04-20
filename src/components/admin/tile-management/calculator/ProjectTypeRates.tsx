
import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getProjectSections, getSectionTitle } from "./rates/utils";
import { useRates } from "./rates/useRates";
import RateSection from "./rates/RateSection";
import { ProjectTypeRatesProps } from "./rates/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ProjectTypeRates = ({ projectType, onUpdatePreview }: ProjectTypeRatesProps) => {
  const { toast } = useToast();
  const { rates, isLoading, isSaving, handleRateChange, saveRates } = useRates(projectType);
  const [error, setError] = useState<string | null>(null);
  const [activeAccordions, setActiveAccordions] = useState<string[]>([]);
  
  // Project sections ophalen
  const sections = getProjectSections(projectType);
  
  // Set the first section active by default
  useEffect(() => {
    if (sections && sections.length > 0 && activeAccordions.length === 0) {
      setActiveAccordions([sections[0].id]);
    }
  }, [sections]);
  
  // Debug logging
  useEffect(() => {
    console.log("ProjectTypeRates rendering, projectType:", projectType);
    console.log("Sections found:", sections);
    console.log("Current rates:", rates);
  }, [projectType, sections, rates]);
  
  // Save changes
  const handleSave = async () => {
    try {
      setError(null);
      const result = await saveRates();
      
      if (result.success) {
        toast({
          title: "Tarieven bijgewerkt",
          description: result.message || "De wijzigingen zijn opgeslagen en worden gebruikt voor de prijsberekening.",
        });
        
        // Trigger preview update
        onUpdatePreview({});
      } else {
        setError("Er is een fout opgetreden bij het opslaan van de tarieven.");
        toast({
          title: "Fout bij opslaan",
          description: "Er is een fout opgetreden bij het opslaan van de tarieven.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error saving rates:", err);
      setError("Er is een onverwachte fout opgetreden bij het opslaan van de tarieven.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!sections || sections.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Geen secties gevonden voor projecttype: {projectType || 'onbekend'}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">{getSectionTitle(projectType)}</h3>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <Accordion 
          type="multiple" 
          value={activeAccordions} 
          onValueChange={setActiveAccordions}
        >
          {sections.map((section) => (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="text-left px-3 py-2 hover:bg-gray-50 rounded-md">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="px-2 py-4">
                <RateSection 
                  sectionId={section.id} 
                  rates={rates[section.id] || {}} 
                  onChange={handleRateChange}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Opslaan...
            </>
          ) : (
            'Wijzigingen opslaan'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProjectTypeRates;
