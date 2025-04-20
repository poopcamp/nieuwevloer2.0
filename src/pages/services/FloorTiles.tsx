
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const FloorTiles = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Vloertegels Plaatsing | NieuweVloer.be</title>
        <meta 
          name="description" 
          content="Professionele plaatsing van vloertegels door vakkundige tegelzetters. Voor keukens, badkamers, woonkamers en andere ruimtes in Maldegem, Eeklo, Brugge en omstreken."
        />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Professionele Vloertegels Plaatsing</h1>
        
        <div className="mb-8 relative overflow-hidden rounded-xl">
          <img 
            src="/assets/images/floor-tiles-hero.jpg" 
            alt="Professionele vloertegelplaatsing" 
            className="w-full h-64 md:h-96 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-6 text-white">
              <p className="text-lg font-semibold">Hoogwaardige vloeren voor elke ruimte</p>
            </div>
          </div>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Bij NieuweVloer.be bieden we professionele vloertegelplaatsing voor elke ruimte in uw woning. 
            Onze ervaren tegelzetters zorgen voor een perfecte afwerking die uw keuken, badkamer, woonkamer of andere ruimte transformeert 
            in een stijlvolle en duurzame omgeving.
          </p>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Onze vloertegelplaatsing diensten</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Keramische vloertegels</h3>
                <p>Duurzame en onderhoudsvriendelijke vloertegels, ideaal voor intensief gebruikte ruimtes zoals keukens en badkamers.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Natuursteen vloertegels</h3>
                <p>Tijdloze elegantie met unieke patronen. Natuursteen geeft uw vloer een exclusieve uitstraling.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Grootformaat vloertegels</h3>
                <p>Moderne vloertegels in grote formaten die uw ruimte ruimer doen lijken en een strak, eigentijds gevoel geven.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Vloertegels met vloerverwarming</h3>
                <p>Specialistische plaatsing van vloertegels op vloerverwarmingssystemen voor optimale warmteafgifte.</p>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Voordelen van vloertegels</h2>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Duurzaamheid</strong> - Vloertegels gaan jarenlang mee zonder slijtage of verkleuring.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Onderhoudsvriendelijk</strong> - Eenvoudig te reinigen en bestand tegen vlekken en vocht.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Hittebestendig</strong> - Ideaal voor gebruik met vloerverwarming en in zonnige ruimtes.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Hygiënisch</strong> - Geen voedingsbodem voor huisstofmijt, allergenen of bacteriën.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Stijlvol</strong> - Verkrijgbaar in talloze designs, kleuren en afwerkingen.</span>
            </li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Ons werkproces</h2>
          
          <ol className="space-y-6 mb-8">
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full h-8 w-8 mr-4">1</span>
              <div>
                <h3 className="font-semibold text-lg">Inspectie & advies</h3>
                <p>We beoordelen de ondergrond en geven deskundig advies over tegeltypes en legpatronen.</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full h-8 w-8 mr-4">2</span>
              <div>
                <h3 className="font-semibold text-lg">Offerte</h3>
                <p>U ontvangt een gedetailleerde, transparante offerte zonder verborgen kosten.</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full h-8 w-8 mr-4">3</span>
              <div>
                <h3 className="font-semibold text-lg">Ondergrond voorbereiding</h3>
                <p>We zorgen voor een perfect vlakke, stabiele ondergrond: essentieel voor een duurzaam resultaat.</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full h-8 w-8 mr-4">4</span>
              <div>
                <h3 className="font-semibold text-lg">Tegelplaatsing</h3>
                <p>Hoogwaardige plaatsing met perfecte uitlijning en consistente voegbreedte.</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full h-8 w-8 mr-4">5</span>
              <div>
                <h3 className="font-semibold text-lg">Afwerking & oplevering</h3>
                <p>Zorgvuldige voegafwerking, reiniging en een finale kwaliteitscontrole voor oplevering.</p>
              </div>
            </li>
          </ol>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Vrijblijvende prijsindicatie</h2>
            <p className="mb-4">Benieuwd naar de kosten van vloertegelplaatsing in uw situatie? Gebruik onze online configurator of neem direct contact met ons op.</p>
            <div className="flex gap-4 flex-wrap">
              <Button asChild>
                <Link to="/configurator?projectType=vloer">Configureer uw project</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/contact">Direct contact opnemen</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorTiles;
