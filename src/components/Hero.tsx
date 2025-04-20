
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroImage {
  id: string;
  url: string;
  alt_text: string;
}

const Hero = () => {
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Fetch hero image from Supabase
    const fetchHeroImage = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_images')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching hero image:", error);
        }

        if (data) {
          setHeroImage(data);
          
          // Preload the image
          const img = new Image();
          img.src = data.url;
          img.onload = () => setImageLoaded(true);
        } else {
          // Fallback to default image
          setImageLoaded(true);
        }
      } catch (error) {
        console.error("Failed to fetch hero image:", error);
        setImageLoaded(true);
      }
    };

    fetchHeroImage();
    
    // Trigger animations after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Get the image URL (either from database or fallback)
  const getImageUrl = () => {
    if (heroImage && heroImage.url) {
      return heroImage.url;
    }
    return 'https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets//Hero-background.png';
  };

  return (
    <div className="relative overflow-hidden min-h-[600px] md:min-h-[650px] flex items-center">
      {/* Hero background with dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      {/* Background image */}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: `url('${getImageUrl()}')`, 
          backgroundPosition: "center center",
          backgroundSize: "cover",
          opacity: imageLoaded ? 1 : 0.8,
          transition: "opacity 0.5s ease-in-out"
        }}
        aria-label={heroImage?.alt_text || "Hero achtergrond"}
        role="img"
      />
      
      {/* Decorative elements */}
      <div className="absolute z-10 top-20 left-10 md:left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl" aria-hidden="true"></div>
      <div className="absolute z-10 bottom-20 right-10 md:right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" aria-hidden="true"></div>
      
      <div className="container relative z-20 mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div 
          className={`mx-auto max-w-3xl text-center transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-sm">
            Uw droomvloer tot leven gebracht
          </h1>
          <p className="mb-8 text-lg text-white/90 md:text-xl max-w-2xl mx-auto leading-relaxed">
            Hoogwaardige tegelplaatsing op maat van uw wensen. 
            Professioneel, stipt en met een persoonlijke aanpak.
          </p>
          
          <div className="flex flex-col w-full space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <Button 
              asChild
              size={isMobile ? "default" : "lg"} 
              className="bg-primary hover:bg-primary-600 text-white font-semibold group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full sm:w-auto"
            >
              <Link to="/configurator" className="flex items-center justify-center">
                <span className="whitespace-nowrap">Bereken uw project</span>
                <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size={isMobile ? "default" : "lg"}
              className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full sm:w-auto"
            >
              <Link to="/services" className="whitespace-nowrap">Ontdek onze diensten</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Wave svg for transition */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="white" aria-hidden="true">
          <path fillOpacity="1" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z" />
        </svg>
      </div>
    </div>
  );
};

export default Hero;
