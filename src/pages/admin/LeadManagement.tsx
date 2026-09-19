
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useLeadManagement } from "@/hooks/useLeadManagement";
import { useBrandScope } from "@/contexts/brand-context";
import LeadsFilter from "@/components/admin/lead-management/LeadsFilter";
import LeadsTable from "@/components/admin/lead-management/LeadsTable";
import LeadDetailDialog from "@/components/admin/lead-management/LeadDetailDialog";
import BrandScopeTabs from "@/components/admin/BrandScopeTabs";
import { BRANDS } from "@/config/brands";

const LeadManagementPage = () => {
  const {
    leads,
    allLeads,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedLead,
    dialogOpen,
    setDialogOpen,
    isSending,
    ntConfigured,
    fetchLeads,
    handleViewLead,
    handleSendFollowUp,
    updateLeadStatus,
  } = useLeadManagement();
  const { scope } = useBrandScope();

  const title =
    scope === "nv" ? `${BRANDS.nv.label} — leads` : scope === "nt" ? `${BRANDS.nt.label} — leads` : "Leads & offertes";

  return (
    <div className="space-y-4 sm:space-y-6">
      <Helmet>
        <title>{title} | Beheer</title>
      </Helmet>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Echte aanvragen uit de API. Status: nieuw, gecontacteerd, offerte, gewonnen, verloren.
            {!ntConfigured && scope !== "nv" && (
              <> NieuwTerras deelt de NieuweVloer-API tenzij VITE_NIEUWTERRAS_API_URL is gezet.</>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <BrandScopeTabs
            nvCount={allLeads.filter((lead) => lead.brand === "nv").length}
            ntCount={allLeads.filter((lead) => lead.brand === "nt").length}
            className="border-border bg-muted text-foreground [&_button]:text-foreground [&_button[aria-selected=true]]:bg-background"
          />
          <Button variant="outline" onClick={() => fetchLeads()} className="text-sm">
            Vernieuwen
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-3 pb-0 sm:p-6 sm:pb-0">
          <CardTitle className="mb-3 text-base sm:text-lg">
            {leads.length} {leads.length === 1 ? "aanvraag" : "aanvragen"}
          </CardTitle>
          <LeadsFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </CardHeader>
        <CardContent className="overflow-x-auto p-3 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : leads.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">
              Geen leads gevonden voor deze filter. Er wordt geen testdata getoond.
            </p>
          ) : (
            <LeadsTable
              leads={leads}
              isLoading={isLoading}
              onViewLead={handleViewLead}
              onUpdateStatus={updateLeadStatus}
              onSendFollowUp={handleSendFollowUp}
              isSending={isSending}
            />
          )}
        </CardContent>
      </Card>

      <LeadDetailDialog
        lead={selectedLead}
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onSendFollowUp={handleSendFollowUp}
        isSending={isSending}
      />
    </div>
  );
};

export default LeadManagementPage;
