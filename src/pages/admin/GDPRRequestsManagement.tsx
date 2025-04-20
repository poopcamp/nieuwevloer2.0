import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GDPRRequest, GDPRRequestDB, GDPRRequestStatus } from "@/types/gdpr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import {
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

const requestTypeLabels: Record<string, string> = {
  access: "Inzage in gegevens",
  rectification: "Correctie van gegevens",
  deletion: "Verwijdering van gegevens",
  restriction: "Beperking van verwerking",
  portability: "Gegevensoverdraagbaarheid",
  objection: "Bezwaar tegen verwerking",
  other: "Ander verzoek"
};

const GDPRRequestsManagement = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<GDPRRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<GDPRRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<GDPRRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState<string>("");

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(req => req.status === activeFilter));
    }
  }, [activeFilter, requests]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gdpr_requests")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        const mappedData: GDPRRequest[] = (data as GDPRRequestDB[]).map(item => ({
          ...item,
          status: (item.status === "pending" || 
                  item.status === "rejected" || 
                  item.status === "in_progress" || 
                  item.status === "completed") 
                  ? item.status as GDPRRequestStatus
                  : "pending"
        }));
        
        setRequests(mappedData);
        setFilteredRequests(mappedData);
      }
    } catch (error: any) {
      console.error("Error fetching GDPR requests:", error);
      toast({
        title: "Fout bij laden",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (request: GDPRRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || "");
    setNewStatus(request.status);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedRequest(null);
    setAdminNotes("");
    setNewStatus("");
  };

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    try {
      const updateData: any = {
        admin_notes: adminNotes,
        status: newStatus,
      };
      
      if (newStatus === "completed" && selectedRequest.status !== "completed") {
        updateData.completed_at = new Date().toISOString();
      } else if (newStatus !== "completed") {
        updateData.completed_at = null;
      }

      const { error } = await supabase
        .from("gdpr_requests")
        .update(updateData)
        .eq("id", selectedRequest.id);

      if (error) throw error;

      toast({
        title: "Verzoek bijgewerkt",
        description: "Het GDPR-verzoek is succesvol bijgewerkt.",
      });

      fetchRequests();
      handleCloseDetail();
    } catch (error) {
      console.error("Error updating GDPR request:", error);
      toast({
        title: "Fout bij het bijwerken",
        description: "Er is een fout opgetreden bij het bijwerken van het GDPR-verzoek.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">In afwachting</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In behandeling</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Afgehandeld</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Afgewezen</Badge>;
      default:
        return <Badge variant="outline">Onbekend</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "in_progress":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy 'om' HH:mm", { locale: nl });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">GDPR Verzoeken</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Beheer GDPR verzoeken</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeFilter} onValueChange={setActiveFilter}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">Alle verzoeken</TabsTrigger>
              <TabsTrigger value="pending">In afwachting</TabsTrigger>
              <TabsTrigger value="in_progress">In behandeling</TabsTrigger>
              <TabsTrigger value="completed">Afgehandeld</TabsTrigger>
              <TabsTrigger value="rejected">Afgewezen</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeFilter}>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Naam</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Type verzoek</TableHead>
                      <TableHead className="text-right">Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Laden...
                        </TableCell>
                      </TableRow>
                    ) : filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Geen GDPR verzoeken gevonden.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            {getStatusBadge(request.status)}
                          </TableCell>
                          <TableCell>
                            {formatDate(request.created_at)}
                          </TableCell>
                          <TableCell>{request.name}</TableCell>
                          <TableCell>{request.email}</TableCell>
                          <TableCell>{requestTypeLabels[request.request_type] || request.request_type}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenDetail(request)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              GDPR Verzoek {selectedRequest && getStatusIcon(selectedRequest.status)}
            </DialogTitle>
            <DialogDescription>
              Details van het GDPR verzoek en beheeropties
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Ingediend op</h3>
                  <p>{formatDate(selectedRequest.created_at)}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Status</h3>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm">Contactgegevens</h3>
                <p className="mt-1">{selectedRequest.name} ({selectedRequest.email})</p>
                {selectedRequest.phone && <p className="text-sm text-muted-foreground">{selectedRequest.phone}</p>}
              </div>
              
              <div>
                <h3 className="font-medium text-sm">Type verzoek</h3>
                <p className="mt-1">{requestTypeLabels[selectedRequest.request_type] || selectedRequest.request_type}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm">Bericht van gebruiker</h3>
                <div className="mt-1 p-3 border rounded-md bg-gray-50">
                  <p className="whitespace-pre-wrap">{selectedRequest.message}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium">Beheeropties</h3>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm">
                      Status bijwerken
                    </label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecteer status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">In afwachting</SelectItem>
                        <SelectItem value="in_progress">In behandeling</SelectItem>
                        <SelectItem value="completed">Afgehandeld</SelectItem>
                        <SelectItem value="rejected">Afgewezen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="completed-at" className="text-sm">
                      Afgehandeld op
                    </label>
                    <p className="text-sm p-2 border rounded-md bg-gray-50">
                      {selectedRequest.completed_at ? 
                        formatDate(selectedRequest.completed_at) : 
                        "Nog niet afgehandeld"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <label htmlFor="admin-notes" className="text-sm">
                    Interne notities (alleen zichtbaar voor beheerders)
                  </label>
                  <Textarea
                    id="admin-notes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Voeg notities toe over de afhandeling van dit verzoek..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDetail}>
              Annuleren
            </Button>
            <Button onClick={handleUpdateRequest}>
              Wijzigingen opslaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GDPRRequestsManagement;
