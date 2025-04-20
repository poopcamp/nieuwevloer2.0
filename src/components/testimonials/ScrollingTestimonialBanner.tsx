
import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for testimonials
const testimonials = [
  {
    id: 1,
    name: "Sofie D.",
    location: "Eeklo",
    content: "Onze badkamer is volledig getransformeerd! Zeer tevreden over de netheid en stiptheid van de werken. Echt een aanrader!",
  },
  {
    id: 2,
    name: "Marc V.",
    location: "Maldegem",
    content: "De tegelplaatsing in onze keuken werd perfect uitgevoerd. De vloerder was zeer nauwkeurig en gaf goed advies. Topservice!",
  },
  {
    id: 3,
    name: "Julie en Tom",
    location: "Knokke",
    content: "Zeer professionele aanpak van begin tot eind. Goede communicatie, stipt en kwalitatief hoogstaand werk. Onze nieuwe tegelvloer is prachtig!",
  },
  {
    id: 4,
    name: "Bart L.",
    location: "Brugge",
    content: "Na een slechte ervaring met een andere tegelzetter waren we wat terughoudend, maar wat een verschil! Deze mensen weten wat ze doen.",
  },
  {
    id: 5,
    name: "Caroline D.",
    location: "Aalter",
    content: "De tegels in onze inkomhal zijn van topkwaliteit en perfect geplaatst. De plaatsers werkten snel maar zeer precies.",
  },
  {
    id: 6, 
    name: "Peter en Ingrid",
    location: "Damme",
    content: "Perfecte samenwerking voor de renovatie van onze badkamer. Alles netjes afgewerkt zonder verrassingen. We zijn superblij met het resultaat!",
  }
];

const ScrollingTestimonialBanner = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-primary-50 to-primary-100 will-change-transform">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Wat onze klanten zeggen</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Honderden tevreden klanten in de regio vertrouwen op onze expertiese en vakmanschap
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <ScrollArea className="w-full overflow-hidden">
            <div className="flex gap-4 pb-4 px-1">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="flex-shrink-0 w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.33%-12px)] shadow-md hover:shadow-lg transition-shadow bg-white rounded-lg">
                  <div className="p-6 h-full flex flex-col">
                    <blockquote className="text-gray-700 italic mb-4">"{testimonial.content}"</blockquote>
                    <footer className="flex items-center justify-between mt-auto">
                      <div>
                        <div className="font-medium text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-primary-600">{testimonial.location}</div>
                      </div>
                      <div className="flex text-yellow-400" aria-label="5 sterren beoordeling">
                        {'★★★★★'}
                      </div>
                    </footer>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="text-center mt-10">
          <Button asChild size="lg" className="min-h-11 px-8 text-base">
            <Link to="/contact" className="flex items-center">
              Plan een plaatsbezoek
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ScrollingTestimonialBanner;
