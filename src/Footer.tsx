
import React from "react";
import { Link } from "react-router-dom";
import Logo from "./components/Logo";
import ServiceAreaInfo from "./components/footer/ServiceAreaInfo";
import { FacebookIcon, InstagramIcon, MapPinIcon, PhoneIcon, MailIcon } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and intro */}
          <div className="md:col-span-1">
            <Logo className="h-8 w-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Professionele tegelplaatsing door vakkundige tegelzetters in de regio Maldegem en omstreken.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Volg ons op Facebook"
              >
                <FacebookIcon size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Volg ons op Instagram"
              >
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Snelle Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/configurator" className="text-gray-600 hover:text-primary transition-colors">Prijscalculator</Link>
              </li>
              <li>
                <Link to="/gidsen" className="text-gray-600 hover:text-primary transition-colors">Tegelgidsen</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Diensten */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Diensten</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/vloertegelplaatsing" className="text-gray-600 hover:text-primary transition-colors">Vloertegels</Link>
              </li>
              <li>
                <Link to="/wandtegelplaatsing" className="text-gray-600 hover:text-primary transition-colors">Wandtegels</Link>
              </li>
              <li>
                <Link to="/badkamerrenovatie" className="text-gray-600 hover:text-primary transition-colors">Badkamerrenovatie</Link>
              </li>
              <li>
                <Link to="/totale-badkamerrenovatie" className="text-gray-600 hover:text-primary transition-colors">Sanitair</Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon size={18} className="text-primary mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-600">Noordstraat 27, 9990 Maldegem</span>
              </li>
              <li className="flex items-center">
                <PhoneIcon size={18} className="text-primary mr-2 flex-shrink-0" />
                <a href="tel:+32499123456" className="text-gray-600 hover:text-primary transition-colors">+32 499 12 34 56</a>
              </li>
              <li className="flex items-center">
                <MailIcon size={18} className="text-primary mr-2 flex-shrink-0" />
                <a href="mailto:info@nieuwevloer.be" className="text-gray-600 hover:text-primary transition-colors">info@nieuwevloer.be</a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Service area information */}
        <ServiceAreaInfo />

        {/* Bottom footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © {currentYear} NieuweVloer.be — Alle rechten voorbehouden
          </p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-primary transition-colors">Privacybeleid</Link>
            <Link to="/gdpr-verzoek" className="text-sm text-gray-500 hover:text-primary transition-colors">GDPR Verzoek</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
