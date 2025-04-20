
import React from "react";

const TrustedLogosSection: React.FC = () => {
  // Sample logos - in a real implementation, these would be loaded from storage
  const logos = [
    {
      name: "Febelfin",
      url: "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/logos/logo-febelfin.svg",
    },
    {
      name: "Bouwunie",
      url: "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/logos/logo-bouwunie.svg",
    },
    {
      name: "WTCB",
      url: "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/logos/logo-wtcb.svg",
    },
    {
      name: "Confederatie Bouw",
      url: "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/logos/logo-confederatie-bouw.svg",
    },
    {
      name: "Vlaamse Overheid",
      url: "https://ssvgnlbzztxobvilucvk.supabase.co/storage/v1/object/public/assets/logos/logo-vlaamse-overheid.svg",
    }
  ];

  return (
    <section className="py-10 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm font-medium">
            Erkend door toonaangevende organisaties
          </p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((logo, index) => (
            <div key={index} className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
              <img
                src={logo.url}
                alt={`${logo.name} logo`}
                className="h-8 md:h-10 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedLogosSection;
