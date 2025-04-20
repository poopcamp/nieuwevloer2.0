
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="bg-primary py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Klaar om uw tegels te laten plaatsen?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Gebruik onze tegelconfigurator voor een prijsindicatie of neem direct contact met ons op voor een persoonlijk advies.
          </p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Button 
              asChild
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Link to="/configurator">Naar de configurator</Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              <Link to="/contact">Neem contact op</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
