
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HolidayDiscount } from "./types";

export const useHolidayDiscounts = () => {
  const [discounts, setDiscounts] = useState<HolidayDiscount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('holiday_discounts')
        .select('*')
        .order('valid_from');

      if (error) throw error;
      
      setDiscounts(data || []);
      
      // If no discounts exist yet, create a default one
      if (data?.length === 0) {
        const now = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 30);
        
        setDiscounts([{
          id: crypto.randomUUID(),
          name: "Feestdagen Korting",
          enabled: false,
          discount_percentage: 5,
          valid_from: now.toISOString().split('T')[0],
          valid_until: end.toISOString().split('T')[0]
        }]);
      }
    } catch (error: any) {
      console.error('Error fetching holiday discounts:', error);
      toast({
        title: "Fout bij ophalen",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index: number, field: keyof HolidayDiscount, value: any) => {
    const updatedDiscounts = [...discounts];
    updatedDiscounts[index] = {
      ...updatedDiscounts[index],
      [field]: value
    };
    setDiscounts(updatedDiscounts);
  };

  const saveDiscounts = async () => {
    setSaving(true);
    try {
      // First delete all existing discounts
      const { error: deleteError } = await supabase
        .from('holiday_discounts')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (deleteError) throw deleteError;

      // Then insert all discounts
      const { error: insertError } = await supabase
        .from('holiday_discounts')
        .insert(discounts);

      if (insertError) throw insertError;

      toast({
        title: "Opgeslagen",
        description: "Feestdagkortingen zijn succesvol bijgewerkt.",
      });
    } catch (error: any) {
      console.error('Error saving holiday discounts:', error);
      toast({
        title: "Fout bij opslaan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    discounts,
    loading,
    saving,
    handleInputChange,
    saveDiscounts
  };
};
