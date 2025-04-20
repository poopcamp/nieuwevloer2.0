
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Sanitary = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Sanitaire Installaties | NieuweVloer.be</title>
        <meta 
          name="description" 
          content="Professionele installatie van sanitair voor badkamers en keukens door ervaren vakmensen in Maldegem, Eeklo, Brugge en omstreken."
        />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Sanitaire Installaties</h1>
        
        <div className="mb-8 relative overflow-hidden rounded-xl">
          <img 
            src="/assets/images/sanitary-installation.jpg" 
            alt="Professionele sanitaire installaties" 
            className="w-full h-64 md:h-96 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-6 text-white">
              <p className="text-lg font-semibold">Vakkundige installatie van uw sanitair</p>
            </div>
          </div>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Bij NieuweVloer.be verzorgen wij alle sanitaire installaties voor uw badkamer of keuken.
            Onze deskundige loodgieters zorgen voor vakkundige montage en aansluiting van alle sanitaire 
            componenten, van wastafels en toiletten tot douches en baden.
          </p>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Onze sanitaire diensten</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Badkamer sanitair</h3>
                <p>Installatie van wastafels, toiletten, douches, baden en andere sanitaire voorzieningen voor uw badkamer.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Keuken sanitair</h3>
                <p>Professionele installatie van gootstenen, kranen en andere sanitaire voorzieningen voor uw keuken.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Leidingwerk</h3>
                <p>Aanleg en renovatie van waterleidingen, afvoeren en riolering volgens de geldende normen.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Verwarming</h3>
                <p>Installatie van verwarmingssystemen, waaronder vloerverwarming en radiatoren voor uw badkamer.</p>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Waarom kiezen voor onze sanitaire diensten?</h2>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Ervaren vakmensen</strong> - Onze loodgieters hebben jarenlange ervaring en kennis van de nieuwste technieken.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Kwaliteitsgarantie</strong> - We werken volgens alle geldende normen en bieden garantie op ons werk.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Totaaloplossing</strong> - Van advies tot installatie en nazorg, wij verzorgen het complete traject.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Netjes werken</strong> - We zorgen voor minimale overlast en laten uw woning schoon achter.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 h-5 w-5 text-primary flex-shrink-0">✓</span>
              <span><strong>Transparante prijzen</strong> - Vooraf duidelijkheid over alle kosten, zonder verrassingen achteraf.</span>
            </li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Ons werkproces</h2>
          
          <ol className="space-y-6 mb-8">
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full h-8 w-8 mr-4">1</span>
              <div>
                <h3 className="font-semibold text-lg">Inventarisatie</h3>
                <p>We brengen uw sanitaire wensen in kaart en bespreken de mogelijkheden binnen uw ruimte en budget.</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full h-8 w-8 mr-4">2</span>
              <div>
                <h3 className="font-semibold text-lg">Plan en offerte</h3>
                <p>We maken een gedetailleerd werkplan en bieden een transparante offerte voor de werkzaamheden.</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full h-8 w-8 mr-4">3</span>
              <div>
                <h3 className="font-semibold text-lg">Voorbereiding</h3>
                <p>Eventueel demonteren van oude sanitaire voorzieningen en voorbereiden van leidingwerk.</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full h-8 w-8 mr-4">4</span>
              <div>
                <h3 className="font-semibold text-lg">Installatie</h3>
                <p>Vakkundige installatie van alle sanitaire voorzieningen volgens de geldende normen.</p>
              </div>
            </li>
            <li className="flex">
              <span className="flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full h-8 w-8 mr-4">5</span>
              <div>
                <h3 className="font-semibold text-lg">Controle en oplevering</h3>
                <p>Zorgvuldige controle op lekkages en werking, gevolgd door een nette oplevering.</p>
              </div>
            </li>
          </ol>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Vraag een vrijblijvende offerte aan</h2>
            <p className="mb-4">Heeft u sanitaire werkzaamheden gepland? Neem contact met ons op voor een vrijblijvende offerte op maat.</p>
            <div className="flex gap-4 flex-wrap">
              <Button asChild>
                <Link to="/configurator?projectType=badkamer">Configureer uw project</Link>
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

export default Sanitary;
