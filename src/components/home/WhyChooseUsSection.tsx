
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Medal, 
  Clock, 
  PiggyBank, 
  ShieldCheck, 
  UserCheck, 
  HeartHandshake,
  ArrowRight
} from "lucide-react";

const WhyChooseUsSection = () => {
  const benefits = [
    {
      icon: <Medal className="h-8 w-8 text-primary" />,
      title: "Vakmanschap",
      description: "Gedreven vakmensen met jarenlange ervaring en passie voor perfect tegelwerk"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Stiptheid",
      description: "We respecteren uw tijd: duidelijke planning, stipte start en oplevering binnen termijn"
    },
    {
      icon: <PiggyBank className="h-8 w-8 text-primary" />,
      title: "Eerlijke prijzen",
      description: "Transparante prijzen zonder verborgen kosten, met de beste prijs-kwaliteitverhouding"
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Kwaliteitsgarantie",
      description: "We staan achter ons werk met een solide garantie op alle tegelwerkzaamheden"
    },
    {
      icon: <UserCheck className="h-8 w-8 text-primary" />,
      title: "Persoonlijke begeleiding",
      description: "Van eerste gesprek tot laatste tegel: altijd een vast aanspreekpunt voor uw project"
    },
    {
      icon: <HeartHandshake className="h-8 w-8 text-primary" />,
      title: "Lokale service",
      description: "Actief in Maldegem en omstreken (30km) met kennis van lokale woonstijlen"
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-50/50 to-transparent"></div>
      <div className="absolute -bottom-28 -right-28 w-96 h-96 bg-primary-50 rounded-full opacity-30 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <span className="inline-block px-4 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-3">Daarom kiezen klanten voor ons</span>
          <h2 className="text-3xl font-bold text-gray-900">Wat ons onderscheidt</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Bij NieuweVloer.be maken we het verschil met onze persoonlijke aanpak en toewijding aan kwaliteit
          </p>
        </div>
        
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex gap-4 items-start group p-4 rounded-lg transition-all duration-300 hover:bg-primary-50 hover:scale-105 hover:shadow-md"
                >
                  <div className="p-3 rounded-lg bg-primary-100 text-primary-600 group-hover:bg-primary-200 transition-colors duration-300">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{benefit.title}</h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-10 md:mt-12 max-w-4xl mx-auto bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 shadow-md">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-primary-800 mb-2">Onze belofte aan u</h3>
            <p className="text-primary-700 mb-6">
              Wij zorgen niet alleen voor een prachtige nieuwe vloer, maar voor een zorgeloze ervaring van begin tot eind.
              Bij elk project streven we naar 100% klanttevredenheid.
            </p>
            <Button asChild size="lg" className="min-h-11 px-8 text-base">
              <Link to="/contact" className="flex items-center">
                Neem contact op
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
