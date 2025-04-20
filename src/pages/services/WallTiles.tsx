
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const WallTiles = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Wandtegels Plaatsing | NieuweVloer.be</title>
        <meta 
          name="description" 
          content="Professionele plaatsing van wandtegels door vakkundige tegelzetters. Voor keukens, badkamers en andere ruimtes in Maldegem, Eeklo, Brugge en omstreken."
        />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Professionele Wandtegels Plaatsing</h1>
        
        <div className="mb-8 relative overflow-hidden rounded-xl">
          <img 
            src="/assets/images/wall-tiles-hero.jpg" 
            alt="Professionele wandtegelplaatsing" 
            className="w-full h-64 md:h-96 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-6 text-white">
              <p className="text-lg font-semibold">Perfecte afwerking voor uw wanden</p>
            </div>
          </div>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Bij NieuweVloer.be bieden we professionele wandtegelplaatsing voor elke ruimte in uw woning. 
            Onze ervaren tegelzetters zorgen voor een perfecte afwerking die uw keuken, badkamer of andere ruimte transformeert 
            in een stijlvolle en onderhoudsvriendelijke omgeving.
          </p>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Onze wandtegelplaatsing diensten</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Badkamer wandtegels</h3>
                <p>Waterbestendige wandtegels voor uw badkamer, verkrijgbaar in talloze stijlen, formaten en afwerkingen.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Keuken wandtegels</h3>
                <p>Praktische en stijlvolle wandtegels voor uw keuken, bestand tegen vocht, vet en vuil.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Mozaïek wandtegels</h3>
                <p>Kleintjes die samen grootse effecten creëren. Perfect voor accentwanden en bijzondere details.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Natuursteen wandtegels</h3>
                <p>Tijdloze schoonheid en natuurlijke uitstraling voor een luxe gevoel in uw woning.</p>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Voordelen van wandtegels</h2>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Onderhoudsvriendelijk</strong> - Eenvoudig te reinigen en bestand tegen vlekken.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Vochtbestendig</strong> - Ideaal voor vochtige ruimtes zoals badkamers en keukens.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Duurzaam</strong> - Gaan jarenlang mee zonder kwaliteitsverlies.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Hygiënisch</strong> - Bieden geen voedingsbodem voor schimmels of bacteriën.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Stijlvol</strong> - Verkrijgbaar in ontelbare designs, kleuren en afwerkingen.</span>
            </li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Ons werkproces</h2>
          
          <ol className="space-y-6 mb-8">
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full h-8 w-8 mr-4">1</span>
              <div>
                <h3 className="font-semibold text-lg">Adviesgesprek</h3>
                <p>We bespreken uw wensen en mogelijkheden en geven professioneel advies over materialen en uitvoering.</p>
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
                <h3 className="font-semibold text-lg">Voorbereiding</h3>
                <p>We zorgen voor een perfect vlakke ondergrond, essentieel voor een strak eindresultaat.</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full h-8 w-8 mr-4">4</span>
              <div>
                <h3 className="font-semibold text-lg">Tegelplaatsing</h3>
                <p>De tegels worden met precisie geplaatst, rekening houdend met patronen en details.</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full h-8 w-8 mr-4">5</span>
              <div>
                <h3 className="font-semibold text-lg">Afwerking</h3>
                <p>Zorgvuldige afwerking met hoogwaardige kit- en voegmaterialen voor een perfect resultaat.</p>
              </div>
            </li>
          </ol>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Vrijblijvende prijsindicatie</h2>
            <p className="mb-4">Benieuwd naar de kosten van wandtegelplaatsing in uw situatie? Gebruik onze online configurator of neem direct contact met ons op.</p>
            <div className="flex gap-4 flex-wrap">
              <Button asChild>
                <Link to="/configurator?projectType=keukenwand">Configureer uw project</Link>
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

export default WallTiles;
