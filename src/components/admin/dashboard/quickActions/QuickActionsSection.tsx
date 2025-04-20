
import { Grid, Settings, Table } from "lucide-react";
import QuickActionCard from "./QuickActionCard";

export default function QuickActionsSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Snelkoppelingen</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <QuickActionCard 
          title="Inspiratie Tegels"
          description="Beheer de inspiratietegels die worden getoond in de inspiratiecorner."
          icon={<Grid className="h-8 w-8 text-primary" />}
          buttonLabel="Ga naar Inspiratie Tegels"
          buttonAction="/admin/inspiration"
          color="green"
        />

        <QuickActionCard 
          title="Catalogus Beheer"
          description="Beheer tegelsoorten, formaten, stijlen en opties voor de configurator."
          icon={<Grid className="h-8 w-8 text-emerald-600" />}
          buttonLabel="Ga naar Catalogus Beheer"
          buttonAction="/admin/tiles"
          color="emerald"
        />

        <QuickActionCard
          title="SEO Beheer"
          description="Optimaliseer uw website voor zoekmachines en verbeter uw vindbaarheid."
          icon={<Table className="h-8 w-8 text-blue-600" />}
          buttonLabel="Ga naar SEO Beheer"
          buttonAction="/admin/seo"
          color="blue"
        />

        <QuickActionCard
          title="Instellingen"
          description="Beheer de algemene instellingen van uw bedrijf en website."
          icon={<Settings className="h-8 w-8 text-amber-600" />}
          buttonLabel="Ga naar Instellingen"
          buttonAction="/admin/settings"
          color="amber"
        />
      </div>
    </div>
  );
}
