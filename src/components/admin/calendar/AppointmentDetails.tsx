
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { User, MapPin, Edit, Trash2 } from "lucide-react";
import { type Appointment } from "@/hooks/useCalendarManagement";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AppointmentDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  getTypeColor: (type: string) => string;
  getTypeName: (type: string) => string;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointmentId: string) => void;
}

export const AppointmentDetails = ({
  isOpen,
  onOpenChange,
  appointment,
  getTypeColor,
  getTypeName,
  onEdit,
  onDelete
}: AppointmentDetailsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  if (!appointment) return null;

  const handleEdit = () => {
    if (onEdit && appointment) {
      onEdit(appointment);
      onOpenChange(false);
    } else {
      toast({
        title: "Bewerken niet beschikbaar",
        description: "Deze functie is momenteel in ontwikkeling.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (onDelete && appointment) {
      onDelete(appointment.id);
      setIsDeleteDialogOpen(false);
      onOpenChange(false);
      toast({
        title: "Afspraak verwijderd",
        description: "De afspraak is succesvol verwijderd.",
        variant: "success"
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Afspraak details</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <h3 className="text-lg font-medium mb-2">{appointment.title}</h3>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Badge className={`${getTypeColor(appointment.type)} mr-2`}>
                  {getTypeName(appointment.type)}
                </Badge>
                <span className="text-sm text-muted-foreground">{appointment.time}</span>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-primary" />
                  <span>{appointment.clientName}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-primary" />
                  <span>{appointment.address}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Bewerken
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Verwijderen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Afspraak verwijderen</AlertDialogTitle>
            <AlertDialogDescription>
              Weet je zeker dat je deze afspraak wilt verwijderen? 
              Deze actie kan niet ongedaan worden gemaakt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Verwijderen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
