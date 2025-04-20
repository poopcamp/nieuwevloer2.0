
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
    title: "Professionele vloertegelplaatsing",
    subtitle: "Duurzame en stijlvolle vloeren voor elke ruimte",
    content: "Een hoogwaardige vloerbetegeling vormt de basis van elke mooie ruimte. Met onze professionele tegelplaatsing krijgt u niet alleen een esthetisch aantrekkelijke vloer, maar ook een duurzame oplossing die jarenlang meegaat. Onze vakmensen werken met precisie en zorg, waarbij we gebruik maken van de beste materialen en technieken voor een perfect resultaat."
  },
  {
    title: "Vakkundige vloerbetegeling",
    subtitle: "Ervaren tegelzetters voor uw project",
    content: "Het leggen van vloertegels is een vak apart dat precisie en expertise vereist. Onze specialisten hebben jarenlange ervaring in het plaatsen van diverse soorten vloertegels in verschillende ruimtes - van keukens en badkamers tot woonkamers en terrassen. Met een perfecte maatvoering en waterpas geplaatste tegels zorgen we voor een vlakke vloer zonder oneffenheden."
  },
  {
    title: "Kwaliteitsvloeren voor uw woning",
    subtitle: "Tegelvloeren met karakter en functionaliteit",
    content: "Een tegelvloer combineert duurzaamheid met stijl en is daarom perfect voor intensief gebruikte ruimtes. Of u nu kiest voor keramiek, natuursteen of porselein - wij zorgen voor een perfecte plaatsing die de schoonheid van het materiaal maximaal tot zijn recht laat komen. Met de juiste ondergrondvoorbereiding en plaatsingstechniek garanderen wij een vloer die generaties meegaat."
  }
];

const tegelTrends = [
  "XXL-formaat vloertegels voor een ruimtelijk effect",
  "Houtlook tegels die de warmte van hout combineren met het gemak van tegels",
  "Terrazzo-look tegels voor een eigentijdse retro-uitstraling",
  "Hexagon-vormige tegels voor een uniek patroon",
  "Natuursteen-look met minimale voegen",
  "Matte afwerkingen voor een moderne, tijdloze uitstraling"
];

const toepassingen = [
  {
    ruimte: "Woonkamer",
    beschrijving: "Een tegelvloer in de woonkamer biedt niet alleen duurzaamheid maar ook comfort, zeker in combinatie met vloerverwarming. De grote formaten die nu trending zijn, creëren een ruimtelijk effect en zijn makkelijk te onderhouden."
  },
  {
    ruimte: "Keuken",
    beschrijving: "In de keuken is een tegelvloer de ideale keuze dankzij de vlekbestendigheid en het gemakkelijke onderhoud. Keramische tegels zijn bestand tegen vocht, hitte en vlekken - perfect voor deze intensief gebruikte ruimte."
  },
  {
    ruimte: "Badkamer",
    beschrijving: "Vloertegels in de badkamer bieden de nodige waterdichtheid en zijn slipbestendig verkrijgbaar voor extra veiligheid. Met een juiste waterdichte ondervloer en professionele plaatsing geniet u jarenlang van een probleemloze badkamervloer."
  },
  {
    ruimte: "Hal & entree",
    beschrijving: "De entree is het visitekaartje van uw woning. Een duurzame tegelvloer is hier perfect om vuil en vocht te weerstaan, terwijl het direct een stijlvolle eerste indruk maakt bij uw gasten."
  }
];

const tipVanVakman = {
  titel: "Tip van de vakman",
  content: "Bij het kiezen van vloertegels is het belangrijk om niet alleen naar de esthetiek te kijken, maar ook naar de gebruikseigenschappen. Let op de slijtvastheidsklasse (PEI-waarde) die aangeeft hoe geschikt de tegel is voor intensief gebruik. Voor woonkamers raden we minimaal PEI III aan, voor keukens en hallen PEI IV. Bestel altijd 10% extra tegels voor toekomstige reparaties of uitbreidingen - deze zijn later moeilijk in dezelfde batch te verkrijgen."
};

const voordelenKeramischeTegels = [
  "Extreem duurzaam en slijtvast",
  "Onderhoudsvriendelijk en eenvoudig te reinigen",
  "Ideaal voor vloerverwarming",
  "Hygiënisch en allergievriendelijk",
  "Bestand tegen vocht en vlekken",
  "Beschikbaar in eindeloze ontwerpen en formaten"
];

const FloorTilingServices = () => {
  const [selectedIntro, setSelectedIntro] = useState(0);
  
  // Select random intro text on page load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * introTexts.length);
    setSelectedIntro(randomIndex);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Professionele Vloertegelplaatsing | NieuweTegels.be</title>
        <meta name="description" content="Specialisten in vloertegelplaatsing voor keuken, badkamer, woonkamer en meer. Ontdek onze professionele diensten en de nieuwste tegeltrends voor vloeren." />
        <meta name="keywords" content="vloertegels,vloertegelplaatsing,tegelvloer,keramische vloertegels,tegelzetter,tegelplaatsing" />
        <meta property="og:title" content="Professionele Vloertegelplaatsing | NieuweTegels.be" />
        <meta property="og:description" content="Duurzame en stijlvolle vloeren met professionele tegelplaatsing. Vakkundige uitvoering voor elk project." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nieuwetegels.be/vloertegelplaatsing" />
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
                  src="https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Vloertegelplaatsing"
                  className="rounded-lg shadow-lg w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Actuele tegeltrends voor vloeren</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tegelTrends.map((trend, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-gray-800">{trend}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Toepassingen per ruimte</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {toepassingen.map((toepassing, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-primary mb-3">{toepassing.ruimte}</h3>
                  <p className="text-gray-700">{toepassing.beschrijving}</p>
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Voordelen van keramische vloertegels</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {voordelenKeramischeTegels.map((voordeel, index) => (
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
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Klaar om uw vloer te vernieuwen?</h2>
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

export default FloorTilingServices;
