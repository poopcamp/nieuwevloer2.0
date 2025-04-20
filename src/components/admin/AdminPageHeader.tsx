
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeftCircle, Home } from 'lucide-react';
import AdminBreadcrumbs from './common/AdminBreadcrumbs';

interface AdminPageHeaderProps {
  title: string;
  backPath?: string;
  backLabel?: string;
  showHomeLink?: boolean;
  children?: React.ReactNode;
  breadcrumbs?: { label: string; path: string; }[];
}

const AdminPageHeader = ({
  title,
  backPath = '/admin',
  backLabel = 'Terug naar dashboard',
  showHomeLink = true,
  children,
  breadcrumbs = []
}: AdminPageHeaderProps) => {
  return (
    <div className="space-y-2 mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <AdminBreadcrumbs 
          items={breadcrumbs}
          currentPage={title}
        />
      )}
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex space-x-2">
          {children}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            asChild
          >
            <Link to={backPath}>
              <ArrowLeftCircle className="h-4 w-4" />
              {backLabel}
            </Link>
          </Button>
          
          {showHomeLink && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              asChild
            >
              <Link to="/">
                <Home className="h-4 w-4" />
                Website
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPageHeader;
