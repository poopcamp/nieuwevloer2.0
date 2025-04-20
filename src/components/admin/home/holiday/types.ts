
export interface HolidayDiscount {
  id: string;
  name: string;
  enabled: boolean;
  discount_percentage: number;
  valid_from: string;
  valid_until: string;
  created_at?: string;
  updated_at?: string;
}
