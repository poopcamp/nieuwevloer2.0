
import { useState } from 'react';

// Define appointment type for better type safety
export interface Appointment {
  id: string;
  title: string;
  clientName: string;
  address: string;
  date: string;
  time: string;
  type: 'site-visit' | 'quote-discussion' | 'tile-selection';
}

// Mock data - in a real app this would come from Supabase
const APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    title: 'Plaatsbezoek',
    clientName: 'Jan Janssens',
    address: 'Kerkstraat 15, 9990 Maldegem',
    date: '2025-04-04',
    time: '09:00 - 10:30',
    type: 'site-visit'
  },
  {
    id: '2',
    title: 'Offerte bespreking',
    clientName: 'Piet Peters',
    address: 'Stationsstraat 8, 8000 Brugge',
    date: '2025-04-04',
    time: '14:00 - 15:00',
    type: 'quote-discussion'
  },
  {
    id: '3',
    title: 'Tegelkeuze afspraak',
    clientName: 'Maria Maes',
    address: 'Kantoor Maldegem',
    date: '2025-04-08',
    time: '11:00 - 12:00',
    type: 'tile-selection'
  }
];

export const useCalendarManagement = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(APPOINTMENTS);
  
  // Format date to YYYY-MM-DD for filtering appointments
  const formattedSelectedDate = selectedDate ? 
    selectedDate.toISOString().split('T')[0] : '';
  
  // Filter appointments for selected date
  const appointmentsForDay = appointments.filter(
    appointment => appointment.date === formattedSelectedDate
  );
  
  // Helper function to get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'site-visit':
        return 'bg-blue-100 text-blue-800';
      case 'quote-discussion':
        return 'bg-green-100 text-green-800';
      case 'tile-selection':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get type name
  const getTypeName = (type: string) => {
    switch (type) {
      case 'site-visit':
        return 'Plaatsbezoek';
      case 'quote-discussion':
        return 'Offerte bespreking';
      case 'tile-selection':
        return 'Tegelkeuze';
      default:
        return type;
    }
  };

  // Functions to handle appointment creation
  const handleAddAppointment = (appointment: Partial<Appointment>) => {
    const newAppointment = {
      ...appointment,
      id: Date.now().toString(), // Simple ID generation
    } as Appointment;
    
    setAppointments(prev => [...prev, newAppointment]);
    setIsNewAppointmentOpen(false);
    setSelectedAppointment(null);
  };
  
  // Function to handle appointment editing
  const handleEditAppointment = (updatedAppointment: Partial<Appointment>) => {
    if (!selectedAppointment) return;
    
    const newAppointments = appointments.map(appointment => 
      appointment.id === selectedAppointment.id 
        ? { ...appointment, ...updatedAppointment } 
        : appointment
    );
    
    setAppointments(newAppointments);
    setIsNewAppointmentOpen(false);
    setSelectedAppointment(null);
  };
  
  // Function to handle appointment deletion
  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointments(prev => 
      prev.filter(appointment => appointment.id !== appointmentId)
    );
  };

  return {
    selectedDate,
    setSelectedDate,
    appointmentsForDay,
    selectedAppointment,
    setSelectedAppointment,
    isDetailsOpen,
    setIsDetailsOpen,
    isNewAppointmentOpen,
    setIsNewAppointmentOpen,
    getTypeColor,
    getTypeName,
    handleAddAppointment,
    handleEditAppointment,
    handleDeleteAppointment
  };
};
