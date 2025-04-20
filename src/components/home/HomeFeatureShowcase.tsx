
import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HomeFeatureShowcase: React.FC = () => {
  const features = [
    "Professionele plaatsing volgens WTCB-normen",
    "Gegarandeerde waterdichtheid bij badkamers",
    "Nauwkeurige snijwerk en perfecte uitlijning",
    "Stofvrije werf met professionele apparatuur",
    "Bescherming van bestaande vloeren en ruimtes",
    "Grondige opkuis na werken"
  ];

  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Professioneel tegelwerk met garantie</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Bij NieuweVloer.be staat kwaliteit voorop. Onze ervaren tegelzetters werken nauwkeurig 
              en efficiënt, met een oog voor detail en een passie voor perfectie.
            </p>
            
            <div className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p className="ml-3 text-gray-700">{feature}</p>
                </div>
              ))}
            </div>
            
            <Button asChild size="lg" className="min-h-11 px-8 text-base">
              <Link to="/contact" className="flex items-center">
                Neem contact op
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/showcase-professional.jpg" 
                alt="Professionele tegelplaatsing" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/placeholder-tile.jpg";
                }}
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
              100%<br />Garantie
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFeatureShowcase;
