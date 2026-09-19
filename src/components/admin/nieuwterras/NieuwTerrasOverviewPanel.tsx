import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { statusColor, statusLabel } from "@/components/admin/lead-management/types";
import type { NtOverview } from "@/services/leads/nieuwterrasOverview";

interface NieuwTerrasOverviewPanelProps {
  data: NtOverview | null;
  loading: boolean;
  compact?: boolean;
}

const NieuwTerrasOverviewPanel = ({ data, loading, compact = false }: NieuwTerrasOverviewPanelProps) => {
  const rows = compact ? data?.offertes.slice(0, 8) ?? [] : data?.offertes ?? [];

  return (
    <section className="space-y-4 rounded-2xl border border-stone-200 bg-[#FBFAF7] p-4 text-[#1E2422] dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5F7D62]">NieuwTerras</p>
          <h2 className="text-2xl font-semibold tracking-tight">Terras-offertes</h2>
          <p className="mt-1 max-w-xl text-sm text-stone-600 dark:text-stone-400">
            Overzicht in dit paneel — zelfde login als NieuweVloer. Geen testdata.
          </p>
        </div>
        {compact && (
          <Button asChild variant="outline" className="border-[#5F7D62]/30">
            <Link to="/admin/nieuwterras">Volledig NT-overzicht</Link>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-stone-500">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          NieuwTerras-aanvragen ophalen…
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="border-stone-200 shadow-none">
              <CardHeader className="pb-1">
                <CardTitle className="text-xs uppercase tracking-wide text-stone-500">Totaal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tabular-nums">{data?.stats.totaal ?? 0}</p>
              </CardContent>
            </Card>
            <Card className="border-stone-200 shadow-none">
              <CardHeader className="pb-1">
                <CardTitle className="text-xs uppercase tracking-wide text-stone-500">Ongelezen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tabular-nums">{data?.stats.ongelezen ?? 0}</p>
              </CardContent>
            </Card>
            <Card className="border-stone-200 shadow-none">
              <CardHeader className="pb-1">
                <CardTitle className="text-xs uppercase tracking-wide text-stone-500">Deze week</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tabular-nums">{data?.stats.dezeWeek ?? 0}</p>
              </CardContent>
            </Card>
          </div>

          <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white dark:bg-stone-950">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F4F2EC] text-xs uppercase tracking-wide text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                <tr>
                  <th className="px-3 py-2 font-medium">Naam</th>
                  <th className="px-3 py-2 font-medium">Contact</th>
                  <th className="px-3 py-2 font-medium">Gemeente</th>
                  <th className="px-3 py-2 font-medium">m²</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Datum</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-stone-500">
                      Nog geen NieuwTerras-offertes in de gekoppelde bronnen.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={row.id}
                      className={row.unread ? "bg-[#F2F6F1] font-medium dark:bg-stone-800/60" : "border-t border-stone-100"}
                    >
                      <td className="px-3 py-2">{row.name}</td>
                      <td className="px-3 py-2">
                        <div>{row.email || "—"}</div>
                        <div className="text-xs text-stone-500">{row.phone || ""}</div>
                      </td>
                      <td className="px-3 py-2">{row.gemeente || "—"}</td>
                      <td className="px-3 py-2">{row.oppervlakte || "—"}</td>
                      <td className="px-3 py-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs ${statusColor(row.status)}`}>
                          {statusLabel(row.status)}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {new Date(row.created_at).toLocaleDateString("nl-BE")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {data?.sources.length ? (
            <p className="text-xs text-stone-500">Bron: {data.sources.join(" · ")}</p>
          ) : null}

          {data?.errors.length ? (
            <p className="text-xs text-red-700">{data.errors.join(" · ")}</p>
          ) : null}

          {data?.contractNeeded && (
            <div className="rounded-xl border border-dashed border-[#5F7D62]/40 bg-white px-4 py-3 text-sm text-stone-600 dark:bg-stone-950">
              <p className="font-medium text-[#1E2422] dark:text-stone-100">HS-datacontract (nieuwterras-web)</p>
              <p className="mt-1">
                Live NT-admin is cookie-login op nieuwterras.be/admin (POST /admin/login). Offertes komen
                binnen via POST /api/offerte (naam, email, telefoon, gemeente, oppervlakte, bericht).
                Er is vandaag geen publieke GET-lijst. Voor dit paneel: voeg
                <code className="mx-1 rounded bg-stone-100 px-1">GET /api/admin/overview</code>
                toe (Bearer of X-Admin-Token) en zet
                <code className="mx-1 rounded bg-stone-100 px-1">VITE_NIEUWTERRAS_ADMIN_API</code>
                +
                <code className="mx-1 rounded bg-stone-100 px-1">VITE_NIEUWTERRAS_ADMIN_TOKEN</code>
                bij de NV-build. CORS toestaan vanaf nieuwevloer.be. Tot die tijd toont dit paneel NT-rijen
                uit api.nieuwevloer.be <code className="rounded bg-stone-100 px-1">leads</code> als die bron/project
                terras is.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default NieuwTerrasOverviewPanel;
