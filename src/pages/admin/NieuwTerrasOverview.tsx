import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NieuwTerrasOverviewPanel from "@/components/admin/nieuwterras/NieuwTerrasOverviewPanel";
import {
  fetchNieuwTerrasOverview,
  type NtOverview,
} from "@/services/leads/nieuwterrasOverview";

const NieuwTerrasOverviewPage = () => {
  const [data, setData] = useState<NtOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchNieuwTerrasOverview()
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Helmet>
        <title>NieuwTerras | Beheer</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5F7D62]">
              NieuwTerras
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Terras-offertes</h1>
            <p className="mt-2 text-muted-foreground">
              Zelfde paneel en login als NieuweVloer. Filter op status in de lijst hieronder.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={load}>
              Vernieuwen
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/leads">Leads &amp; status</Link>
            </Button>
          </div>
        </div>
        <NieuwTerrasOverviewPanel data={data} loading={loading} />
      </div>
    </>
  );
};

export default NieuwTerrasOverviewPage;
