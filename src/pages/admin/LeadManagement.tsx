
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useLeadManagement } from '@/hooks/useLeadManagement';
import LeadsFilter from '@/components/admin/lead-management/LeadsFilter';
import LeadsTable from '@/components/admin/lead-management/LeadsTable';
import LeadDetailDialog from '@/components/admin/lead-management/LeadDetailDialog';

const LeadManagementPage = () => {
  const {
    leads,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedLead,
    dialogOpen,
    setDialogOpen,
    isSending,
    fetchLeads,
    handleViewLead,
    handleSendFollowUp,
    updateLeadStatus,
  } = useLeadManagement();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Lead Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => fetchLeads()} className="text-sm">
            Vernieuwen
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-3 sm:p-6 pb-0 sm:pb-0">
          <CardTitle className="text-base sm:text-lg mb-3">Leads</CardTitle>
          <LeadsFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </CardHeader>
        <CardContent className="p-3 sm:p-6 overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : leads.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              Geen leads gevonden.
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

      {/* Lead detail dialog */}
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
