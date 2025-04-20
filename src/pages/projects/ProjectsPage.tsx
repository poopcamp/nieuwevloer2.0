
import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

const ProjectsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Projecten | NieuweVloer.be</title>
        <meta 
          name="description" 
          content="Bekijk onze recente tegelprojecten en badkamerrenovaties. Professionele tegelwerken uitgevoerd door ervaren vakmensen."
        />
        <meta 
          name="keywords" 
          content="tegelprojecten, badkamerrenovaties, tegelwerken portfolio, renovatieprojecten"
        />
      </Helmet>

      <Navbar />
      
      <main className="pt-16 md:pt-20">
        <PageHeader 
          title="Onze Projecten" 
          subtitle="Ontdek onze recente tegelwerken en renovatieprojecten"
          bgColor="bg-teal-50"
        />
        
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="col-span-full text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Binnenkort beschikbaar</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                We werken momenteel aan het samenstellen van onze projectenportefeuille. 
                Kom binnenkort terug om onze gerealiseerde tegelprojecten te bekijken.
              </p>
              <Button asChild>
                <a href="/contact">Contacteer ons voor meer informatie</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ProjectsPage;
