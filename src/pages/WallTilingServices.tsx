
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
    title: "Professionele wandtegelplaatsing",
    subtitle: "Elegante wandafwerking voor elke ruimte",
    content: "Wandtegels vormen een tijdloze en praktische keuze voor verschillende ruimtes in uw woning. Met onze professionele plaatsingsdienst transformeren we uw wanden tot stijlvolle, onderhoudsvriendelijke oppervlakken die jarenlang meegaan. Onze ervaren tegelzetters werken nauwkeurig en efficiënt, waarbij ze gebruik maken van de nieuwste technieken en hoogwaardige materialen."
  },
  {
    title: "Specialisten in wandtegelwerk",
    subtitle: "Vakmanschap voor uw wandafwerking",
    content: "Wandtegels bieden eindeloze mogelijkheden voor het creëren van unieke en persoonlijke ruimtes. Als specialisten in wandtegelwerk combineren we technische expertise met oog voor detail om uw visie werkelijkheid te maken. Van moderne, minimalistische designs tot traditionele patronen – wij hebben de kennis en ervaring om elk type wandtegel perfect te plaatsen."
  },
  {
    title: "Wandtegels die uw ruimte transformeren",
    subtitle: "Van concept naar perfecte uitvoering",
    content: "De juiste wandtegels kunnen een ruimte compleet transformeren. Onze wandtegelplaatsing service omvat deskundig advies, zorgvuldige voorbereiding en vakkundige uitvoering. We helpen u bij het selecteren van de ideale tegels die passen bij uw stijl en budget, waarna onze vakmensen zorgen voor een plaatsing waar u jarenlang van kunt genieten."
  }
];

const tegelTrends = [
  "Grote formaat wandtegels voor een naadloze uitstraling",
  "Natuurlijke materialen en organische texturen",
  "Geometrische patronen voor een moderne twist",
  "Matte afwerkingen voor een elegante, tijdloze look",
  "Metrotegels in vernieuwende legpatronen",
  "Marmer- en steenlook tegels voor luxe zonder onderhoudsnadelen"
];

const toepassingen = [
  {
    ruimte: "Badkamer",
    beschrijving: "Wandtegels in de badkamer bieden niet alleen bescherming tegen vocht, maar creëren ook een sfeervolle ruimte waar u tot rust kunt komen. Van volledige betegeling tot accent wanden - de mogelijkheden zijn eindeloos."
  },
  {
    ruimte: "Keuken",
    beschrijving: "In de keuken zorgen wandtegels voor een hygiënische en onderhoudsvriendelijke achterwand die bestand is tegen vetspatten en vlekken. Kies voor een subtiele neutrale tegel of maak een statement met kleur en patroon."
  },
  {
    ruimte: "Toilet",
    beschrijving: "De kleine ruimte van een toilet is perfect voor het experimenteren met wandtegels. Een volledig betegelde ruimte is niet alleen praktisch maar kan ook visueel aantrekkelijk zijn met de juiste tegelkeuze."
  },
  {
    ruimte: "Hal en entree",
    beschrijving: "Wandtegels in de hal of entree maken een sterke eerste indruk en zijn tegelijkertijd bestand tegen dagelijks gebruik. Combineer met vloertegels voor een harmonieus geheel."
  }
];

const tipVanVakman = {
  titel: "Tip van de vakman",
  content: "Bij het kiezen van wandtegels, overweeg niet alleen het uiterlijk maar ook de praktische aspecten. Voor vochtige ruimtes zoals badkamers, kies tegels met een lage waterabsorptie. Let ook op het formaat - grotere tegels kunnen een ruimte groter doen lijken, maar vereisen een perfect vlakke ondergrond. Kleinere tegels zijn vaak makkelijker te plaatsen op oneven oppervlakken."
};

const voordelenKeramischeTegels = [
  "Duurzaam en slijtvast",
  "Waterbestendig en vochtwerend",
  "Eenvoudig te reinigen en hygiënisch",
  "Brandveilig en hittebestendig",
  "Kleurvast en verbleken niet",
  "Verkrijgbaar in oneindige designs en formaten"
];

const WallTilingServices = () => {
  const [selectedIntro, setSelectedIntro] = useState(0);
  
  // Select random intro text on page load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * introTexts.length);
    setSelectedIntro(randomIndex);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Professionele Wandtegelplaatsing | NieuweTegels.be</title>
        <meta name="description" content="Specialisten in wandtegelplaatsing voor badkamer, keuken en meer. Ontdek onze professionele diensten en de nieuwste tegeltrends voor wanden." />
        <meta name="keywords" content="wandtegels,wandtegelplaatsing,wandafwerking,badkamertegels,keukentegels,tegelplaatsing" />
        <meta property="og:title" content="Professionele Wandtegelplaatsing | NieuweTegels.be" />
        <meta property="og:description" content="Transformeer uw ruimtes met professionele wandtegelplaatsing. Van modern tot klassiek - voor elke stijl en budget." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nieuwetegels.be/wandtegelplaatsing" />
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
                  src="https://images.unsplash.com/photo-1609840533428-4d9f338a9848?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Wandtegelplaatsing"
                  className="rounded-lg shadow-lg w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Actuele tegeltrends voor wanden</h2>
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Voordelen van keramische wandtegels</h2>
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
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Klaar om uw wandtegelproject te starten?</h2>
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

export default WallTilingServices;
