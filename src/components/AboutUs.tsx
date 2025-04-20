
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Over NieuweVloer.be</h2>
            <p className="text-gray-700 mb-4">
              NieuweVloer.be is een initiatief van VDHN, een gevestigde speler in de bouwsector met jarenlange ervaring in vloer- en tegelwerken.
            </p>
            <p className="text-gray-700 mb-4">
              Ons doel is om jou te helpen bij het realiseren van jouw droomproject, 
              met transparante prijzen en professionele vakmannen die je van A tot Z begeleiden.
            </p>
            <p className="text-gray-700 mb-6">
              Als onderdeel van de VDHN-groep kunnen we rekenen op een uitgebreid netwerk van betrouwbare partners 
              en jarenlange ervaring in zowel residentiële als commerciële projecten.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link to="/contact">Contacteer ons</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://vdhn.be" target="_blank" rel="noopener noreferrer">
                  Bezoek VDHN.be
                </a>
              </Button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Waarom NieuweVloer.be?</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm mr-3">✓</span>
                <span>Transparante prijzen zonder verborgen kosten</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm mr-3">✓</span>
                <span>Professionele tegelzetters en vakmannen</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm mr-3">✓</span>
                <span>Onderdeel van de betrouwbare VDHN-groep</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm mr-3">✓</span>
                <span>Persoonlijke begeleiding van offerte tot oplevering</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm mr-3">✓</span>
                <span>Jarenlange ervaring in vloer- en tegelwerken</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
