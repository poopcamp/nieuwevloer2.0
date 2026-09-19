
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Tag, User2 } from "lucide-react";
import { Lead, statusColor, statusLabel } from "./types";
import { brandMeta } from "@/config/brands";

interface LeadDetailDialogProps {
  lead: Lead | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSendFollowUp: (lead: Lead, followUpType: string) => void;
  isSending: boolean;
}

const LeadDetailDialog = ({
  lead,
  isOpen,
  onOpenChange,
  onSendFollowUp,
  isSending
}: LeadDetailDialogProps) => {
  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Lead details: {lead.name}</span>
            <Badge variant="outline" className={brandMeta(lead.brand).badgeClass}>
              {brandMeta(lead.brand).label}
            </Badge>
            <Badge variant="outline" className={statusColor(lead.status)}>
              {statusLabel(lead.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overzicht</TabsTrigger>
            <TabsTrigger value="details">Project details</TabsTrigger>
            <TabsTrigger value="communication">Communicatie</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Contactgegevens</h3>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <User2 className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Project informatie</h3>
                <div className="space-y-1">
                  <div>
                    <span className="text-sm text-muted-foreground">Type:</span>{' '}
                    <span>{lead.project_type || "Algemene aanvraag"}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Aangemaakt op:</span>{' '}
                    <span>{new Date(lead.created_at).toLocaleDateString('nl-BE')}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Laatste contact:</span>{' '}
                    <span>{lead.latest_contact ? new Date(lead.latest_contact).toLocaleDateString('nl-BE') : 'Geen'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Prijs indicatie:</span>{' '}
                    <span>{lead.total_price 
                      ? `€${lead.total_price.toLocaleString('nl-BE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                      : 'Niet beschikbaar'
                    }</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {lead.tags && lead.tags.length > 0 ? (
                  lead.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">Geen tags</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Acties</h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onSendFollowUp(lead, 'reminder')}
                  disabled={isSending}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Stuur herinnering
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onSendFollowUp(lead, 'status_update')}
                  disabled={isSending}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Stuur status update
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="details" className="space-y-4 py-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Project Type</h3>
                    <p>{lead.project_type || "Algemene aanvraag"}</p>
                  </div>
                  {lead.square_meters !== undefined && (
                    <div>
                      <h3 className="font-medium">Oppervlakte</h3>
                      <p>{lead.square_meters} m²</p>
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">Notities</h3>
                    <p className="text-muted-foreground">
                      {lead.additional_notes || "Geen notities beschikbaar"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="communication" className="space-y-4 py-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Communicatie geschiedenis</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Communicatie geschiedenis nog niet beschikbaar.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">E-mails versturen</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onSendFollowUp(lead, 'reminder')}
                        disabled={isSending}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Herinnering
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onSendFollowUp(lead, 'status_update')}
                        disabled={isSending}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Status update
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onSendFollowUp(lead, 'abandoned_cart')}
                        disabled={isSending}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Configuratie herinnering
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailDialog;
