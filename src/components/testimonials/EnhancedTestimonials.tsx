
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { 
  AutoScrollingCarousel,
  AutoScrollingCarouselContent,
  AutoScrollingCarouselItem
} from "@/components/ui/auto-scrolling-carousel";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: number;
  location: string;
  quote: string;
  rating: number;
  name?: string;
  project?: string;
}

// Extended testimonial list for more variety
const allTestimonials: Testimonial[] = [
  {
    id: 1,
    location: "Eeklo",
    quote: "Zeer tevreden over de tegelplaatsing in onze badkamer. De afwerking is perfect en de service was uitstekend. Absoluut aan te raden!",
    rating: 5,
    name: "Thomas D.",
    project: "Badkamer renovatie"
  },
  {
    id: 2,
    location: "Maldegem",
    quote: "De renovatie van onze keuken is fantastisch uitgevoerd. De tegels zijn precies zoals we hadden gehoopt en alles werd binnen de afgesproken termijn opgeleverd.",
    rating: 5,
    name: "Laura V.",
    project: "Keuken renovatie"
  },
  {
    id: 3,
    location: "Brugge",
    quote: "Professionele tegelzetters die weten waarover ze praten. De configurator online hielp ons enorm bij het maken van de juiste keuze.",
    rating: 4,
    name: "Pieter M.",
    project: "Vloertegelwerk"
  },
  {
    id: 4,
    location: "Gent",
    quote: "Snelle en correcte service. De tegelplaatsers wisten precies wat ze deden en werkten zeer netjes. Geen enkele klacht!",
    rating: 5,
    name: "Sophie K.",
    project: "Badkamer renovatie"
  },
  {
    id: 5,
    location: "Aalter",
    quote: "Aangenaam verrast door de kwaliteit van het werk. Onze nieuwe vloer ziet er prachtig uit en werd perfect afgewerkt.",
    rating: 5,
    name: "Marc D.",
    project: "Vloertegelwerk"
  },
  {
    id: 6,
    location: "Knokke",
    quote: "Eerst wat twijfels, maar na het plaatsbezoek voelde ik me direct op mijn gemak. Het resultaat is fantastisch!",
    rating: 4,
    name: "Johan V.",
    project: "Tegelplaatsing"
  },
  {
    id: 7,
    location: "Antwerpen",
    quote: "De badkamertegels zijn perfect geplaatst en de service was uitstekend. Alles werd netjes opgeruimd en we zijn heel tevreden met het resultaat.",
    rating: 5,
    name: "Elise B.",
    project: "Badkamer renovatie"
  },
  {
    id: 8,
    location: "Zelzate",
    quote: "Vlotte communicatie, duidelijke prijsopgave en perfecte oplevering. Meer moet dat niet zijn!",
    rating: 5,
    name: "Karel L.",
    project: "Wandtegelwerk"
  }
];

const EnhancedTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  // Shuffle testimonials on mount for randomization
  useEffect(() => {
    const shuffled = [...allTestimonials].sort(() => Math.random() - 0.5);
    setTestimonials(shuffled);
  }, []);
  
  if (!testimonials.length) return null;

  // Badges data
  const badges = [
    { text: "Uitstekende service", count: "94%" },
    { text: "Op tijd opgeleverd", count: "98%" },
    { text: "Binnen budget", count: "97%" },
    { text: "Zou aanbevelen", count: "95%" },
  ];
  
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-700">4.9/5 gemiddelde beoordeling</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Wat onze klanten zeggen</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Onze klanten waarderen onze persoonlijke aanpak en kwaliteitsvolle afwerking
          </p>

          {/* Badges row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
            {badges.map((badge, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <p className="text-2xl font-bold text-primary">{badge.count}</p>
                <p className="text-sm text-gray-600">{badge.text}</p>
              </div>
            ))}
          </div>
        </div>
        
        <AutoScrollingCarousel 
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
          }}
          autoplaySpeed={4000}
          className="w-full"
        >
          <AutoScrollingCarouselContent className="-ml-4">
            {testimonials.map((testimonial) => (
              <AutoScrollingCarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full bg-white border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={cn(
                              i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
                              "transition-transform hover:scale-110 duration-200"
                            )}
                          />
                        ))}
                      </div>
                      <Quote size={24} className="text-primary-200 opacity-40" />
                    </div>
                    
                    <blockquote className="text-gray-700 mb-4 flex-grow italic">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{testimonial.name || "Tevreden klant"}</p>
                          <p className="text-sm text-gray-500">{testimonial.location}</p>
                        </div>
                        {testimonial.project && (
                          <span className="inline-block bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded">
                            {testimonial.project}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AutoScrollingCarouselItem>
            ))}
          </AutoScrollingCarouselContent>
        </AutoScrollingCarousel>
      </div>
    </section>
  );
};

export default EnhancedTestimonials;
