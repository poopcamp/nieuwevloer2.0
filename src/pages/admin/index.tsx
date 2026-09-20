
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { useBrandScope } from "@/contexts/brand-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import StatsCards from "@/components/admin/dashboard/StatsCards";
import LeadsChart from "@/components/admin/dashboard/LeadsChart";
import BrandScopeTabs from "@/components/admin/BrandScopeTabs";
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
  const { scope } = useBrandScope();
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

  const scopedLeads = useMemo(() => {
    const all = result?.leads ?? [];
    if (scope === "nv") return nvLeads;
    if (scope === "nt") return all.filter((lead) => lead.brand === "nt");
    return all;
  }, [result, nvLeads, scope]);

  const stats = useMemo(() => {
    return {
      totalLeads: scopedLeads.length,
      totalConfigurations: scopedLeads.filter((lead) => lead.status === "proposal").length,
      activeLeads: scopedLeads.filter((lead) => lead.status !== "won" && lead.status !== "lost").length,
      completedProjects: scopedLeads.filter((lead) => lead.status === "won").length,
    };
  }, [scopedLeads]);

  const statusBreakdown = useMemo(() => {
    return LEAD_STATUSES.map((status) => ({
      ...status,
      count: scopedLeads.filter((lead) => (lead.status || "new") === status.value).length,
    }));
  }, [scopedLeads]);

  const showNv = scope !== "nt";
  const showNt = scope !== "nv";
  const splitBrands = showNv && showNt;

  return (
    <>
      <Helmet>
        <title>Overzicht | Beheer NieuweVloer + NieuwTerras</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Beheer
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Overzicht</h1>
            <p className="mt-2 text-muted-foreground">
              Welkom{user?.email ? `, ${user.email}` : ""}. Eén paneel, één login — wissel hieronder van merk.
            </p>
          </div>
          <BrandScopeTabs
            nvCount={result?.nvCount}
            ntCount={nt?.stats.totaal ?? result?.ntCount}
            className="border-border bg-muted text-foreground [&_button]:text-foreground [&_button[aria-selected=true]]:bg-background"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Overzicht laden…
          </div>
        ) : (
          <>
            <StatsCards stats={stats} />

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {statusBreakdown.map((item) => (
                <Link
                  key={item.value}
                  to={`/admin/leads?status=${item.value}`}
                  className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 text-sm transition-colors hover:border-slate-400"
                >
                  <span className={`rounded-full px-2 py-0.5 ${item.color}`}>{item.label}</span>
                  <span className="tabular-nums text-muted-foreground">{item.count}</span>
                </Link>
              ))}
            </div>

            <div className={cn("grid gap-6", splitBrands && "xl:grid-cols-2")}>
              {showNv && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>{BRANDS.nv.label} — leads &amp; offertes</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">{nvLeads.length} aanvragen</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/admin/leads">Lijst + status</Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {nvLeads.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Geen NieuweVloer-leads in de API.</p>
                    ) : (
                      <ul className="divide-y">
                        {nvLeads.slice(0, 8).map((lead) => (
                          <li key={lead.id} className="flex items-center justify-between gap-3 py-2.5">
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
                      </ul>
                    )}
                  </CardContent>
                </Card>
              )}

              {showNt && <NieuwTerrasOverviewPanel data={nt} loading={false} compact={scope === "all"} />}
            </div>

            {scope !== "nt" && <LeadsChart weeklyData={weeklyLeadCounts(scopedLeads)} />}
          </>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
