
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface HolidayResult {
  isHoliday: boolean;
  name: string;
}

interface HolidayDiscount {
  id: string;
  name: string;
  enabled: boolean;
  discount_percentage: number;
  valid_from: string;
  valid_until: string;
}

/**
 * Check if the current date is a holiday in Belgium
 */
export function isHoliday(date: Date): HolidayResult {
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() is zero-based
  const year = date.getFullYear();

  // Fixed holidays
  if (month === 1 && day === 1) return { isHoliday: true, name: "Nieuwjaar" };
  if (month === 5 && day === 1) return { isHoliday: true, name: "Dag van de Arbeid" };
  if (month === 7 && day === 21) return { isHoliday: true, name: "Nationale Feestdag" };
  if (month === 8 && day === 15) return { isHoliday: true, name: "Onze-Lieve-Vrouw Hemelvaart" };
  if (month === 11 && day === 1) return { isHoliday: true, name: "Allerheiligen" };
  if (month === 11 && day === 11) return { isHoliday: true, name: "Wapenstilstand" };
  if (month === 12 && day === 25) return { isHoliday: true, name: "Kerstmis" };
  
  // Add Easter and related holidays (these are variable dates)
  // This is a simplified calculation for demonstration
  // For a real implementation, you would need a more accurate Easter calculation

  // For testing purposes, we can uncomment this line to simulate a holiday
  // return { isHoliday: true, name: "Test Feestdag" };
  
  return { isHoliday: false, name: "" };
}

/**
 * Custom hook to check if a holiday discount applies
 */
export function useHolidayDiscount() {
  const [discountData, setDiscountData] = useState<{
    hasDiscount: boolean;
    discountName: string;
    discountPercentage: number;
  }>({
    hasDiscount: false,
    discountName: "",
    discountPercentage: 0
  });
  
  useEffect(() => {
    async function fetchActiveDiscounts() {
      const today = new Date().toISOString().split('T')[0];
      
      try {
        const { data, error } = await supabase
          .from('holiday_discounts')
          .select('*')
          .eq('enabled', true)
          .lte('valid_from', today)
          .gte('valid_until', today);
        
        if (error) {
          console.error('Error fetching holiday discounts:', error);
          return;
        }
        
        if (data && data.length > 0) {
          // If multiple discounts are active, use the one with the highest percentage
          const highestDiscount = data.reduce((prev, current) => 
            prev.discount_percentage > current.discount_percentage ? prev : current
          );
          
          setDiscountData({
            hasDiscount: true,
            discountName: highestDiscount.name,
            discountPercentage: highestDiscount.discount_percentage
          });
        } else {
          // Fallback to traditional holidays if no configured discounts
          const holidayCheck = isHoliday(new Date());
          
          setDiscountData({
            hasDiscount: holidayCheck.isHoliday,
            discountName: holidayCheck.name,
            discountPercentage: holidayCheck.isHoliday ? 5 : 0
          });
        }
      } catch (error) {
        console.error('Error in useHolidayDiscount:', error);
        
        // Fallback to traditional holidays on error
        const holidayCheck = isHoliday(new Date());
        
        setDiscountData({
          hasDiscount: holidayCheck.isHoliday,
          discountName: holidayCheck.name,
          discountPercentage: holidayCheck.isHoliday ? 5 : 0
        });
      }
    }
    
    fetchActiveDiscounts();
  }, []);
  
  return discountData;
}
