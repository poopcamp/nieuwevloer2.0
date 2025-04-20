
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCalendarManagement } from '@/hooks/useCalendarManagement';
import { CalendarView } from '@/components/admin/calendar/CalendarView';
import { AppointmentsList } from '@/components/admin/calendar/AppointmentsList';
import { AppointmentDetails } from '@/components/admin/calendar/AppointmentDetails';
import { NewAppointmentForm } from '@/components/admin/calendar/NewAppointmentForm';
import { useToast } from '@/hooks/use-toast';

const CalendarManagementContent = () => {
  const {
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
  } = useCalendarManagement();
  
  const { toast } = useToast();
  
  // Handler for opening appointment details
  const handleViewAppointmentDetails = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  };

  // Handler for opening edit form with current appointment data
  const handleEditAppointmentOpen = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsNewAppointmentOpen(true);
  };

  // Handler for deleting an appointment
  const handleDeleteAppointmentWithToast = (id: string) => {
    handleDeleteAppointment(id);
    toast({
      title: "Afspraak verwijderd",
      description: "De afspraak is succesvol verwijderd.",
    });
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Agenda</h1>
        <Button size="sm" className="ml-auto" onClick={() => {
          setSelectedAppointment(null); // Ensure we're creating new, not editing
          setIsNewAppointmentOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Nieuwe afspraak
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Card */}
        <div className="lg:col-span-5 xl:col-span-4">
          <CalendarView 
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>

        {/* Appointments Card */}
        <div className="lg:col-span-7 xl:col-span-8">
          <AppointmentsList 
            date={selectedDate}
            appointments={appointmentsForDay}
            onViewDetails={handleViewAppointmentDetails}
            getTypeColor={getTypeColor}
            getTypeName={getTypeName}
          />
        </div>
      </div>

      {/* Appointment details dialog */}
      <AppointmentDetails 
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        appointment={selectedAppointment}
        getTypeColor={getTypeColor}
        getTypeName={getTypeName}
        onEdit={handleEditAppointmentOpen}
        onDelete={handleDeleteAppointmentWithToast}
      />

      {/* New/Edit appointment form dialog */}
      <NewAppointmentForm 
        isOpen={isNewAppointmentOpen}
        onOpenChange={setIsNewAppointmentOpen}
        onSave={selectedAppointment ? handleEditAppointment : handleAddAppointment}
        selectedDate={selectedDate}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default CalendarManagementContent;
