
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ServiceItem } from "./types";

export const useServices = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id');

      if (error) throw error;
      
      // Map database fields to component fields
      const formattedData = data?.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        linkUrl: item.linkurl,
        icon: item.icon,
        created_at: item.created_at,
        updated_at: item.updated_at
      })) || [];
      
      setServices(formattedData);
    } catch (error: any) {
      console.error('Error fetching services:', error);
      toast({
        title: "Fout bij ophalen",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index: number, field: keyof ServiceItem, value: string) => {
    const updatedServices = [...services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value
    };
    setServices(updatedServices);
  };

  const addService = () => {
    setServices([
      ...services,
      {
        id: crypto.randomUUID(),
        title: "",
        description: "",
        linkUrl: "",
        icon: "🏠"
      }
    ]);
  };

  const removeService = (index: number) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };

  const saveServices = async () => {
    setSaving(true);
    try {
      // Convert component fields to database fields
      const dbData = services.map(service => ({
        id: service.id,
        title: service.title,
        description: service.description,
        linkurl: service.linkUrl,
        icon: service.icon
      }));

      // First delete all existing services
      const { error: deleteError } = await supabase
        .from('services')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (deleteError) throw deleteError;

      // Then insert all services
      const { error: insertError } = await supabase
        .from('services')
        .insert(dbData);

      if (insertError) throw insertError;

      toast({
        title: "Opgeslagen",
        description: "Diensten zijn succesvol bijgewerkt.",
      });
    } catch (error: any) {
      console.error('Error saving services:', error);
      toast({
        title: "Fout bij opslaan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    saving,
    handleInputChange,
    addService,
    removeService,
    saveServices
  };
};
