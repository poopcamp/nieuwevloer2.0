
import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ServiceSection = () => {
  const services = [
    {
      title: "Vloeren",
      description: "Duurzame en esthetisch aantrekkelijke vloertegels voor elk interieur",
      linkUrl: "/diensten/vloertegels",
      icon: "🏠",
      alt: "Vloertegels icoon"
    },
    {
      title: "Wandtegels",
      description: "Elegante wandtegels voor keukens, badkamers en meer",
      linkUrl: "/diensten/wandtegels",
      icon: "🧱",
      alt: "Wandtegels icoon"
    },
    {
      title: "Badkamerrenovatie",
      description: "Volledige renovatie van uw badkamer met moderne tegels",
      linkUrl: "/diensten/badkamerrenovatie",
      icon: "🚿",
      alt: "Badkamerrenovatie icoon"
    },
    {
      title: "Totale badkamerrenovatie",
      description: "Volledige transformatie inclusief sanitair en leidingwerk",
      linkUrl: "/diensten/complete-badkamerrenovatie",
      icon: "🛁",
      alt: "Totale badkamerrenovatie icoon"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white" id="services">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Onze Diensten</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professionele tegeloplossingen op maat voor uw project
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              className="group"
              variants={itemVariants}
            >
              <Link to={service.linkUrl} className="block">
                <div className="relative overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:shadow-lg bg-white">
                  <div className="p-6 md:p-8">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary-600 mb-5 text-2xl">
                      <span aria-label={service.alt}>{service.icon}</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-5">
                      {service.description}
                    </p>
                    
                    {/* Meer info button styled like in the screenshot */}
                    <div className="mt-2">
                      <div className="relative inline-block w-full overflow-hidden bg-primary rounded-lg group-hover:bg-primary/90 transition-colors duration-300">
                        <div className="flex items-center justify-center py-4 text-white font-medium">
                          <span>Meer info</span>
                          <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-16">
          <Link 
            to="/configurator" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-primary rounded-lg shadow-md hover:bg-primary/90 transition-all duration-300"
          >
            <span>Vraag nu een offerte aan</span>
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
