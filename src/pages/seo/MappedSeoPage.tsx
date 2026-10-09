import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/seo/SEOHead";
import { seo } from "@/seo";

function visibleIntro(description: string) {
  if (/oprit/i.test(description)) {
    return "NieuweVloer is vloerder en tegelzetter in Maldegem. We leggen vloeren, renoveren badkamers en plaatsen keramische terrassen.";
  }
  return description;
}

export default function MappedSeoPage() {
  const { pathname } = useLocation();
  const resolved = seo.resolve(pathname);
  const heading = resolved.title.split("|")[0].trim();

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead />
      <Navbar />
      <main className="flex-grow bg-neutral-50">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{heading}</h1>
          <p className="text-lg text-gray-700 mb-6">{visibleIntro(resolved.description)}</p>
          <p className="text-gray-800 mb-8">
            Bel{" "}
            <a href="tel:0479304986" className="font-semibold text-primary">
              0479 30 49 86
            </a>{" "}
            of vraag een offerte aan via het formulier.
          </p>
          <Button asChild>
            <Link to="/contact">Offerte aanvragen</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
