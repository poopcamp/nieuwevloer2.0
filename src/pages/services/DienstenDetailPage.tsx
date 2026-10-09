import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/seo/SEOHead";

const COPY = {
  vloeren: {
    heading: "Vloeren leggen",
    subtitle: "Keramische tegelvloeren en grootformaat, geplaatst vanuit Maldegem.",
    points: [
      "Keramische tegelvloeren voor woonkamer, keuken en hal",
      "Grootformaat met een strakke uitlijning",
      "Voorbereiding van de ondergrond en afwerking van de voegen",
    ],
  },
  terrassen: {
    heading: "Terrassen",
    subtitle: "Keramische terrastegels en platines van 2 cm, gelegd op een stabiele ondergrond.",
    points: [
      "Keramische terrastegels voor tuin en terras",
      "Platines van 2 cm op een stabiele ondergrond",
      "Afwatering en voegwerk afgestemd op buitengebruik",
    ],
  },
  badkamerrenovatie: {
    heading: "Badkamerrenovatie",
    subtitle: "Tegels, inloopdouche en afwerking door een vakman uit Maldegem.",
    points: [
      "Wand- en vloertegels in de badkamer",
      "Inloopdouche en waterdichte afwerking",
      "Plaatsing en afwerking in één opvolging",
    ],
  },
} as const;

export default function DienstenDetailPage() {
  const { pathname } = useLocation();
  const key = pathname.split("/").filter(Boolean).pop() as keyof typeof COPY;
  const copy = COPY[key] ?? COPY.vloeren;

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead />
      <Navbar />
      <main className="flex-grow pt-16 md:pt-20">
        <PageHeader title={copy.heading} subtitle={copy.subtitle} bgColor="bg-emerald-50" />
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <ul className="space-y-3 text-gray-700 mb-8">
            {copy.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p className="text-gray-800 mb-8">
            Bel{" "}
            <a href="tel:0479304986" className="font-semibold text-primary">
              0479 30 49 86
            </a>{" "}
            of stuur een bericht via het formulier of WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link to="/contact">Offerte aanvragen</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/diensten">Alle diensten</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
