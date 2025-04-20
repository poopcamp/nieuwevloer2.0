
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickCalculatorTile } from "@/utils/supabase/customTypes";
import { cn } from "@/lib/utils";
import { Grid3X3, Square, RectangleHorizontal } from "lucide-react";

interface QuickCalculatorPreviewProps {
  tileOptions: QuickCalculatorTile[];
}

const QuickCalculatorPreview = ({ tileOptions }: QuickCalculatorPreviewProps) => {
  // Get appropriate icon for each tile format
  const getTileIcon = (value: string) => {
    switch (value) {
      case '30x30':
        return <Grid3X3 className="h-4 w-4" />;
      case '60x60':
        return <Square className="h-4 w-4" />;
      case '120x120':
        return <RectangleHorizontal className="h-4 w-4" />;
      case 'parket':
        return <Grid3X3 className="h-4 w-4 rotate-45" />;
      default:
        return <Square className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voorbeeld Tegelselector</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-3">Tegelformaat</h3>
          <div className="grid grid-cols-2 gap-3">
            {tileOptions.map(option => (
              <div
                key={option.id}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 bg-white",
                  option.value === '60x60' ? "border-2 border-primary bg-primary/5" : ""
                )}
              >
                <div 
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full mb-1",
                    option.value === '60x60' ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"
                  )}
                >
                  {getTileIcon(option.value)}
                </div>
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs text-gray-500 mt-1">€{option.price_per_sqm.toFixed(2)}/m²</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickCalculatorPreview;
