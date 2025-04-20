
import React from "react";
import { Helmet } from "react-helmet-async";
import StatsCards from "@/components/admin/dashboard/StatsCards";
import LeadsChart from "@/components/admin/dashboard/LeadsChart";
import RecentLeadsCard from "@/components/admin/dashboard/RecentLeadsCard";
import ActivityCard from "@/components/admin/dashboard/ActivityCard";
import { CalendarView } from "@/components/admin/calendar/CalendarView";
import { useState } from "react";

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Sample data for the dashboard
  const statsData = {
    totalLeads: 128,
    totalConfigurations: 95,
    activeLeads: 42,
    completedProjects: 36
  };

  const weeklyChartData = [
    { name: "Ma", leads: 5 },
    { name: "Di", leads: 8 },
    { name: "Wo", leads: 12 },
    { name: "Do", leads: 7 },
    { name: "Vr", leads: 10 },
    { name: "Za", leads: 4 },
    { name: "Zo", leads: 2 },
  ];

  const recentLeads = [
    { 
      id: 1,
      name: "Jan Janssens",
      email: "jan.janssens@example.com",
      project_type: "Badkamer",
      created_at: "2023-05-15T10:30:00Z",
      phone: "+32 470 12 34 56"
    },
    {
      id: 2,
      name: "Marie Peeters",
      email: "marie.peeters@example.com",
      project_type: "Vloer",
      created_at: "2023-05-14T14:45:00Z",
      phone: "+32 471 23 45 67"
    },
    {
      id: 3,
      name: "Thomas Willems",
      email: "thomas.willems@example.com",
      project_type: "Keukenwand",
      created_at: "2023-05-13T09:15:00Z",
      phone: "+32 472 34 56 78"
    }
  ];

  const activities = [
    {
      id: 1,
      type: "view",
      user: "Jan Janssens",
      details: "Bekeken configuratie voor badkamer",
      time: "Vandaag, 10:30"
    },
    {
      id: 2,
      type: "view",
      user: "Marie Peeters",
      details: "Bekeken configuratie voor vloer",
      time: "Gisteren, 14:45"
    },
    {
      id: 3,
      type: "view",
      user: "Thomas Willems",
      details: "Bekeken configuratie voor keukenwand",
      time: "13 mei, 09:15"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | NieuweVloer.be</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 mt-2">Welkom in het beheerdersdashboard van NieuweVloer.be</p>
        </div>
        
        <StatsCards stats={statsData} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <LeadsChart weeklyData={weeklyChartData} />
          </div>
          <div>
            <CalendarView 
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RecentLeadsCard recentLeads={recentLeads} />
          <ActivityCard activities={activities} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
