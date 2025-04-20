
import { Link, useLocation } from 'react-router-dom';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface AdminBreadcrumbsProps {
  items?: BreadcrumbItem[];
  currentPage?: string;
}

const AdminBreadcrumbs = ({ 
  items = [], 
  currentPage 
}: AdminBreadcrumbsProps) => {
  const location = useLocation();
  
  // Generate breadcrumbs based on path if not provided
  const getBreadcrumbsFromPath = () => {
    if (items.length > 0) return items;
    
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    let currentPath = '';
    
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      
      // Skip the last path as it will be the current page
      if (index < paths.length - 1) {
        breadcrumbs.push({
          label: path.charAt(0).toUpperCase() + path.slice(1),
          path: currentPath
        });
      }
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbItems = getBreadcrumbsFromPath();
  const pageName = currentPage || location.pathname.split('/').filter(Boolean).pop()?.charAt(0).toUpperCase() + location.pathname.split('/').filter(Boolean).pop()?.slice(1);
  
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/admin">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbLink asChild>
              <Link to={item.path}>{item.label}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
        
        <BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>{pageName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AdminBreadcrumbs;
