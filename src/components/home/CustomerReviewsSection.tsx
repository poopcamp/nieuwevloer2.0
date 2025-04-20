
import React from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ReviewProps {
  name: string;
  location: string;
  date: string;
  rating: number;
  text: string;
  image?: string;
}

const CustomerReviewsSection: React.FC = () => {
  const reviews: ReviewProps[] = [
    {
      name: "Jan Vandenberghe",
      location: "Maldegem",
      date: "15 maart 2024",
      rating: 5,
      text: "Zeer tevreden van het geleverde werk. De tegelzetter was stipt, werkte zeer nauwkeurig en liet alles netjes achter. Zeker een aanrader!",
      image: "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/reviews/review-bathroom-1.jpg"
    },
    {
      name: "Marie Peeters",
      location: "Eeklo",
      date: "3 februari 2024",
      rating: 5,
      text: "De volledige badkamerrenovatie is vlot verlopen. Correcte prijsofferte en kwaliteitsvol werk. Een vakman die weet waarover hij spreekt en prima advies geeft.",
      image: "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/reviews/review-kitchen-1.jpg"
    },
    {
      name: "Thomas De Smet",
      location: "Knokke",
      date: "22 januari 2024",
      rating: 4,
      text: "Goede service en snelle uitvoering. De online berekening was handig om een eerste inschatting te krijgen. Kleine vertraging tijdens de werken, maar uitstekend eindresultaat.",
      image: "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/reviews/review-floor-1.jpg"
    }
  ];

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} 
      />
    ));
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-primary-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4 shadow-sm">
            Wat onze klanten zeggen
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ervaringen van tevreden klanten</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Onze klanten zijn onze beste ambassadeurs. Ontdek wat zij vinden van onze dienstverlening en het geleverde tegelwerk.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review, index) => (
            <Card key={index} className="border-0 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-6">
                {review.image && (
                  <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={review.image} 
                      alt={`Project van ${review.name}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                )}
                
                <div className="flex items-center mb-4">
                  {renderStars(review.rating)}
                </div>
                
                <p className="text-gray-700 mb-6 line-clamp-4">"{review.text}"</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.location}</p>
                  </div>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <p className="text-gray-500">
            Bekijk meer beoordelingen op{" "}
            <a 
              href="https://www.google.com/search?q=nieuwevloer.be+reviews" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-700 hover:text-primary-800 font-medium hover:underline"
            >
              Google Reviews
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewsSection;
