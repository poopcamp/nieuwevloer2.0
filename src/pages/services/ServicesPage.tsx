
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Wrench, Award } from "lucide-react";
import { Link } from "react-router-dom";

const ServicesPage = () => {
  const services = [
    {
      title: "Vloertegels Plaatsen",
      description: "Professionele plaatsing van vloertegels in verschillende formaten en patronen, met aandacht voor duurzaamheid en afwerking.",
      icon: <img src="/public/lovable-uploads/5b1a9d0d-5d51-4f89-8340-61bbe5289c3a.png" alt="Vloertegels" className="w-16 h-16 object-cover rounded-md" />,
      benefits: ["Perfecte uitlijning", "Strakke voegen", "Lange levensduur", "Professionele afwerking"]
    },
    {
      title: "Badkamerrenovatie",
      description: "Complete badkamer renovaties inclusief tegelwerk, sanitair en waterdichte afwerking voor een moderne en functionele badkamer.",
      icon: <img src="/public/lovable-uploads/f5249df2-48e0-4799-b97d-b13fae5a0487.png" alt="Badkamer" className="w-16 h-16 object-cover rounded-md" />,
      benefits: ["Waterbestendig", "Modern design", "Perfecte afwerking", "Sanitair coördinatie"]
    },
    {
      title: "Wandtegels Plaatsen",
      description: "Plaatsing van wandtegels in keukens, badkamers en andere ruimtes met aandacht voor detail en patroon.",
      icon: <Wrench className="w-12 h-12 text-primary" />,
      benefits: ["Strakke afwerking", "Diverse patronen", "Waterdichte voegen", "Duurzame hechting"]
    },
    {
      title: "Natuursteen Verwerking",
      description: "Specialistische plaatsing en afwerking van natuursteen vloeren en wandbekleding met respect voor het materiaal.",
      icon: <Award className="w-12 h-12 text-primary" />,
      benefits: ["Materiaalkennis", "Zorgvuldige verwerking", "Beschermende behandeling", "Duurzaam resultaat"]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Onze Diensten | NieuweVloer.be</title>
        <meta name="description" content="Ontdek ons volledige aanbod aan professionele tegelplaatsing, badkamerrenovatie en vloerwerken diensten met 6 jaar garantie." />
        <meta name="keywords" content="tegelplaatsing, vloerwerken, badkamerrenovatie, natuursteen, vloertegels, wandtegels" />
      </Helmet>

      <Navbar />
      
      <main className="pt-16 md:pt-20">
        <PageHeader 
          title="Onze Diensten" 
          subtitle="Professionele tegelplaatsing en renovatie met 6 jaar garantie"
          bgColor="bg-emerald-50"
        />
        
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  {service.icon}
                  <h2 className="text-2xl font-bold ml-4">{service.title}</h2>
                </div>
                <p className="text-gray-700 mb-6">{service.description}</p>
                <div className="mb-6">
                  <h3 className="font-semibold mb-2 text-gray-800">Voordelen:</h3>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto pt-4">
                  <Button asChild className="w-full">
                    <Link to="/configurator">
                      Prijsindicatie Berekenen
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Klaar om uw project te starten?</h2>
            <p className="mb-8 max-w-2xl mx-auto text-gray-700">
              Onze professionele tegelzetters staan klaar om uw project tot een perfect einde te brengen, met aandacht voor detail en kwaliteit.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/configurator">
                  Gratis Offerte Aanvragen
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">
                  Contact Opnemen
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default ServicesPage;
