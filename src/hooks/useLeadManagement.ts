
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Lead } from "@/components/admin/lead-management/types";
import { sendFollowUpEmail } from "@/utils/followUpHelpers";
import { fetchAllLeads, updateLeadStatus as persistLeadStatus } from "@/services/leads/leadService";
import { useBrandScope } from "@/contexts/brand-context";

export const useLeadManagement = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [ntConfigured, setNtConfigured] = useState(false);
  const [fetchErrors, setFetchErrors] = useState<string[]>([]);
  const { toast } = useToast();
  const { scope } = useBrandScope();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const result = await fetchAllLeads();
      setLeads(result.leads);
      setNtConfigured(result.ntConfigured);
      setFetchErrors(result.errors);
      if (result.errors.length > 0) {
        toast({
          title: "Sommige bronnen gaven een fout",
          description: result.errors.join(" · "),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast({
        title: "Fout bij ophalen van leads",
        description: "Er is een fout opgetreden bij het ophalen van leads.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setDialogOpen(true);
  };

  const handleSendFollowUp = async (lead: Lead, followUpType: string) => {
    setIsSending(true);
    try {
      const result = await sendFollowUpEmail({
        email: lead.email,
        name: lead.name,
        projectType: lead.project_type,
        followUpType: followUpType as never,
      });

      if (result.success) {
        toast({
          title: "E-mail verzonden",
          description: `Opvolgmail is succesvol verstuurd naar ${lead.name}.`,
        });
      } else {
        throw new Error(result.error || "Onbekende fout bij verzenden van e-mail");
      }
    } catch (error: unknown) {
      console.error("Error sending follow-up email:", error);
      const message = error instanceof Error ? error.message : "Er is een fout opgetreden bij het verzenden van de e-mail.";
      toast({
        title: "Fout bij verzenden van e-mail",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    const current = leads.find((lead) => lead.id === leadId);
    if (!current) return;

    try {
      await persistLeadStatus(current, status);
      toast({
        title: "Status bijgewerkt",
        description: "De status van de lead is succesvol bijgewerkt.",
      });
      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, status } : lead))
      );
    } catch (error) {
      console.error("Error updating lead status:", error);
      toast({
        title: "Fout bij bijwerken van status",
        description: "Er is een fout opgetreden bij het bijwerken van de status.",
        variant: "destructive",
      });
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesBrand = scope === "all" || lead.brand === scope;
      const haystack = `${lead.name} ${lead.email} ${lead.phone ?? ""}`.toLowerCase();
      const matchesSearch = haystack.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? lead.status === statusFilter : true;
      return matchesBrand && matchesSearch && matchesStatus;
    });
  }, [leads, scope, searchTerm, statusFilter]);

  return {
    leads: filteredLeads,
    allLeads: leads,
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
    fetchErrors,
    fetchLeads,
    handleViewLead,
    handleSendFollowUp,
    updateLeadStatus,
  };
};
