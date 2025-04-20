
import { useDashboardStats } from "@/hooks/useDashboardStats";
import StatsLoading from "./StatsLoading";
import StatsError from "./StatsError";
import StatsGrid from "./StatsGrid";

const DashboardStats = () => {
  const { stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return <StatsLoading />;
  }

  if (error) {
    return <StatsError error={error} />;
  }

  return <StatsGrid stats={stats} />;
};

export default DashboardStats;
