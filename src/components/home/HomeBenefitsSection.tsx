
import React from "react";
import { Shield, Clock, Calculator, Sparkles } from "lucide-react";

const HomeBenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: <Calculator className="h-10 w-10 text-white" />,
      title: "Eenvoudige prijsberekening",
      description: "Krijg online een nauwkeurige richtprijs zonder verplichtingen"
    },
    {
      icon: <Clock className="h-10 w-10 text-white" />,
      title: "Snelle reactietijd",
      description: "Binnen 24 uur reactie op aanvragen en vrijblijvend advies"
    },
    {
      icon: <Shield className="h-10 w-10 text-white" />,
      title: "Plaatsingsgarantie",
      description: "5 jaar garantie op al onze tegelwerkzaamheden"
    },
    {
      icon: <Sparkles className="h-10 w-10 text-white" />,
      title: "Ervaren vakmensen",
      description: "Gediplomeerde tegelzetters met jarenlange ervaring"
    }
  ];

  return (
    <section className="py-10 md:py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="relative p-6 rounded-xl group hover:bg-gradient-to-br from-primary-600 to-primary-800 text-primary-900 hover:text-white transition-all duration-300 flex flex-col items-center text-center border border-primary-100 hover:border-primary-600 shadow-sm hover:shadow-md"
            >
              <div className="p-3 rounded-full bg-primary-600 text-white mb-4 group-hover:bg-white group-hover:text-primary-600 transition-colors duration-300">
                {benefit.icon}
              </div>
              <h3 className="font-bold text-xl mb-2 group-hover:text-white transition-colors">{benefit.title}</h3>
              <p className="text-gray-600 group-hover:text-white/90 transition-colors">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeBenefitsSection;
