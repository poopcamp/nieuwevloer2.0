
import React from 'react';
import AdminLayout from './AdminLayout';
import AdminPageHeader from './AdminPageHeader';

interface AdminPageWrapperProps {
  title: string;
  backPath?: string;
  backLabel?: string;
  showHomeLink?: boolean;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  breadcrumbs?: { label: string; path: string; }[];
}

const AdminPageWrapper = ({
  title,
  backPath = '/admin',
  backLabel = 'Terug naar dashboard',
  showHomeLink = true,
  headerActions,
  children,
  breadcrumbs
}: AdminPageWrapperProps) => {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <AdminPageHeader
          title={title}
          backPath={backPath}
          backLabel={backLabel}
          showHomeLink={showHomeLink}
          breadcrumbs={breadcrumbs}
        >
          {headerActions}
        </AdminPageHeader>
        
        {children}
      </div>
    </AdminLayout>
  );
};

export default AdminPageWrapper;
