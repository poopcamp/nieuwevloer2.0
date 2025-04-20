
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
    title: "Professionele badkamerrenovatie",
    subtitle: "Transformeer uw badkamer tot een ontspannende ruimte",
    content: "Een badkamerrenovatie is meer dan alleen het vernieuwen van tegels en sanitair. Het is een transformatie van een puur functionele ruimte naar een persoonlijke wellness-omgeving waar u dagelijks tot rust komt. Ons gespecialiseerde team begeleidt u door het volledige renovatieproces - van het eerste ontwerpconcept tot de laatste finishing touch."
  },
  {
    title: "Badkamerrenovatie door experts",
    subtitle: "Vakmanschap voor uw perfecte badkamer",
    content: "Een succesvolle badkamerrenovatie vereist expertise in verschillende disciplines: tegelwerk, sanitair, elektriciteit en loodgieterij. Ons team van specialisten werkt naadloos samen om uw droombaadkamer te realiseren binnen de afgesproken tijd en budget. Met jarenlange ervaring in badkamerrenovaties garanderen wij een vlekkeloos resultaat."
  },
  {
    title: "Complete badkamervernieuwing",
    subtitle: "Van ontwerp tot realisatie onder één dak",
    content: "Een volledige badkamerrenovatie omvat veel aspecten - van het verwijderen van oude tegels en sanitair tot het installeren van moderne oplossingen. Als gerenommeerde badkamerspecialisten zorgen wij voor een zorgeloos renovatieproces, waarbij we duidelijk communiceren en werken volgens de hoogste standaarden. Het resultaat: een prachtige nieuwe badkamer waar u jarenlang van kunt genieten."
  }
];

const renovatieTrends = [
  "Inloopdouches met verzonken douchegoten",
  "Grote formaat tegels voor minder voegen",
  "Slimme opbergoplossingen voor een ruimtelijk effect",
  "Natuurlijke materialen en aardetinten",
  "Op maat gemaakte douchenissen",
  "Vrijstaande baden als statement-stuk"
];

const renovatieAspecten = [
  {
    aspect: "Tegelwerk",
    beschrijving: "Hoogwaardig tegelwerk vormt de basis van een duurzame badkamer. Wij werken met verschillende formaten en stijlen van vloer- en wandtegels, perfect geplaatst met waterdichte kitten en voegen voor langdurige bescherming tegen vocht."
  },
  {
    aspect: "Sanitair",
    beschrijving: "Van moderne inloopdouches tot vrijstaande baden en stijlvolle wastafels - wij installeren al uw sanitair met precisie en oog voor detail. We werken met betrouwbare merken die comfort combineren met esthetiek."
  },
  {
    aspect: "Elektriciteit",
    beschrijving: "Veilige en goed geplaatste elektriciteit is essentieel in een badkamer. We zorgen voor correcte verlichting, ventilatie en eventuele extra voorzieningen zoals vloerverwarming, alles volgens de nieuwste veiligheidsnormen."
  },
  {
    aspect: "Loodgieterij",
    beschrijving: "Een onzichtbaar maar cruciaal onderdeel van elke badkamerrenovatie. Ons team zorgt voor professionele aan- en afvoerleidingen die perfect functioneren en geen lekkages veroorzaken."
  }
];

const tipVanVakman = {
  titel: "Tip van de vakman",
  content: "Investeer in een goede waterdichte ondergrond voordat u begint met tegelen. Een goed uitgevoerde waterdichting voorkomt vochtproblemen en kostbare schade op lange termijn. Ook is het aan te raden om te kiezen voor kwaliteitsvolle kranen en sanitair - dit zijn onderdelen die dagelijks gebruikt worden en waar u jarenlang plezier van wilt hebben."
};

const voordelen = [
  "Verhoogde woningwaarde",
  "Verbeterde energie-efficiëntie",
  "Meer comfort en gebruiksgemak",
  "Moderne uitstraling",
  "Betere ruimtebenutting",
  "Minder onderhoud door nieuwe materialen"
];

const BathroomRenovationServices = () => {
  const [selectedIntro, setSelectedIntro] = useState(0);
  
  // Select random intro text on page load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * introTexts.length);
    setSelectedIntro(randomIndex);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Professionele Badkamerrenovatie | NieuweTegels.be</title>
        <meta name="description" content="Complete badkamerrenovatie door experts. Van tegelwerk tot sanitair - transformeer uw badkamer in een moderne, comfortabele ruimte." />
        <meta name="keywords" content="badkamerrenovatie,badkamer verbouwen,badkamertegels,douche,inloopdouche,tegelplaatsing badkamer" />
        <meta property="og:title" content="Professionele Badkamerrenovatie | NieuweTegels.be" />
        <meta property="og:description" content="Laat uw badkamer renoveren door ervaren specialisten. Complete service van ontwerp tot realisatie." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nieuwetegels.be/badkamerrenovatie" />
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
                  src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Badkamerrenovatie"
                  className="rounded-lg shadow-lg w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Actuele trends in badkamerrenovatie</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {renovatieTrends.map((trend, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-gray-800">{trend}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Aspecten van badkamerrenovatie</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {renovatieAspecten.map((aspect, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-primary mb-3">{aspect.aspect}</h3>
                  <p className="text-gray-700">{aspect.beschrijving}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-primary mb-4">{tipVanVakman.titel}</h3>
              <p className="text-gray-700">{tipVanVakman.content}</p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Voordelen van een professionele badkamerrenovatie</h2>
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
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Klaar om uw badkamer te vernieuwen?</h2>
            <p className="text-gray-700 max-w-3xl mx-auto mb-8">
              Neem vandaag nog contact met ons op voor professioneel advies en een vrijblijvende offerte op maat.
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

export default BathroomRenovationServices;
