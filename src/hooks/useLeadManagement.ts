
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Lead } from '@/components/admin/lead-management/types';
import { sendFollowUpEmail } from '@/utils/followUpHelpers';

export const useLeadManagement = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('configurations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform data to include status and tags (placeholder for now)
      const transformedData = data.map((lead) => ({
        ...lead,
        status: lead.opvolging_gestopt ? 'lost' : lead.lead_score > 70 ? 'won' : lead.lead_score > 30 ? 'contacted' : 'new',
        tags: [],
      }));

      setLeads(transformedData);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: 'Fout bij ophalen van leads',
        description: 'Er is een fout opgetreden bij het ophalen van leads.',
        variant: 'destructive',
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
        followUpType: followUpType as any,
      });

      if (result.success) {
        toast({
          title: 'E-mail verzonden',
          description: `Opvolgmail is succesvol verstuurd naar ${lead.name}.`,
        });
      } else {
        throw new Error(result.error || 'Onbekende fout bij verzenden van e-mail');
      }
    } catch (error: any) {
      console.error('Error sending follow-up email:', error);
      toast({
        title: 'Fout bij verzenden van e-mail',
        description: error.message || 'Er is een fout opgetreden bij het verzenden van de e-mail.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      // Map status to appropriate database fields
      const updateData: any = {};
      
      if (status === 'lost') {
        updateData.opvolging_gestopt = true;
      } else {
        updateData.opvolging_gestopt = false;
        
        // Update lead score based on status
        if (status === 'new') updateData.lead_score = 10;
        if (status === 'contacted') updateData.lead_score = 30;
        if (status === 'proposal') updateData.lead_score = 50;
        if (status === 'won') updateData.lead_score = 90;
        if (status === 'on-hold') updateData.lead_score = 20;
      }
      
      // Update laatste_contactmoment
      updateData.laatste_contactmoment = new Date().toISOString();
      
      const { error } = await supabase
        .from('configurations')
        .update(updateData)
        .eq('id', leadId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Status bijgewerkt',
        description: 'De status van de lead is succesvol bijgewerkt.',
      });

      // Update local state
      setLeads(leads.map((lead) => {
        if (lead.id === leadId) {
          return {
            ...lead,
            status,
            lead_score: updateData.lead_score,
            latest_contact: updateData.laatste_contactmoment,
          };
        }
        return lead;
      }));
      
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast({
        title: 'Fout bij bijwerken van status',
        description: 'Er is een fout opgetreden bij het bijwerken van de status.',
        variant: 'destructive',
      });
    }
  };

  // Filter leads based on search term and status filter
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone && lead.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter ? lead.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  return {
    leads: filteredLeads,
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
  };
};
