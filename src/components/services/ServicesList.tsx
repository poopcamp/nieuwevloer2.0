
import React from 'react';
import { Link } from 'react-router-dom';
import { ServiceItem } from '@/types/homeContent';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ServicesListProps {
  services: ServiceItem[];
  loading?: boolean;
}

const ServicesList = ({ services, loading = false }: ServicesListProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
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

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-7 bg-gray-200 rounded mb-3 w-3/4"></div>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <motion.div 
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {services.map((service) => (
          <motion.div 
            key={service.id} 
            className="group"
            variants={itemVariants}
          >
            <Link to={service.linkUrl} className="block h-full">
              <div className="relative h-full overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
                {/* Service icon */}
                <div className="p-6 md:p-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 mb-5 text-2xl">
                    <span>{service.icon}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{service.title}</h3>
                  
                  <p className="text-gray-600 mb-5">{service.description}</p>
                  
                  {/* Meer info button with improved styling */}
                  <div className="mt-4">
                    <div className="relative overflow-hidden group-hover:overflow-visible">
                      <div className="flex items-center justify-center py-3 px-6 rounded-lg bg-primary text-white font-medium transition-all duration-300 group-hover:bg-primary-600">
                        <span>Meer info</span>
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 blur-xl transition-all duration-300 group-hover:opacity-70 group-hover:blur"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ServicesList;
