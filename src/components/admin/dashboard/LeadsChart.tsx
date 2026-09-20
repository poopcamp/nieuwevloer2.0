
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartData {
  name: string;
  leads: number;
}

interface LeadsChartProps {
  weeklyData: ChartData[];
}

const LeadsChart = ({ weeklyData }: LeadsChartProps) => {
  const chartConfig = {
    leads: {
      label: "Aanvragen",
      color: "#00847E",
    },
  };

  const hasData = weeklyData.some((row) => row.leads > 0);

  return (
    <Card>
      <CardHeader className="p-3 pb-0 sm:p-6 sm:pb-0">
        <CardTitle className="text-base sm:text-lg">Aanvragen deze week</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-3 sm:p-6 sm:pt-4">
        {hasData ? (
          <div className="h-[200px] sm:h-[280px]">
            <ChartContainer config={chartConfig}>
              <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="leads" fill="var(--color-leads, #00847E)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Nog geen aanvragen deze week.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadsChart;
