
import React from "react";
import { Clipboard, Calendar, Wrench, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const ApproachSection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden mt-16 sm:mt-24 lg:mt-28">
      {/* Decorative background elements */}
      <div className="absolute top-40 -left-32 w-80 h-80 bg-primary-50 rounded-full opacity-40 blur-3xl"></div>
      <div className="absolute -bottom-40 right-0 w-96 h-96 bg-primary-50 rounded-full opacity-30 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-block px-4 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-3">Onze werkwijze</span>
          <h2 className="text-3xl font-bold text-gray-900">Uw tegelproject in 3 eenvoudige stappen</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We houden het eenvoudig en transparant, zodat u altijd weet wat u kunt verwachten
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-24 left-1/2 transform -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-primary-100 via-primary to-primary-100 z-0"></div>
          
          {/* Step 1 */}
          <div className="relative p-6 md:p-8 rounded-xl bg-white border border-gray-100 shadow-md hover:shadow-lg transition-all duration-500 flex flex-col items-center text-center group hover:-translate-y-2">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-50 text-primary mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary-100">
              <Clipboard className="w-8 h-8" />
            </div>
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">Online berekening</h3>
            <p className="text-gray-600">
              Gebruik onze eenvoudige online configurator voor een snelle prijsindicatie, afgestemd op uw specifieke project
            </p>
            <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-sm text-primary font-medium">Helder en transparant</span>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="relative p-6 md:p-8 rounded-xl bg-white border border-gray-100 shadow-md hover:shadow-lg transition-all duration-500 flex flex-col items-center text-center group hover:-translate-y-2 md:mt-8">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-50 text-primary mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary-100">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">Vrijblijvend plaatsbezoek</h3>
            <p className="text-gray-600">
              We komen langs op een moment dat u past, bekijken uw project en stellen een gedetailleerde offerte op
            </p>
            <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-sm text-primary font-medium">Persoonlijk advies</span>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="relative p-6 md:p-8 rounded-xl bg-white border border-gray-100 shadow-md hover:shadow-lg transition-all duration-500 flex flex-col items-center text-center group hover:-translate-y-2">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-50 text-primary mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary-100">
              <Wrench className="w-8 h-8" />
            </div>
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">Vakkundige uitvoering</h3>
            <p className="text-gray-600">
              Onze ervaren tegelzetters zorgen voor een perfecte afwerking volgens de hoogste kwaliteitsnormen
            </p>
            <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-sm text-primary font-medium">Topkwaliteit gegarandeerd</span>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button asChild size="lg" className="min-h-11 px-8 text-base">
            <Link to="/contact" className="flex items-center">
              Bekijk onze aanpak
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ApproachSection;
