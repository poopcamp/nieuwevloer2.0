
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

interface Activity {
  id: number;
  type: string;
  user: string;
  details: string;
  time: string;
}

interface ActivityCardProps {
  activities: Activity[];
}

const ActivityCard = ({ activities }: ActivityCardProps) => {
  return (
    <Card>
      <CardHeader className="p-3 sm:p-6 pb-0 sm:pb-0">
        <CardTitle className="text-base sm:text-lg">Recente Activiteit</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-3 sm:pt-4">
        {activities.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                <div className="bg-blue-500/10 p-2 rounded-full shrink-0">
                  <Eye className="h-4 w-4 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{activity.user}</p>
                  <p className="text-xs text-muted-foreground">{activity.details}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Geen recente activiteit gevonden</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
