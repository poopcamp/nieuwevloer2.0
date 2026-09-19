
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { useBrandScope } from "@/contexts/brand-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import StatsCards from "@/components/admin/dashboard/StatsCards";
import LeadsChart from "@/components/admin/dashboard/LeadsChart";
import RecentLeadsCard from "@/components/admin/dashboard/RecentLeadsCard";
import QuickActionsSection from "@/components/admin/dashboard/quickActions/QuickActionsSection";
import BrandScopeTabs from "@/components/admin/BrandScopeTabs";
import { BRANDS } from "@/config/brands";
import { AUTH_API_URL } from "@/integrations/supabase/client";
import { isNieuwTerrasApiConfigured } from "@/integrations/nieuwterras/client";
import {
  fetchAllLeads,
  filterLeadsByScope,
  weeklyLeadCounts,
  type LeadFetchResult,
} from "@/services/leads/leadService";
import { LEAD_STATUSES, statusLabel } from "@/components/admin/lead-management/types";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { scope } = useBrandScope();
  const [result, setResult] = useState<LeadFetchResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchAllLeads()
      .then((data) => {
        if (!cancelled) setResult(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const scopedLeads = useMemo(
    () => filterLeadsByScope(result?.leads ?? [], scope),
    [result, scope]
  );

  const stats = useMemo(() => {
    const active = scopedLeads.filter(
      (lead) => lead.status !== "won" && lead.status !== "lost"
    );
    const won = scopedLeads.filter((lead) => lead.status === "won");
    const offertes = scopedLeads.filter(
      (lead) => lead.sourceTable === "configurations" || lead.status === "proposal"
    );
    return {
      totalLeads: scopedLeads.length,
      totalConfigurations: offertes.length,
      activeLeads: active.length,
      completedProjects: won.length,
    };
  }, [scopedLeads]);

  const statusBreakdown = useMemo(() => {
    return LEAD_STATUSES.map((status) => ({
      ...status,
      count: scopedLeads.filter((lead) => (lead.status || "new") === status.value).length,
    }));
  }, [scopedLeads]);

  const recentLeads = scopedLeads.slice(0, 6).map((lead) => ({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    project_type: lead.project_type || statusLabel(lead.status),
    created_at: lead.created_at,
    phone: lead.phone,
    brand: lead.brand,
    status: lead.status,
  }));

  const scopeTitle =
    scope === "nv" ? BRANDS.nv.label : scope === "nt" ? BRANDS.nt.label : "NieuweVloer + NieuwTerras";

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
            <h1 className="text-3xl font-bold tracking-tight">{scopeTitle}</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Welkom{user?.email ? `, ${user.email}` : ""}. Eén sessie voor beide merken.
              Login via {AUTH_API_URL.replace(/^https:\/\//, "")}.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <BrandScopeTabs
              nvCount={result?.nvCount}
              ntCount={result?.ntCount}
              className="border-border bg-muted text-foreground [&_button]:text-foreground [&_button[aria-selected=true]]:bg-background"
            />
            <Button asChild>
              <Link to="/admin/leads">Leads &amp; offertes</Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Leads ophalen…
          </div>
        ) : (
          <>
            <StatsCards stats={stats} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{BRANDS.nv.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold tabular-nums">{result?.nvCount ?? 0}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Leads/offertes via {BRANDS.nv.domain}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{BRANDS.nt.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold tabular-nums">{result?.ntCount ?? 0}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {isNieuwTerrasApiConfigured()
                      ? `Apart API: ${import.meta.env.VITE_NIEUWTERRAS_API_URL}`
                      : "Zelfde API, gefilterd op bron/project (terras/patio). Optioneel: VITE_NIEUWTERRAS_API_URL."}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Status</CardTitle>
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

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <LeadsChart weeklyData={weeklyLeadCounts(scopedLeads)} />
              </div>
              <RecentLeadsCard recentLeads={recentLeads} />
            </div>

            {scopedLeads.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  Geen leads in deze weergave. Er wordt geen testdata getoond — alleen echte API-resultaten.
                </CardContent>
              </Card>
            )}

            <QuickActionsSection />
          </>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
