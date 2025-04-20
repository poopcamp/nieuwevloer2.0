
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function GDPRRequest() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    requestType: "",
    message: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      requestType: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.requestType || !formData.message) {
      toast({
        title: "Onvolledige gegevens",
        description: "Vul alle verplichte velden in.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to Supabase
      const { error } = await supabase
        .from('gdpr_requests')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          request_type: formData.requestType,
          message: formData.message,
          status: "pending"
        });

      if (error) throw error;

      // Success
      setIsSubmitted(true);
      toast({
        title: "Verzoek verzonden",
        description: "Uw GDPR verzoek is succesvol ingediend. We zullen zo snel mogelijk contact met u opnemen.",
      });
    } catch (error: any) {
      console.error("GDPR request submission error:", error);
      toast({
        title: "Fout bij verzenden",
        description: error.message || "Er is een fout opgetreden bij het verzenden van uw verzoek.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container max-w-3xl py-12">
        <Helmet>
          <title>GDPR Verzoek Ingediend | NieuweVloer.be</title>
          <meta name="robots" content="noindex" />
        </Helmet>

        <Card className="border-green-100 bg-green-50">
          <CardContent className="pt-6 pb-4 px-6 flex flex-col items-center text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-green-800 mb-4">Uw GDPR verzoek is ingediend!</h1>
            <p className="text-green-700 mb-4">
              We hebben uw verzoek ontvangen en zullen dit zo snel mogelijk verwerken. 
              U ontvangt binnen 30 dagen een reactie op het door u opgegeven e-mailadres.
            </p>
            <Button asChild className="mt-4">
              <Link to="/">Terug naar homepagina</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-12">
      <Helmet>
        <title>GDPR Verzoek | NieuweVloer.be</title>
        <meta 
          name="description" 
          content="Dien een GDPR verzoek in om uw rechten uit te oefenen met betrekking tot uw persoonsgegevens bij NieuweVloer.be" 
        />
        <meta name="robots" content="noindex" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">GDPR Verzoek</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Uw rechten onder de GDPR/AVG</CardTitle>
          <CardDescription>
            Onder de Algemene Verordening Gegevensbescherming (AVG) heeft u verschillende rechten met betrekking tot uw persoonlijke gegevens.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Recht op inzage in uw persoonlijke gegevens</li>
            <li>Recht op rectificatie van onjuiste persoonlijke gegevens</li>
            <li>Recht op wissing ('recht op vergetelheid')</li>
            <li>Recht op beperking van de verwerking</li>
            <li>Recht op gegevensoverdraagbaarheid</li>
            <li>Recht om bezwaar te maken tegen verwerking</li>
            <li>Recht om niet onderworpen te worden aan geautomatiseerde besluitvorming</li>
          </ul>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Naam *</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefoonnummer (optioneel)</Label>
            <Input 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="requestType">Type verzoek *</Label>
            <Select 
              onValueChange={handleSelectChange} 
              value={formData.requestType}
            >
              <SelectTrigger id="requestType">
                <SelectValue placeholder="Selecteer het type verzoek" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="access">Inzage in mijn gegevens</SelectItem>
                <SelectItem value="rectification">Correctie van mijn gegevens</SelectItem>
                <SelectItem value="deletion">Verwijdering van mijn gegevens</SelectItem>
                <SelectItem value="restriction">Beperking van verwerking</SelectItem>
                <SelectItem value="portability">Gegevensoverdraagbaarheid</SelectItem>
                <SelectItem value="objection">Bezwaar tegen verwerking</SelectItem>
                <SelectItem value="other">Ander verzoek</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Uw verzoek *</Label>
            <Textarea 
              id="message" 
              name="message" 
              rows={5} 
              value={formData.message} 
              onChange={handleChange} 
              placeholder="Geef details over uw verzoek en specificeer eventueel welke gegevens het betreft..."
              required 
            />
          </div>
        </div>
        
        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full md:w-auto" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verzoek verzenden..." : "Verzoek verzenden"}
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 mt-4">
          We behandelen uw verzoek binnen 30 dagen zoals vereist door de AVG-wetgeving. 
          Voor meer informatie over hoe wij met uw gegevens omgaan, zie ons <Link to="/privacy" className="text-primary hover:underline">Privacybeleid</Link>.
        </p>
      </form>
    </div>
  );
}
