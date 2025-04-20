
import { useState, useEffect } from "react";
import { X, Sparkles, Send, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { sendSimpleEmail, EMAIL_TYPES } from "@/utils/emailHelpers";

const ExitIntentPopup = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if the popup has been shown already in this session
    const hasInteractedWithPopup = sessionStorage.getItem("exitIntentInteracted");
    
    if (!hasInteractedWithPopup) {
      // Mouse leave event listener for exit intent detection
      const handleMouseLeave = (e: MouseEvent) => {
        // Only trigger when mouse leaves from top of the page
        if (e.clientY <= 0 && !hasInteractedWithPopup) {
          setOpen(true);
          // Mark that we've shown the popup
          sessionStorage.setItem("exitIntentInteracted", "true");
        }
      };

      document.addEventListener("mouseleave", handleMouseLeave);
      
      return () => {
        document.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleDismiss = () => {
    setOpen(false);
    // Mark that user has interacted with the popup
    sessionStorage.setItem("exitIntentInteracted", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "E-mail is vereist",
        description: "Vul een geldig e-mailadres in om de gids te ontvangen.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send the email with the guide
      const response = await sendSimpleEmail(
        "Geïnteresseerde",
        email,
        EMAIL_TYPES.GUIDE_DOWNLOAD,
        "Gids over tegelwerken aangevraagd via exit popup"
      );

      if (response.success) {
        toast({
          title: "Gids verzonden!",
          description: "We hebben je gids verzonden naar je e-mail. Controleer je inbox.",
        });
        setOpen(false);
        // Mark that user has interacted with the popup
        sessionStorage.setItem("exitIntentInteracted", "true");
      } else {
        throw new Error(response.error || "Er ging iets mis bij het versturen van de gids.");
      }
    } catch (error) {
      console.error("Error sending guide:", error);
      toast({
        title: "Verzenden mislukt",
        description: "Er ging iets mis bij het versturen van de gids. Probeer het later opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      setOpen(open);
      if (!open) {
        // Mark that user has interacted with the popup when closing it
        sessionStorage.setItem("exitIntentInteracted", "true");
      }
    }}>
      <DialogContent className="p-0 overflow-hidden max-w-md w-full rounded-xl border-0 shadow-2xl">
        <div className="relative">
          {/* Luxurious gradient background */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent"
            aria-hidden="true"
          />
          
          {/* Close button */}
          <DialogClose className="absolute right-4 top-4 p-1 rounded-full bg-white/10 text-gray-600 hover:bg-white/20 hover:text-gray-900 transition-colors z-10">
            <X className="h-5 w-5" />
          </DialogClose>
          
          <div className="relative z-10 p-6">
            {/* Header section with decorative elements */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Exclusieve Tegelgids</h3>
                <p className="text-sm text-primary-700">Voor de perfecte tegelvloer</p>
              </div>
            </div>
            
            {/* Content */}
            <div className="mb-6">
              <p className="text-gray-700 mb-3">
                Ontdek in onze <span className="font-semibold text-primary-700">gratis exclusieve gids</span> alle geheimen voor een prachtige tegelvloer die jaren meegaat.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    <span>Professionele tips voor tegelkeuze</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    <span>Veelgemaakte fouten vermijden</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    <span>Checklist voor een perfect resultaat</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Form section */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Uw e-mailadres" 
                  value={email}
                  onChange={handleEmailChange}
                  className="pr-10 bg-white border-gray-200 h-12 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Send className="h-4 w-4" />
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button 
                  type="submit" 
                  className="h-12 bg-primary hover:bg-primary-600 text-white transition-all shadow-md rounded-lg w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Even geduld..."
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Download gratis gids
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
                
                <button 
                  type="button" 
                  onClick={handleDismiss}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Nee, bedankt
                </button>
              </div>
            </form>
            
            {/* Decorative elements */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-50/30 rounded-tl-full -mb-8 -mr-8 z-0"></div>
            <div className="absolute top-12 left-0 w-16 h-16 bg-primary-100/20 rounded-tr-full rounded-br-full -ml-8 z-0"></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
