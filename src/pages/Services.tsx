
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import ServicesList from "@/components/services/ServicesList";
import { ServiceItem } from "@/types/homeContent";

// Interface that matches the database column names
interface ServiceItemDB {
  id: string;
  title: string;
  description: string;
  linkurl: string; // Note: lowercase in database
  icon: string;
  configtype?: string;
  created_at?: string;
  updated_at?: string;
}

const Services = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('created_at');
          
        if (error) throw error;
        
        // Map database fields to frontend model
        const mappedData: ServiceItem[] = (data as ServiceItemDB[]).map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          linkUrl: item.linkurl, // Convert linkurl to linkUrl
          icon: item.icon,
          created_at: item.created_at,
          updated_at: item.updated_at
        }));
        
        setServices(mappedData);
      } catch (error: any) {
        console.error("Error fetching services:", error);
        toast({
          title: "Fout bij laden",
          description: "Kon de diensten niet laden. Probeer het later opnieuw.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Onze Diensten | NieuweVloer.be</title>
        <meta name="description" content="Ontdek onze professionele diensten voor vloer- en wandtegels, badkamerrenovaties en meer. Vakmanschap en kwaliteit, regio Maldegem." />
        <meta name="keywords" content="tegelplaatsing,vloertegels,wandtegels,badkamerrenovatie,Maldegem,tegels" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <PageHeader 
          title="Onze Diensten" 
          subtitle="Professionele oplossingen voor al uw tegelprojecten" 
        />
        
        <ServicesList services={services} loading={loading} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;
