
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ColorPalette from "./ColorPalette";
import PopularityMeter from "./PopularityMeter";
import { InspirationTile } from "./types";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface InspirationCardProps {
  item: InspirationTile;
}

export default function InspirationCard({ item }: InspirationCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUseStyle = async () => {
    try {
      // Toon een toast om de gebruiker te laten weten dat hun selectie is opgeslagen
      toast({
        title: "Stijl geselecteerd",
        description: "Deze stijl wordt gebruikt in de configurator. U wordt doorgestuurd...",
      });

      // Navigeer naar de configurator met de geselecteerde stijl als URL parameter
      navigate(`/configurator?style=${item.id}&title=${encodeURIComponent(item.title)}`);
    } catch (error) {
      console.error("Fout bij selecteren stijl:", error);
      
      toast({
        title: "Fout bij selecteren stijl",
        description: "Er is een probleem opgetreden. Probeer het later nog eens.",
        variant: "destructive",
      });
      
      // Als er een fout optreedt, navigeer toch naar de configurator
      navigate("/configurator");
    }
  };

  return (
    <Card className="overflow-hidden border-none shadow-xl rounded-xl transition-all duration-300 hover:shadow-2xl bg-white">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="h-64 md:h-full overflow-hidden relative">
            <img 
              src={item.image || "/placeholder.svg"} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent opacity-50 md:bg-gradient-to-l"></div>
            
            {/* Decorative pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iLjAzIj48cGF0aCBkPSJNMzYgMzRjMC0yLjItMS44LTQtNC00cy00IDEuOC00IDQgMS44IDQgNCA0IDQtMS44IDQtNHptMC0zMGMwLTIuMi0xLjgtNC00LTRzLTQgMS44LTQgNCAxLjggNCA0IDQgNC0xLjggNC00em0wIDYwYzAtMi4yLTEuOC00LTQtNHMtNCAxLjgtNCA0IDEuOCA0IDQgNCA0LTEuOCA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50">
            <div>
              <Badge className="mb-3 bg-primary-100 text-primary-700 hover:bg-primary-200 border-none px-3 py-1.5 font-medium">
                Trend {new Date().getFullYear()}
              </Badge>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 mb-6 text-base">{item.description}</p>
              
              <div className="space-y-5 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Kleurenpalet</p>
                  <ColorPalette colors={item.colorPalette} />
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Populariteit</p>
                  <PopularityMeter value={item.popularity} />
                </div>
              </div>
            </div>
            
            <div>
              <motion.div 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-300 to-primary-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <Button 
                  className="relative w-full md:w-auto group bg-gradient-to-br from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white shadow-md py-6"
                  onClick={handleUseStyle}
                >
                  Gebruik deze stijl
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
