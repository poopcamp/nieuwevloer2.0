
import { Grid2X2, BookOpen, Box, Layout, PackageOpen } from "lucide-react";
import StatCard from "./StatCard";
import { Badge } from "@/components/ui/badge";

type StatsGridProps = {
  stats: {
    tileTypes: number;
    tileSizes: number;
    tileStyles: number;
    extraOptions: number;
    blogPosts: number;
    services: number;
  };
};

const StatsGrid = ({ stats }: StatsGridProps) => {
  const totalItems = Object.values(stats).reduce((a, b) => a + b, 0);
  
  return (
    <div className="space-y-4">
      {/* Content Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Tegelsoorten"
          value={stats.tileTypes}
          icon={<Grid2X2 className="h-4 w-4 text-primary" />}
        />
        <StatCard
          title="Tegelformaten"
          value={stats.tileSizes}
          icon={<Layout className="h-4 w-4 text-primary" />}
        />
        <StatCard
          title="Tegelstijlen"
          value={stats.tileStyles}
          icon={<PackageOpen className="h-4 w-4 text-primary" />}
        />
      </div>
      
      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Extra opties"
          value={stats.extraOptions}
          icon={<Box className="h-4 w-4 text-primary" />}
        />
        <StatCard
          title="Blogartikelen"
          value={stats.blogPosts}
          icon={<BookOpen className="h-4 w-4 text-primary" />}
        />
        <div className="flex items-center justify-center px-4 py-3.5 border rounded-lg shadow-sm bg-card">
          <Badge variant="outline" className="text-xs bg-primary/5 text-primary px-2.5 py-1">
            Content items: {totalItems}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default StatsGrid;
