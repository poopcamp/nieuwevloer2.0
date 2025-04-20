
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Mail, Phone, Eye, User2 } from "lucide-react";
import { Lead, LEAD_STATUSES } from "./types";

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  onViewLead: (lead: Lead) => void;
  onUpdateStatus: (leadId: string, status: string) => void;
  onSendFollowUp: (lead: Lead, followUpType: string) => void;
  isSending: boolean;
}

const LeadsTable = ({ 
  leads, 
  isLoading, 
  onViewLead, 
  onUpdateStatus, 
  onSendFollowUp,
  isSending 
}: LeadsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Naam</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Aangemaakt</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prijs</TableHead>
            <TableHead className="w-[120px]">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <User2 className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{lead.phone}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {lead.project_type || "Algemene aanvraag"}
              </TableCell>
              <TableCell>
                {new Date(lead.created_at).toLocaleDateString('nl-BE')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={`h-7 ${
                        LEAD_STATUSES.find(s => s.value === lead.status)?.color || 'bg-gray-100 text-gray-800'
                      }`}
                      size="sm"
                    >
                      {LEAD_STATUSES.find(s => s.value === lead.status)?.label || 'Nieuw'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {LEAD_STATUSES.map((status) => (
                      <DropdownMenuItem 
                        key={status.value}
                        onClick={() => onUpdateStatus(lead.id, status.value)}
                      >
                        {status.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                {lead.total_price 
                  ? `€${lead.total_price.toLocaleString('nl-BE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                  : '-'
                }
              </TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem 
                        onClick={() => onSendFollowUp(lead, 'reminder')}
                        disabled={isSending}
                      >
                        Herinnering
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onSendFollowUp(lead, 'status_update')}
                        disabled={isSending}
                      >
                        Status update
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onSendFollowUp(lead, 'abandoned_cart')}
                        disabled={isSending}
                      >
                        Configuratie herinnering
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewLead(lead)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadsTable;
