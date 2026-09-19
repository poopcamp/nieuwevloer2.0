import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
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
      <div className="space-y-4">
        <div className="flex items-center justify-end">
          <Button variant="outline" onClick={load}>
            Vernieuwen
          </Button>
        </div>
        <NieuwTerrasOverviewPanel data={data} loading={loading} />
      </div>
    </>
  );
};

export default NieuwTerrasOverviewPage;
