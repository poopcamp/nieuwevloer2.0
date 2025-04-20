
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface AdminBreadcrumbsProps {
  items: BreadcrumbItem[];
  currentPage: string;
}

const AdminBreadcrumbs = ({ items, currentPage }: AdminBreadcrumbsProps) => {
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/admin" className="flex items-center hover:text-primary transition-colors">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {items.map((item) => (
          <BreadcrumbItem key={item.path}>
            <BreadcrumbSeparator />
            <BreadcrumbLink asChild>
              <Link 
                to={item.path}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
        
        {currentPage && (
          <BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>{currentPage}</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AdminBreadcrumbs;
