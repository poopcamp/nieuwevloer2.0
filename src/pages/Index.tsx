
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CallToAction from "@/components/cta/CallToAction";
import Footer from "@/components/Footer";
import QuickConfigurator from "@/components/QuickConfigurator";
import AboutUs from "@/components/AboutUs";
import ApproachSection from "@/components/home/ApproachSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import ServiceSection from "@/components/ServiceSection";
import ScrollingTestimonialBanner from "@/components/testimonials/ScrollingTestimonialBanner";
import ProjectOfTheMonth from "@/components/home/ProjectOfTheMonth";
import MiniTileSelector from "@/components/mini-tile-selector/MiniTileSelector";
import TileExamples from "@/components/TileExamples";
import BlogPreviewSection from "@/components/home/BlogPreviewSection";
import InspirationCorner from "@/components/home/InspirationCorner";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useNavigate, useLocation } from "react-router-dom";

export default function Index() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to admin dashboard if user is admin and came from login
  useEffect(() => {
    if (!isLoading && user && isAdmin) {
      const from = location.state?.from?.pathname;
      const isFromLogin = location.pathname === "/" && from === "/admin/login";
      
      if (isFromLogin || location.state?.adminRedirect) {
        console.log("[Index] Admin user detected, redirecting to dashboard");
        setTimeout(() => {
          navigate("/admin/dashboard", { replace: true });
        }, 100);
      }
    }
  }, [user, isAdmin, isLoading, navigate, location]);

  return (
    <div className="overflow-hidden">
      <Helmet>
        <title>NieuweVloer.be | Professionele Tegelplaatsing op Maat</title>
        <meta name="description" content="Professioneel tegelzetten door ervaren vakmensen. Configureer uw project online en ontvang direct een richtprijs. Vakmanschap, stiptheid en kwaliteit gegarandeerd." />
        <meta name="keywords" content="tegelzetter,vloerder,tegelplaatsing,badkamerrenovatie,tegelwerken,Maldegem,Eeklo,Brugge,Knokke" />
        <link rel="canonical" href="https://nieuwevloer.be/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nieuwevloer.be/" />
        <meta property="og:title" content="NieuweVloer.be | Professionele Tegelplaatsing op Maat" />
        <meta property="og:description" content="Professioneel tegelzetten door ervaren vakmensen. Configureer uw project online en ontvang direct een richtprijs." />
        <meta property="og:image" content="https://nieuwevloer.be/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://nieuwevloer.be/" />
        <meta property="twitter:title" content="NieuweVloer.be | Professionele Tegelplaatsing op Maat" />
        <meta property="twitter:description" content="Professioneel tegelzetten door ervaren vakmensen. Configureer uw project online en ontvang direct een richtprijs." />
        <meta property="twitter:image" content="https://nieuwevloer.be/og-image.jpg" />
      </Helmet>

      <Navbar />
      <Hero />
      <QuickConfigurator />
      <div className="relative z-10 bg-gradient-to-b from-neutral-50 to-white py-0 md:py-2">
        <ApproachSection />
        <TileExamples />
        <ServiceSection />
        <ProjectOfTheMonth />
        <MiniTileSelector />
        <InspirationCorner />
        <WhyChooseUsSection />
        <BlogPreviewSection />
        <ScrollingTestimonialBanner />
        <AboutUs />
      </div>
      <CallToAction />
      <Footer />
    </div>
  );
};
