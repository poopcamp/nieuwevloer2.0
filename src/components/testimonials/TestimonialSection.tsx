
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Testimonial {
  id: number;
  location: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    location: "Eeklo",
    quote: "Zeer tevreden over de tegelplaatsing in onze badkamer. De afwerking is perfect en de service was uitstekend. Absoluut aan te raden!",
    rating: 5,
  },
  {
    id: 2,
    location: "Maldegem",
    quote: "De renovatie van onze keuken is fantastisch uitgevoerd. De tegels zijn precies zoals we hadden gehoopt en alles werd binnen de afgesproken termijn opgeleverd.",
    rating: 5,
  },
  {
    id: 3,
    location: "Brugge",
    quote: "Professionele tegelzetters die weten waarover ze praten. De configurator online hielp ons enorm bij het maken van de juiste keuze.",
    rating: 4,
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Wat onze klanten zeggen</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ontdek waarom klanten kiezen voor onze tegelzetdiensten en hoe wij hun verwachtingen hebben overtroffen.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4 flex-grow">
                  "{testimonial.quote}"
                </blockquote>
                <div className="mt-auto">
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
