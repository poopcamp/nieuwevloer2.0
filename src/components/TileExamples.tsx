
import { useTileExamples } from "./tile-examples/hooks/useTileExamples";
import SectionHeader from "./tile-examples/SectionHeader";
import MobileCarousel from "./tile-examples/MobileCarousel";
import DesktopGrid from "./tile-examples/DesktopGrid";

const TileExamples = () => {
  const { examples, loading } = useTileExamples();
  
  return (
    <div className="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden will-change-transform">
      {/* Decoratieve achtergrondelementen */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-50 rounded-full opacity-50 blur-3xl" aria-hidden="true"></div>
      <div className="absolute top-20 -right-20 w-80 h-80 bg-primary-50 rounded-full opacity-40 blur-3xl" aria-hidden="true"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeader 
          title="Ontdek onze populaire tegelcombinaties" 
          subtitle="Laat u inspireren door onze selectie kwaliteitstegels. Elk met hun eigen unieke karakter en sfeer voor uw droomruimte."
        />
        
        {/* Mobiele weergave: volledige breedte carousel */}
        <MobileCarousel examples={examples} />
        
        {/* Desktop weergave: grid layout */}
        <DesktopGrid examples={examples} />
      </div>
    </div>
  );
};

export default TileExamples;
