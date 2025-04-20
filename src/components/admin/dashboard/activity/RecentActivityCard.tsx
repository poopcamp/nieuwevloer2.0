
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RecentActivityCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Laatste Wijzigingen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-l-4 border-primary pl-4 py-1">
            <p className="font-medium">Hero afbeelding bijgewerkt</p>
            <p className="text-sm text-muted-foreground">Gisteren om 14:23</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-1">
            <p className="font-medium">Nieuw blog artikel gepubliceerd</p>
            <p className="text-sm text-muted-foreground">25 juni 2023 om 09:45</p>
          </div>
          <div className="border-l-4 border-amber-500 pl-4 py-1">
            <p className="font-medium">Prijsinformatie bijgewerkt</p>
            <p className="text-sm text-muted-foreground">23 juni 2023 om 16:12</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
