
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 bg-neutral-50">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <p className="text-2xl font-semibold text-gray-900 mb-6">Pagina niet gevonden</p>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
            De pagina die u probeert te bezoeken bestaat niet of is verplaatst.
          </p>
          <Button asChild className="bg-primary hover:bg-primary-600">
            <Link to="/">Terug naar de homepagina</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
