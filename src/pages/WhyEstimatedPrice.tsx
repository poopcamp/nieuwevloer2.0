
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Layers, Grid, Ruler, Scissors, MapPin } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const WhyEstimatedPrice = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Waarom Richtprijs | NieuweVloer.be</title>
        <meta name="description" content="Ontdek waarom we met richtprijzen werken in plaats van vaste prijzen voor tegelprojecten. Elke situatie is uniek en vraagt om een persoonlijke benadering." />
        <meta name="keywords" content="richtprijs,offerte tegels,tegelprijs,prijsindicatie,tegelzetter" />
        <link rel="canonical" href="https://nieuwevloer.be/waarom-richtprijs" />
      </Helmet>
      
      <Navbar />
      
      <PageHeader 
        title="Waarom we werken met een richtprijs (en geen vaste prijs)"
        subtitle="Ontdek waarom we bij NieuweVloer.be kiezen voor realistische richtprijzen in plaats van online vaste prijzen"
      />
      
      <main className="flex-grow py-6 md:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-slate mb-8">
              <p className="text-lg text-gray-700">
                Bij NieuweVloer.be krijg je een realistische richtprijs voor het leggen van tegels, gebaseerd op jouw gekozen oppervlaktes, afwerking en projecttype.
                Toch geven we bewust geen vaste prijs online, en hieronder leggen we uit waarom.
              </p>
            </div>
            
            <div className="space-y-8 mb-12">
              {/* Section 1 */}
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-50 rounded-lg">
                      <Layers className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-xl text-gray-900 mb-2">1. De ondergrond bepaalt het halve werk</h2>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Is je vloer vlak of moet er eerst geëgaliseerd worden?</li>
                        <li>• Ligt er nog een oude tegel op? → dan gebruiken we een andere primer.</li>
                        <li>• Is de ondergrond los, vuil of onstabiel? Dan zijn extra voorbereidingen nodig.</li>
                        <li>• Soms is een nieuwe chape vereist.</li>
                      </ul>
                      <p className="mt-3 font-medium text-gray-800">
                        De staat van de ondergrond bepaalt hoe we moeten werken — en dus ook de prijs.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Section 2 */}
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-50 rounded-lg">
                      <Grid className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-xl text-gray-900 mb-2">2. Tegel-op-tegel verandert alles</h2>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Speciale primers nodig voor hechting op bestaande tegels.</li>
                        <li>• De vloerhoogte stijgt → deuren of dorpels kunnen problemen geven.</li>
                        <li>• Egalisatie of overgangsprofielen kunnen vereist zijn.</li>
                      </ul>
                      <p className="mt-3 font-medium text-gray-800">
                        Tegel op tegel is mogelijk, maar vraagt een andere aanpak en beïnvloedt de prijs voor het legwerk.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Section 3 */}
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-50 rounded-lg">
                      <Ruler className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-xl text-gray-900 mb-2">3. Muren lijken vlak, maar zijn dat vaak niet</h2>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Vooral bij badkamerrenovaties blijkt dat muren niet haaks of vlak zijn.</li>
                        <li>• Bollingen of holtes zorgen voor moeilijkheden bij wandbetegeling.</li>
                        <li>• Soms is uitvlakken nodig voor een strak resultaat.</li>
                      </ul>
                      <p className="mt-3 font-medium text-gray-800">
                        Wat mooi lijkt op foto, kan technisch problematisch zijn — dat zien we pas ter plaatse.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Section 4 */}
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-50 rounded-lg">
                      <Grid className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-xl text-gray-900 mb-2">4. Je gekozen tegel beïnvloedt het werk</h2>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Grote tegels vereisen dubbele verlijming (buttering-floating).</li>
                        <li>• Visgraat of diagonaal legverband vraagt meer tijd en snijwerk.</li>
                        <li>• Harde of dikke tegels zijn moeilijker te verwerken.</li>
                      </ul>
                      <p className="mt-3 font-medium text-gray-800">
                        Niet elke tegel wordt op dezelfde manier geplaatst — jouw keuze bepaalt de werklast.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Section 5 */}
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-50 rounded-lg">
                      <Scissors className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-xl text-gray-900 mb-2">5. Snijverlies & ruimte-indeling maken het verschil</h2>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Veel hoeken, inkepingen of obstakels → meer snijverlies.</li>
                        <li>• Meer snijden = meer tijd, meer afval en meer precisie.</li>
                        <li>• We rekenen standaard 10% verlies, maar dit kan oplopen bij complexe ruimtes.</li>
                      </ul>
                      <p className="mt-3 font-medium text-gray-800">
                        De vorm van je ruimte beïnvloedt hoeveel tijd en materiaal nodig is voor het leggen.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-primary-50 rounded-lg p-6 mb-8">
              <h2 className="font-bold text-xl text-gray-900 mb-3">Richtprijs = 90% van het werk</h2>
              <p className="text-gray-700 mb-2">
                Onze calculator geeft een richtprijs die meestal zeer dicht in de buurt komt van de uiteindelijke prijs.
                We gebruiken realistische gemiddelden op basis van ervaring, maar elk huis is anders.
              </p>
              <p className="text-gray-700 font-medium">
                Daarom plannen we graag een plaatsbezoek in, zodat alles perfect klopt.
              </p>
            </div>
            
            <div className="mb-8">
              <Card className="shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-50 rounded-lg">
                      <MapPin className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-xl text-gray-900 mb-2">Wat gebeurt er tijdens een plaatsbezoek?</h2>
                      <ul className="space-y-2 text-gray-700">
                        <li>• We beoordelen de ondergrond en vlakheid van de muren.</li>
                        <li>• We controleren overgangsniveaus zoals deuren en plinten.</li>
                        <li>• We bekijken of je gekozen tegels technisch haalbaar zijn.</li>
                        <li>• Je krijgt persoonlijk advies over de aanpak en mogelijke optimalisaties.</li>
                      </ul>
                      <p className="mt-3 font-medium text-gray-800">
                        Een kort bezoek voorkomt verrassingen — voor jou én voor ons.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="sticky bottom-4 z-10 bg-white shadow-lg rounded-lg p-4 border border-gray-200">
              <Button asChild size="lg" className="w-full gap-2">
                <a href="/contact">
                  <Calendar className="h-5 w-5" />
                  <span>Vraag een plaatsbezoek aan</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WhyEstimatedPrice;
