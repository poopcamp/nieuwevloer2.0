
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";

interface ChartData {
  name: string;
  leads: number;
}

interface LeadsChartProps {
  weeklyData: ChartData[];
}

const LeadsChart = ({ weeklyData }: LeadsChartProps) => {
  // Define chart configuration
  const chartConfig = {
    leads: {
      label: "Leads",
      color: "#00847E",
    }
  };

  return (
    <Card>
      <CardHeader className="p-3 sm:p-6 pb-0 sm:pb-0">
        <CardTitle className="text-base sm:text-lg">Leads Overzicht</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-3 sm:pt-4">
        <Tabs defaultValue="week">
          <TabsList className="mb-3 sm:mb-4">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Maand</TabsTrigger>
            <TabsTrigger value="year">Jaar</TabsTrigger>
          </TabsList>
          <TabsContent value="week" className="h-[200px] sm:h-[300px]">
            <ChartContainer config={chartConfig}>
              <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="leads" fill="var(--color-leads, #00847E)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="month" className="h-[200px] sm:h-[300px]">
            {/* Month data would go here */}
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Gegevens voor maandweergave worden geladen</p>
            </div>
          </TabsContent>
          <TabsContent value="year" className="h-[200px] sm:h-[300px]">
            {/* Year data would go here */}
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Gegevens voor jaarweergave worden geladen</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LeadsChart;
