
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import SEOHead from "@/components/seo/SEOHead";
import TegelwerkenGids from "@/components/guides/TegelwerkenGids";

const GuidesPage = () => {
  return (
    <>
      <SEOHead />

      <Navbar />
      
      <main className="pt-16 md:pt-20">
        <PageHeader 
          title="Gids voor Tegelwerk" 
          subtitle="Alles wat u moet weten over tegelplaatsing, materialen en technieken"
          bgColor="bg-blue-50"
        />
        
        <div className="container mx-auto px-4 py-12">
          <TegelwerkenGids />
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default GuidesPage;
