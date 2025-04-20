
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-primary-700 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-400 rounded-full opacity-10 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Klaar om uw tegelproject te starten?
          </h2>
          <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Bereken een eerlijke richtprijs en ontdek hoe wij uw tegelproject tot een succes kunnen maken.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="min-h-12 px-8 text-base">
              <Link to="/configurator" className="flex items-center">
                Bereken uw project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 min-h-12 px-8 text-base">
              <Link to="/contact">
                Neem direct contact op
              </Link>
            </Button>
          </div>
          
          <p className="text-primary-200 mt-8 text-sm">
            Vrijblijvende richtprijs. Definitieve offerte na plaatsbezoek.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
