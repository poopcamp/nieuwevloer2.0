
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const BathroomRenovation = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Badkamerrenovaties | NieuweVloer.be</title>
        <meta 
          name="description" 
          content="Complete badkamerrenovaties door ervaren vakmensen. Van ontwerp tot realisatie in Maldegem, Eeklo, Brugge en omstreken."
        />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Complete Badkamerrenovatie</h1>
        
        <div className="mb-8 relative overflow-hidden rounded-xl">
          <img 
            src="/assets/images/bathroom-renovation.jpg" 
            alt="Professionele badkamerrenovatie" 
            className="w-full h-64 md:h-96 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-6 text-white">
              <p className="text-lg font-semibold">Transformeer uw badkamer in een luxe wellnessoase</p>
            </div>
          </div>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Bij NieuweVloer.be verzorgen wij uw complete badkamerrenovatie van A tot Z. Onze ervaren vakmensen 
            coördineren alle werkzaamheden, van loodgieterij tot tegelwerk, zodat u kunt genieten van een 
            zorgeloze ervaring en een prachtig eindresultaat.
          </p>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Onze badkamerrenovatie diensten</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Volledige badkamerrenovatie</h3>
                <p>Complete vernieuwing van uw badkamer inclusief sanitair, tegelwerk, verlichting en accessoires.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Inloopdouches</h3>
                <p>Moderne en toegankelijke inloopdouches met hoogwaardige afwerking en waterdichte garantie.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Badkamermeubels</h3>
                <p>Op maat gemaakte of voorgemonteerde badkamermeubels die perfect passen bij uw stijl en ruimte.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Sanitaire installaties</h3>
                <p>Plaatsing en aansluiting van toiletten, wastafels, baden en andere sanitaire voorzieningen.</p>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Waarom kiezen voor onze badkamerrenovatie?</h2>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Alles-in-één oplossing</strong> - Wij coördineren alle werkzaamheden, u heeft slechts één aanspreekpunt.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Ervaren specialisten</strong> - Onze vakmensen hebben jarenlange ervaring in badkamerrenovaties.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Waterdichte garantie</strong> - We werken volgens de WTCB-normen en bieden garantie op onze werkzaamheden.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Transparante prijzen</strong> - Duidelijke offertes zonder verrassingen achteraf.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Tijdig opgeleverd</strong> - We houden ons aan de afgesproken planning en doorlooptijd.</span>
            </li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Ons renovatieproces</h2>
          
          <ol className="space-y-6 mb-8">
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full h-8 w-8 mr-4">1</span>
              <div>
                <h3 className="font-semibold text-lg">Oriëntatiegesprek</h3>
                <p>We bespreken uw wensen, budget en mogelijkheden tijdens een vrijblijvend gesprek.</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full h-8 w-8 mr-4">2</span>
              <div>
                <h3 className="font-semibold text-lg">Ontwerp en planning</h3>
                <p>We maken een gedetailleerd plan voor uw badkamer, inclusief materiaalkeuzes en tijdsplanning.</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full h-8 w-8 mr-4">3</span>
              <div>
                <h3 className="font-semibold text-lg">Sloopwerk</h3>
                <p>Zorgvuldig verwijderen van de bestaande badkamer met minimale overlast.</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full h-8 w-8 mr-4">4</span>
              <div>
                <h3 className="font-semibold text-lg">Renovatiewerkzaamheden</h3>
                <p>Loodgieterswerk, elektra, tegelwerk en sanitaire installaties worden door onze specialisten uitgevoerd.</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full h-8 w-8 mr-4">5</span>
              <div>
                <h3 className="font-semibold text-lg">Afwerking en oplevering</h3>
                <p>Uw nieuwe badkamer wordt tot in de puntjes afgewerkt en opgeleverd volgens afspraak.</p>
              </div>
            </li>
          </ol>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Vraag een offerte aan</h2>
            <p className="mb-4">Benieuwd naar de mogelijkheden voor uw badkamerrenovatie? Gebruik onze online configurator of maak een afspraak voor een vrijblijvend gesprek.</p>
            <div className="flex gap-4 flex-wrap">
              <Button asChild>
                <Link to="/configurator?projectType=badkamer">Configureer uw badkamer</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/contact">Vraag adviesgesprek aan</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BathroomRenovation;
