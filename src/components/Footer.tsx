
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">NieuweVloer.be</h3>
            <p className="text-sm text-gray-400">
              Professionele tegelzetdiensten voor uw huis, badkamer, keuken en meer.
              Wij zorgen voor een hoogwaardige afwerking met oog voor detail.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Diensten</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/vloertegelplaatsing" className="text-sm text-gray-400 hover:text-primary">
                  Vloertegels
                </Link>
              </li>
              <li>
                <Link to="/wandtegelplaatsing" className="text-sm text-gray-400 hover:text-primary">
                  Wandtegels
                </Link>
              </li>
              <li>
                <Link to="/badkamerrenovatie" className="text-sm text-gray-400 hover:text-primary">
                  Badkamer renovatie
                </Link>
              </li>
              <li>
                <Link to="/totale-badkamerrenovatie" className="text-sm text-gray-400 hover:text-primary">
                  Sanitair
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/configurator" className="text-sm text-gray-400 hover:text-primary">
                  Tegelconfigurator
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-primary">
                  Offerte aanvragen
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-400 hover:text-primary">
                  Privacy & Voorwaarden
                </Link>
              </li>
              <li>
                <Link to="/gdpr-verzoek" className="text-sm text-gray-400 hover:text-primary">
                  GDPR Verzoek
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin size={18} className="text-primary mt-0.5" />
                <span className="text-sm text-gray-400">Vakekerkweg 111 - Maldegem, België</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} className="text-primary" />
                <span className="text-sm text-gray-400">0479304986</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} className="text-primary" />
                <span className="text-sm text-gray-400">info@nieuwevloer.be</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 mt-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} NieuweVloer.be | Vakmanschap sinds 2017
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/privacy" className="text-gray-500 hover:text-gray-300 text-sm">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
