
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SuccessStepProps {
  email: string;
  inspirationStyle?: {
    id: number;
    title: string;
    image: string;
  };
}

const SuccessStep = ({ email, inspirationStyle }: SuccessStepProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
      <div className="bg-primary-50 rounded-full p-3 mb-4">
        <CheckCircle2 className="h-12 w-12 text-primary-600" />
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Bedankt voor uw aanvraag!</h2>
      
      <div className="max-w-xl mx-auto space-y-4">
        <p className="text-gray-600">
          We hebben uw offerte-aanvraag ontvangen en zullen deze zo snel mogelijk verwerken.
          Een bevestiging is verzonden naar <span className="font-medium text-gray-900">{email}</span>.
        </p>
        
        {inspirationStyle && (
          <div className="bg-primary-50 p-4 rounded-lg mt-6">
            <h3 className="font-semibold text-primary-700 mb-2">Geselecteerde inspiratiestijl</h3>
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                <img 
                  src={inspirationStyle.image} 
                  alt={inspirationStyle.title} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/placeholder-tile.jpg";
                  }}
                />
              </div>
              <div>
                <p className="font-medium">{inspirationStyle.title}</p>
                <p className="text-sm text-gray-600">Deze stijl is meegenomen in uw aanvraag</p>
              </div>
            </div>
          </div>
        )}
        
        <p className="text-gray-600 mt-6">
          Wat gebeurt er nu?
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <ol className="list-decimal list-inside text-left space-y-2">
            <li className="text-gray-700">We bekijken uw aanvraag en de details van uw project</li>
            <li className="text-gray-700">U ontvangt binnen 24 uur een eerste reactie van ons team</li>
            <li className="text-gray-700">
              {!inspirationStyle 
                ? "Indien gewenst plannen we een plaatsbezoek voor een gedetailleerde prijsopgave" 
                : "We helpen u met het implementeren van de gekozen inspiratiestijl in uw project"}
            </li>
            <li className="text-gray-700">Na uw goedkeuring plannen we de uitvoering</li>
          </ol>
        </div>
        
        <p className="text-gray-600 mt-4">
          Heeft u nog vragen? Aarzel niet om contact met ons op te nemen.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button asChild variant="outline">
          <Link to="/">Terug naar homepage</Link>
        </Button>
        <Button asChild>
          <a href="tel:0479304986">Nu bellen</a>
        </Button>
      </div>
    </div>
  );
};

export default SuccessStep;
