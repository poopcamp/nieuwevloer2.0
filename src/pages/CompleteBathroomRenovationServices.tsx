
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

// SEO content variations
const introTexts = [
  {
    title: "Totale badkamerrenovatie",
    subtitle: "Van ontwerp tot realisatie, alles onder één dak",
    content: "Een totale badkamerrenovatie omvat meer dan alleen tegels en sanitair. Het is een complete transformatie waarbij alle aspecten worden aangepakt: tegelwerk, sanitair, elektriciteit, loodgieterij en afwerking. Ons gespecialiseerde team verzorgt het gehele proces, van het eerste ontwerp tot de laatste afwerking, zodat u kunt genieten van een volledig nieuwe badkamer zonder zorgen."
  },
  {
    title: "Complete badkamer transformatie",
    subtitle: "Allesomvattende renovatie door ervaren specialisten",
    content: "Bij een totale badkamerrenovatie laten we niets aan het toeval over. We vernieuwen uw badkamer volledig - van vloer tot plafond, inclusief alle technische installaties. Met onze jarenlange ervaring zorgen we voor een perfect gecoördineerd project waarbij alle werkzaamheden in de juiste volgorde worden uitgevoerd door gekwalificeerde vakmensen."
  },
  {
    title: "Badkamer volledig vernieuwen",
    subtitle: "Een turn-key oplossing voor uw nieuwe badkamer",
    content: "Een volledige badkamerrenovatie biedt de kans om uw droom badkamer te realiseren zonder compromissen. Door de ruimte compleet te strippen en opnieuw op te bouwen, kunnen we innovatieve oplossingen implementeren die anders niet mogelijk zouden zijn. Van slimme indeling tot de nieuwste technieken - wij maken het werkelijkheid met minimale hinder en maximaal resultaat."
  }
];

const renovatieAspecten = [
  {
    aspect: "Ontwerp & planning",
    beschrijving: "We beginnen met een uitgebreid ontwerp en gedetailleerde planning. Hierbij houden we rekening met uw wensen, budget en de technische mogelijkheden. Een goed doordacht plan vormt de basis voor een succesvolle totaalrenovatie."
  },
  {
    aspect: "Sanitair & elektriciteitswerk",
    beschrijving: "Onze specialisten installeren al het sanitair volgens de hoogste standaarden en zorgen voor veilige, moderne elektrische installaties. Van energiezuinige verlichting tot vloerverwarming - we implementeren alle technische aspecten perfect."
  },
  {
    aspect: "Tegelwerk & waterdichting",
    beschrijving: "Professioneel tegelwerk met waterdichte ondergrond is essentieel voor een duurzame badkamer. Onze tegelzetters werken met precisie en gebruiken hoogwaardige materialen voor een perfect resultaat dat jaren meegaat."
  },
  {
    aspect: "Afwerking & accessoires",
    beschrijving: "De laatste fase omvat alle afwerkingsdetails en het plaatsen van accessoires. Hier komt alles samen tot een harmonieus geheel dat niet alleen functioneel is maar ook een lust voor het oog."
  }
];

const voordelen = [
  "Alles-in-één oplossing zonder zorgen",
  "Één aanspreekpunt voor het hele project",
  "Perfecte coördinatie tussen verschillende werken",
  "Kortere totale renovatietijd",
  "Consistente kwaliteit over het hele project",
  "Geoptimaliseerd budget door efficiënte werkplanning"
];

const badkamerTrends = [
  "Slimme badkamer technologie (digitale douches, LED-verlichting)",
  "Natuurlijke materialen en neutrale kleuren",
  "Minimalistische ontwerpen met verborgen opbergruimte",
  "Inloopdouches met glazen wanden",
  "Vrijstaande baden als focuspunt",
  "Matte zwarte of brons accessoires voor een luxe uitstraling"
];

const tipVanVakman = {
  titel: "Tip van de vakman",
  content: "Bij een totale badkamerrenovatie is een goede voorbereiding het halve werk. Plan voldoende tijd in voor het selecteren van alle materialen en producten voordat de werkzaamheden beginnen. Zo voorkomt u vertraging en zorgt u ervoor dat alles past bij uw visie. Overweeg ook om extra budget (ongeveer 10-15%) achter de hand te houden voor onvoorziene omstandigheden die bij elke renovatie kunnen optreden."
};

const CompleteBathroomRenovationServices = () => {
  const [selectedIntro, setSelectedIntro] = useState(0);
  
  // Select random intro text on page load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * introTexts.length);
    setSelectedIntro(randomIndex);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Totale Badkamerrenovatie | NieuweTegels.be</title>
        <meta name="description" content="Totale badkamerrenovatie door experts. Van ontwerp tot realisatie - een complete transformatie van uw badkamer inclusief sanitair en elektriciteitswerk." />
        <meta name="keywords" content="totale badkamerrenovatie,complete badkamer,badkamer verbouwen,sanitair installatie,elektriciteitswerk,tegelplaatsing" />
        <meta property="og:title" content="Totale Badkamerrenovatie | NieuweTegels.be" />
        <meta property="og:description" content="Laat uw badkamer compleet renoveren door ervaren specialisten. Alle aspecten onder één dak: van ontwerp tot realisatie." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nieuwetegels.be/totale-badkamerrenovatie" />
      </Helmet>
      
      <Navbar />
      <main className="flex-grow">
        <div className="relative py-16 bg-gradient-to-b from-primary/10 to-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {introTexts[selectedIntro].title}
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  {introTexts[selectedIntro].subtitle}
                </p>
                <div className="prose prose-lg">
                  <p>{introTexts[selectedIntro].content}</p>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                    <Link to="/configurator">Bereken uw prijs</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/contact">Neem contact op</Link>
                  </Button>
                </div>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1599639668412-e45b09283b6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Totale badkamerrenovatie"
                  className="rounded-lg shadow-lg w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Een volledig proces van A tot Z</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {renovatieAspecten.map((aspect, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-primary mb-3">{aspect.aspect}</h3>
                  <p className="text-gray-700">{aspect.beschrijving}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Voordelen van een totale badkamerrenovatie</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {voordelen.map((voordeel, index) => (
                <div key={index} className="flex items-start gap-3 bg-white p-5 rounded-lg shadow-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-800">{voordeel}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Actuele badkamertrends</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {badkamerTrends.map((trend, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-gray-800">{trend}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-primary mb-4">{tipVanVakman.titel}</h3>
              <p className="text-gray-700">{tipVanVakman.content}</p>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Klaar voor een complete transformatie?</h2>
            <p className="text-gray-700 max-w-3xl mx-auto mb-8">
              Neem vandaag nog contact met ons op voor professioneel advies en een vrijblijvende offerte op maat voor uw totale badkamerrenovatie.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/configurator">Bereken uw prijs</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Neem contact op</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CompleteBathroomRenovationServices;
