
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { useHolidayDiscounts } from "./holiday/useHolidayDiscounts";
import DiscountItem from "./holiday/DiscountItem";
import LoadingSpinner from "./common/LoadingSpinner";

const HolidayDiscountManager = () => {
  const { discounts, loading, saving, handleInputChange, saveDiscounts } = useHolidayDiscounts();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beheer Feestdagkortingen</CardTitle>
        <CardDescription>
          Schakel feestdagkortingen in en uit en pas het kortingspercentage aan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-6">
            {discounts.map((discount, index) => (
              <DiscountItem 
                key={discount.id}
                discount={discount}
                index={index}
                onInputChange={handleInputChange}
              />
            ))}
            
            <div className="flex justify-end pt-4">
              <Button 
                onClick={saveDiscounts} 
                disabled={saving}
                className="gap-2"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Kortingen Opslaan
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HolidayDiscountManager;
