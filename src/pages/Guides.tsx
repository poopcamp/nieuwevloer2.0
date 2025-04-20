
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TegelwerkenGids from "@/components/guides/TegelwerkenGids";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const Guides = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Gratis Gidsen voor Tegelwerken | NieuweTegels.be</title>
        <meta 
          name="description" 
          content="Download onze gratis gidsen voor vloerwerken en badkamerrenovaties. Praktische tips en checklists voor je tegelproject in de regio Maldegem, Eeklo, Knokke en omgeving." 
        />
        <meta 
          name="keywords" 
          content="tegelgids,vloergids,tegelwerk,badkamerrenovatie,checklists,tips tegel,Maldegem,Eeklo,Knokke" 
        />
        <link rel="canonical" href="https://nieuwetegels.be/gidsen" />
      </Helmet>
      
      <Navbar />
      <main className="flex-grow py-12 mt-16 md:mt-20"> {/* Added margin-top to account for fixed navbar */}
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <Button asChild variant="outline" size="sm" className="flex items-center gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                <span>Terug naar homepage</span>
              </Link>
            </Button>
            <Button asChild size="sm" className="flex items-center gap-2">
              <Link to="/configurator">
                Start Configurator
              </Link>
            </Button>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Gratis Gidsen</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Download onze gratis gidsen voor vloerwerken en badkamerrenovaties. 
              Boordevol praktische tips en handige checklists.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <TegelwerkenGids />
            
            <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md bg-white">
              <h2 className="text-xl font-bold mb-4">Badkamer Renovatie Gids</h2>
              <p className="text-gray-700 mb-6">
                Binnenkort beschikbaar: Onze complete gids voor badkamerrenovaties met planning, budgettering en materiaaladvies.
              </p>
              
              <div className="bg-gray-100 p-4 rounded-md text-center">
                <p className="text-sm text-gray-600">
                  Deze gids is momenteel in ontwikkeling.
                  Laat je e-mail achter bij interesse en we sturen je een bericht zodra deze beschikbaar is.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Guides;
