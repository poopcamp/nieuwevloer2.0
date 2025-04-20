
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { type Appointment } from "@/hooks/useCalendarManagement";

interface NewAppointmentFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (appointment: Partial<Appointment>) => void;
  selectedDate?: Date;
  appointment?: Appointment | null;
}

export const NewAppointmentForm = ({
  isOpen,
  onOpenChange,
  onSave,
  selectedDate,
  appointment
}: NewAppointmentFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    address: '',
    time: '',
    type: 'site-visit' as Appointment['type']
  });

  // Load appointment data if editing an existing appointment
  useEffect(() => {
    if (appointment) {
      setFormData({
        title: appointment.title,
        clientName: appointment.clientName,
        address: appointment.address,
        time: appointment.time,
        type: appointment.type
      });
    } else {
      // Reset form when not editing
      setFormData({
        title: '',
        clientName: '',
        address: '',
        time: '',
        type: 'site-visit'
      });
    }
  }, [appointment, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedDate = selectedDate 
      ? selectedDate.toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0];
    
    if (appointment) {
      // If editing, preserve the ID
      onSave({
        ...formData,
        id: appointment.id,
        date: formattedDate,
      });
    } else {
      // New appointment
      onSave({
        ...formData,
        date: formattedDate,
      });
    }
    
    // Dialog will be closed by the parent component
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Afspraak bewerken" : "Nieuwe afspraak toevoegen"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titel</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="site-visit">Plaatsbezoek</option>
                  <option value="quote-discussion">Offerte bespreking</option>
                  <option value="tile-selection">Tegelkeuze</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Klant naam</label>
                <input 
                  type="text" 
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tijd</label>
                <input 
                  type="text" 
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="bv. 09:00 - 10:30" 
                  className="w-full p-2 border rounded" 
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Adres</label>
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded" 
                required
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Annuleren
              </Button>
              <Button type="submit">
                {appointment ? "Bijwerken" : "Afspraak opslaan"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
