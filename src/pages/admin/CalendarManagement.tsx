
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CalendarManagementContent from '@/components/admin/calendar/CalendarManagementContent';

const CalendarManagement = () => {
  return (
    <>
      <Helmet>
        <title>Kalender Beheer | Admin</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kalender Beheer</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan en beheer uw afspraken</CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarManagementContent />
        </CardContent>
      </Card>
    </>
  );
};

export default CalendarManagement;
