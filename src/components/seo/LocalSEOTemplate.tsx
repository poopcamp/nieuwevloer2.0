
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CallToAction from "@/components/cta/CallToAction";
import DisclaimerCard from "@/components/configurator/DisclaimerCard";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocalSEOTemplateProps {
  city: string;
  title: string;
  metaDescription: string;
  distance: string;
  serviceHighlight: string;
}

const LocalSEOTemplate = ({
  city,
  title,
  metaDescription,
  distance,
  serviceHighlight,
}: LocalSEOTemplateProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://nieuwevloer.be/locaties/${city.toLowerCase().replace(/\s+/g, "-")}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://nieuwevloer.be/locaties/${city.toLowerCase().replace(/\s+/g, "-")}`} />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center mb-6 text-gray-500 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              {city} ({distance} van Maldegem)
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Professionele tegelplaatsing in {city}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-semibold mb-4">Vloer- en wandtegels plaatsen in {city}</h2>
                <p className="mb-4">
                  Op zoek naar een <strong>ervaren vloerder in {city}</strong>? NieuweVloer.be is uw lokale partner voor professionele tegelplaatsing
                  en badkamerrenovatie in {city} en omgeving. Als ervaren <strong>tegelzetter in {city}</strong>, bieden wij kwalitatief hoogstaande
                  vloerwerken, wandtegelplaatsing en badkamerrenovaties aan scherpe prijzen.
                </p>
                <p className="mb-6">
                  Wij zijn de specialist in {serviceHighlight} in {city}, met meer dan 15 jaar ervaring en 
                  tevreden klanten door heel de regio. Door onze lokale aanwezigheid in {city} kunnen we snel reageren op uw aanvraag
                  en een plaatsbezoek inplannen binnen één week.
                </p>
                
                <h2 className="text-2xl font-semibold mb-4">Ons aanbod in {city}</h2>
                <ul className="list-disc pl-5 mb-6">
                  <li>Vloertegelplaatsing in woonkamers, keukens, inkomhallen en leefruimtes</li>
                  <li>Wandtegelplaatsing in badkamers, keukens en douches</li>
                  <li>Volledige en gedeeltelijke badkamerrenovaties</li>
                  <li>Douche op maat of inloopdouche aanleggen</li>
                  <li>Professioneel tegel op tegel plaatsen</li>
                  <li>Gratis advies en plaatsbezoek in {city}</li>
                </ul>
                
                <h2 className="text-2xl font-semibold mb-4">Waarom kiezen inwoners van {city} voor NieuweVloer.be?</h2>
                <p className="mb-4">
                  Klanten uit {city} kiezen voor ons omwille van onze professionele aanpak, oog voor detail en betrouwbare service. 
                  Wij werken met hoogwaardige materialen en volgen strikt de Buildwise-richtlijnen.
                </p>
                <p className="mb-6">
                  <strong>Lokale service in {city}:</strong> Door onze lokale aanwezigheid kennen we de specifieke noden
                  en voorkeuren van klanten in {city}. We komen bij u aan huis voor een gratis plaatsbezoek en advies op maat.
                </p>
                
                <div className="bg-primary/5 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-semibold mb-3">Vraag een offerte aan in {city}</h3>
                  <p className="mb-4">
                    Bereken in slechts 1 minuut de richtprijs voor uw project in {city} of vraag direct een vrijblijvende offerte aan.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild className="font-medium">
                      <Link to="/configurator">
                        Bereken uw richtprijs
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="font-medium">
                      <Link to="/contact">
                        Vraag een offerte aan
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="sticky top-24">
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-semibold mb-4">Contactgegevens</h3>
                  <p className="mb-2"><strong>Adres:</strong> Vakekerkweg 111, 9990 Maldegem</p>
                  <p className="mb-2"><strong>Telefoon:</strong> <a href="tel:+32472000000" className="text-primary hover:underline">+32 472 00 00 00</a></p>
                  <p className="mb-4"><strong>Email:</strong> <a href="mailto:info@nieuwevloer.be" className="text-primary hover:underline">info@nieuwevloer.be</a></p>
                  <p><strong>Actief in:</strong> {city} en omgeving (straal van 30 km)</p>
                </div>
                
                <DisclaimerCard />
              </div>
            </div>
          </div>
        </div>
        
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
};

export default LocalSEOTemplate;
