
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { sendSimpleEmail, EMAIL_TYPES } from "@/utils/emailHelpers";

const TegelwerkenGids = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
        "Gids over tegelwerken aangevraagd via gidspagina"
      );

      if (response.success) {
        toast({
          title: "Gids verzonden!",
          description: "We hebben je gids verzonden naar je e-mail. Controleer je inbox.",
        });
        setEmail("");
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
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4">Gratis Tegelwerken Gids</h2>
      <p className="text-gray-700 mb-6">
        Download onze gratis gids met praktische tips, veelgemaakte fouten en een handige checklist voor je tegelproject.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="guide-email">E-mailadres</Label>
          <Input
            id="guide-email"
            type="email"
            placeholder="jouw@email.be"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Bezig..." : "Ontvang de gids"}
        </Button>
      </form>
      
      <div className="mt-4 text-xs text-gray-500">
        Door het formulier in te dienen, ga je akkoord met onze <a href="/privacy" className="text-primary hover:underline">privacyvoorwaarden</a>. 
        We gebruiken je e-mail alleen om je de gids te sturen en relevante updates te delen.
      </div>
    </div>
  );
};

export default TegelwerkenGids;
