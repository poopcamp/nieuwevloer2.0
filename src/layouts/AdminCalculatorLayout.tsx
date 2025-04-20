
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Card } from '@/components/ui/card';

// This layout component provides consistent styling for calculator admin pages
const AdminCalculatorLayout = () => {
  return (
    <div className="space-y-6">
      <Outlet />
    </div>
  );
};

export default AdminCalculatorLayout;
