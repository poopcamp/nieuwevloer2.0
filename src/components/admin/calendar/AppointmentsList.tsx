
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, User, MapPin } from "lucide-react";
import { type Appointment } from "@/hooks/useCalendarManagement";

interface AppointmentsListProps {
  date: Date | undefined;
  appointments: Appointment[];
  onViewDetails: (appointment: Appointment) => void;
  getTypeColor: (type: string) => string;
  getTypeName: (type: string) => string;
}

export const AppointmentsList = ({ 
  date, 
  appointments, 
  onViewDetails,
  getTypeColor,
  getTypeName
}: AppointmentsListProps) => {
  const formattedDate = date?.toLocaleDateString('nl-BE', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  });

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <CalendarDays className="mr-2 h-5 w-5" />
          Afspraken voor {formattedDate}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Geen afspraken voor deze dag
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-4 rounded-lg border bg-card shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1 mr-4 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-lg truncate">{appointment.title}</h3>
                      <Badge className={`${getTypeColor(appointment.type)}`}>
                        {getTypeName(appointment.type)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{appointment.clientName}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>{appointment.time}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{appointment.address}</span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onViewDetails(appointment)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
