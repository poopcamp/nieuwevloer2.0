import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Button } from "./ui/button";
import QuickConfiguratorDialog from "./quick-configurator/QuickConfiguratorDialog";
import MiniTileSelector from "./mini-tile-selector/MiniTileSelector";
import HomeFeatureShowcase from "./home/HomeFeatureShowcase";
import TrustedLogosSection from "./home/TrustedLogosSection";
import HomeHeroSection from "./home/HomeHeroSection";
import HomeBenefitsSection from "./home/HomeBenefitsSection";
import CustomerReviewsSection from "./home/CustomerReviewsSection";
import InspirationSection from "./home/inspiration/InspirationSection";
import TilesShowcase from "./home/TilesShowcase";
import CTASection from "./home/CTASection";
import { Calculator } from "lucide-react";

const Index: React.FC = () => {
  const { user, isAdmin } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <HomeHeroSection />
        
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Bereken direct uw richtprijs</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Krijg in enkele stappen een indicatie van de kosten voor uw tegelproject. Geen verplichtingen, geen wachttijd.
              </p>
            </div>
            
            <div className="flex justify-center mb-8">
              <QuickConfiguratorDialog trigger={
                <Button size="lg" className="text-base px-6 py-6">
                  <Calculator className="mr-2 h-5 w-5" />
                  Open prijsberekening
                </Button>
              }/>
            </div>
            
            <div className="text-center mt-8">
              <Link to="/configurator">
                <Button variant="outline" size="lg" className="mt-4">
                  Gedetailleerde berekening maken
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <HomeBenefitsSection />
        <TilesShowcase />
        <InspirationSection />
        <MiniTileSelector />
        <HomeFeatureShowcase />
        <CustomerReviewsSection />
        <CTASection />
        <TrustedLogosSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
