
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface RecentLead {
  id: number | string;
  name: string;
  email: string;
  project_type: string;
  created_at: string;
  phone?: string;
}

interface RecentLeadsCardProps {
  recentLeads: RecentLead[];
}

const RecentLeadsCard = ({ recentLeads }: RecentLeadsCardProps) => {
  return (
    <Card>
      <CardHeader className="p-3 sm:p-6 pb-0 sm:pb-0">
        <CardTitle className="text-base sm:text-lg">Recente Leads</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-3 sm:pt-4">
        {recentLeads.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                <div className="bg-primary/10 p-2 rounded-full shrink-0">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{lead.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {lead.project_type || 'Algemene aanvraag'} - {new Date(lead.created_at).toLocaleDateString('nl-BE')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Geen recente leads gevonden</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentLeadsCard;
