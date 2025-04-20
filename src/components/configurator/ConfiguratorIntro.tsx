
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Calculator, Clock, Zap, InfoIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ConfiguratorIntroProps {
  onStart: () => void;
}

const ConfiguratorIntro = ({ onStart }: ConfiguratorIntroProps) => {
  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="text-center space-y-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Tegelconfigurator
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Wij berekenen een richtprijs voor je tegelproject op basis van m², type tegels en afwerking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full py-1 px-3 text-sm font-medium">
                <Clock className="h-4 w-4" />
                <span>Snel & eenvoudig</span>
              </div>
              
              <h3 className="font-semibold text-xl text-gray-800">Hoe werkt het?</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">1</div>
                  <div>
                    <h4 className="font-medium">Kies je project</h4>
                    <p className="text-gray-600 text-sm">Selecteer het type ruimte en tegelwerk</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">2</div>
                  <div>
                    <h4 className="font-medium">Vul de details in</h4>
                    <p className="text-gray-600 text-sm">Geef de afmetingen en specificaties op</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">3</div>
                  <div>
                    <h4 className="font-medium">Ontvang je richtprijs</h4>
                    <p className="text-gray-600 text-sm">Bekijk direct een indicatie excl. BTW</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">4</div>
                  <div>
                    <h4 className="font-medium">Maak een afspraak</h4>
                    <p className="text-gray-600 text-sm">Gratis en vrijblijvend plaatsbezoek</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-center">
              <div className="mb-4">
                <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mb-3">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-xl text-gray-800 mb-3">Wat is inbegrepen?</h3>
              </div>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Plaatsing van tegels (arbeidsloon)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Alle benodigde materialen (lijm, voegsel)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Gratis en vrijblijvend plaatsbezoek</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Persoonlijk advies en begeleiding</span>
                </li>
              </ul>
              
              <div className="mt-5 pt-5 border-t border-gray-200">
                <div className="flex items-start">
                  <InfoIcon className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    De richtprijs is exclusief BTW en geldt als indicatie. Een definitieve offerte wordt opgesteld na een vrijblijvend plaatsbezoek.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <Button 
              onClick={onStart} 
              className="text-white px-8 py-6 text-lg rounded-md shadow-md transition-all flex items-center gap-2 w-full sm:w-auto"
              size="lg"
            >
              <Calculator className="h-5 w-5 mr-1" />
              Start mijn configuratie
              <ArrowRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-gray-500 mt-3 text-sm">
              Je zit nergens aan vast – gewoon een gratis richtprijs
            </p>
          </div>
        </div>
      </Card>
      
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="p-6">
          <h3 className="font-semibold text-lg mb-4">Waarom klanten voor ons kiezen</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <h4 className="font-medium text-sm">Professionele plaatsing</h4>
              </div>
              <p className="text-sm text-gray-600">Door erkende vakmensen met jaren ervaring</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <h4 className="font-medium text-sm">Kwaliteitsmaterialen</h4>
              </div>
              <p className="text-sm text-gray-600">We werken enkel met hoogwaardige producten</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <h4 className="font-medium text-sm">Transparante prijzen</h4>
              </div>
              <p className="text-sm text-gray-600">Geen verborgen kosten, duidelijke offertes</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConfiguratorIntro;
