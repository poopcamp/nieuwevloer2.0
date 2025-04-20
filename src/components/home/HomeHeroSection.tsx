
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HomeHeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full opacity-40 blur-3xl -translate-x-24 -translate-y-24"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-100 rounded-full opacity-30 blur-3xl translate-x-24 translate-y-24"></div>
      
      <div className="container mx-auto px-4 py-20 md:py-28 lg:py-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-6 items-center">
          <div className="text-center md:text-left">
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4 shadow-sm">
              Professionele tegelplaatsing in Maldegem en omstreken
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
              Uw nieuwe <span className="text-primary">vloer</span>, perfect geplaatst
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
              Van vloeren en badkamers tot keukenwanden - onze ervaren tegelzetters zorgen voor een hoogwaardige 
              afwerking die jaren meegaat.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="min-h-11 px-8 text-base">
                <Link to="/configurator" className="flex items-center">
                  Bereken uw project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="min-h-11 px-8 text-base border-primary-200 hover:border-primary-300 hover:bg-primary-50">
                <Link to="/contact">
                  Neem contact op
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="mt-8 md:mt-0 relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src="https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/hero-image.jpg"
                alt="Professionele tegelplaatsing"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/placeholder-tile.jpg";
                }}
              />
              
              {/* Floating accolade */}
              <div className="absolute -bottom-4 -right-4 bg-white py-2 px-4 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
                <svg className="text-yellow-500 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19 10 15.27z" clipRule="evenodd" />
                </svg>
                <span>4.9/5 Klanttevredenheid</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;
