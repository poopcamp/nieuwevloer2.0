
import { Card, CardContent } from "@/components/ui/card";
import { Eye, MessageSquare, TrendingUp, Users } from "lucide-react";

interface StatsData {
  totalLeads: number;
  totalConfigurations: number;
  activeLeads: number;
  completedProjects: number;
}

interface StatsCardsProps {
  stats: StatsData;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="bg-primary/10 p-2 sm:p-3 rounded-full">
              <Users className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Totaal Leads</p>
              <h3 className="text-lg sm:text-2xl font-bold">{stats.totalLeads}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="bg-green-500/10 p-2 sm:p-3 rounded-full">
              <MessageSquare className="h-4 w-4 sm:h-6 sm:w-6 text-green-500" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Actieve Leads</p>
              <h3 className="text-lg sm:text-2xl font-bold">{stats.activeLeads}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="bg-blue-500/10 p-2 sm:p-3 rounded-full">
              <Eye className="h-4 w-4 sm:h-6 sm:w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Configuraties</p>
              <h3 className="text-lg sm:text-2xl font-bold">{stats.totalConfigurations}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="bg-purple-500/10 p-2 sm:p-3 rounded-full">
              <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Voltooide Projecten</p>
              <h3 className="text-lg sm:text-2xl font-bold">{stats.completedProjects}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
