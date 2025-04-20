
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const TilesShowcase: React.FC = () => {
  const tileCategories = [
    {
      title: "Vloertegels",
      description: "Van keramische tegels tot natuursteen voor elke ruimte",
      image: "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/tiles/floor-tiles.jpg",
      link: "/configurator?projectType=floor",
      ctaText: "Vloertegels plaatsen"
    },
    {
      title: "Badkamertegels",
      description: "Waterdichte en stijlvolle oplossingen voor uw badkamer",
      image: "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/tiles/bathroom-tiles.jpg",
      link: "/configurator?projectType=bathroom",
      ctaText: "Badkamertegels plaatsen"
    },
    {
      title: "Wandtegels",
      description: "Van keukenwand tot inloopdouche, perfecte afwerking",
      image: "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/tiles/wall-tiles.jpg",
      link: "/configurator?projectType=kitchenWall",
      ctaText: "Wandtegels plaatsen"
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full opacity-30 blur-3xl -translate-x-24 -translate-y-24"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ontdek onze tegelprojecten</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We plaatsen verschillende soorten tegels voor elk type ruimte. Bekijk onze meest gevraagde projecten.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {tileCategories.map((category, index) => (
            <Card key={index} className="overflow-hidden border-0 shadow-lg">
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img 
                  src={category.image} 
                  alt={category.title} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/placeholder-tile.jpg";
                  }}
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-6">{category.description}</p>
                <Button asChild variant="outline" className="w-full min-h-11 group border-primary-200 hover:border-primary-300 hover:bg-primary-50">
                  <Link to={category.link} className="flex items-center justify-center">
                    {category.ctaText}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TilesShowcase;
