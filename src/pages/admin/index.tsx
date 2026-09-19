
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import StatsCards from "@/components/admin/dashboard/StatsCards";
import LeadsChart from "@/components/admin/dashboard/LeadsChart";
import QuickActionsSection from "@/components/admin/dashboard/quickActions/QuickActionsSection";
import NieuwTerrasOverviewPanel from "@/components/admin/nieuwterras/NieuwTerrasOverviewPanel";
import { BRANDS } from "@/config/brands";
import { fetchAllLeads, weeklyLeadCounts, type LeadFetchResult } from "@/services/leads/leadService";
import {
  fetchNieuwTerrasOverview,
  type NtOverview,
} from "@/services/leads/nieuwterrasOverview";
import { LEAD_STATUSES, statusColor, statusLabel } from "@/components/admin/lead-management/types";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [result, setResult] = useState<LeadFetchResult | null>(null);
  const [nt, setNt] = useState<NtOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchAllLeads(), fetchNieuwTerrasOverview()])
      .then(([leads, overview]) => {
        if (cancelled) return;
        setResult(leads);
        setNt(overview);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const nvLeads = useMemo(
    () => (result?.leads ?? []).filter((lead) => lead.brand === "nv"),
    [result]
  );

  const stats = useMemo(() => {
    const all = result?.leads ?? [];
    return {
      totalLeads: all.length,
      totalConfigurations: all.filter((lead) => lead.status === "proposal").length,
      activeLeads: all.filter((lead) => lead.status !== "won" && lead.status !== "lost").length,
      completedProjects: all.filter((lead) => lead.status === "won").length,
    };
  }, [result]);

  const statusBreakdown = useMemo(() => {
    const all = result?.leads ?? [];
    return LEAD_STATUSES.map((status) => ({
      ...status,
      count: all.filter((lead) => (lead.status || "new") === status.value).length,
    }));
  }, [result]);

  return (
    <>
      <Helmet>
        <title>Overzicht | Beheer NieuweVloer + NieuwTerras</title>
      </Helmet>

      <div className="space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Beheer
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Overzicht</h1>
            <p className="mt-2 text-muted-foreground">
              Welkom{user?.email ? `, ${user.email}` : ""}. NieuweVloer en NieuwTerras in één sessie.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/admin/leads">NV leads &amp; offertes</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/nieuwterras">NieuwTerras</Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Overzicht laden…
          </div>
        ) : (
          <>
            <StatsCards stats={stats} />

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>{BRANDS.nv.label}</CardTitle>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/admin/leads">Alles</Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-3xl font-semibold tabular-nums">{nvLeads.length}</p>
                  <p className="text-sm text-muted-foreground">Aanvragen via {BRANDS.nv.domain}</p>
                  <ul className="space-y-2">
                    {nvLeads.slice(0, 5).map((lead) => (
                      <li key={lead.id} className="flex items-center justify-between gap-3 border-b pb-2 last:border-0">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{lead.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {lead.project_type || "Aanvraag"} · {new Date(lead.created_at).toLocaleDateString("nl-BE")}
                          </p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${statusColor(lead.status)}`}>
                          {statusLabel(lead.status)}
                        </span>
                      </li>
                    ))}
                    {nvLeads.length === 0 && (
                      <li className="text-sm text-muted-foreground">Geen NV-leads in de API.</li>
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Status (beide merken)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {statusBreakdown.map((item) => (
                    <div key={item.value} className="flex items-center justify-between text-sm">
                      <span className={`rounded-full px-2 py-0.5 ${item.color}`}>{item.label}</span>
                      <span className="tabular-nums text-muted-foreground">{item.count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <NieuwTerrasOverviewPanel data={nt} loading={false} compact />

            <LeadsChart weeklyData={weeklyLeadCounts(result?.leads ?? [])} />

            <QuickActionsSection />
          </>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
