
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeftCircle, Home } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { TooltipProvider } from '@/components/ui/tooltip';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { user } = useAuth();
  const location = useLocation();
  
  // Adjust sidebar when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check if current path is a direct child of /admin
  const isChildOfAdmin = location.pathname.split('/').filter(Boolean).length === 2 && 
                         location.pathname.startsWith('/admin/');
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300`}>
        <AdminHeader 
          toggleSidebar={toggleSidebar} 
          sidebarOpen={sidebarOpen} 
          userEmail={user?.email || ''} 
        />
        
        <TooltipProvider>
          {isMobile && (
            <div className="flex justify-end space-x-2 p-2 bg-white dark:bg-gray-950 shadow-sm">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 py-1 h-8"
                asChild
              >
                <Link to="/admin">
                  <ArrowLeftCircle className="h-3 w-3" />
                  Admin
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 py-1 h-8"
                asChild
              >
                <Link to="/">
                  <Home className="h-3 w-3" />
                  Home
                </Link>
              </Button>
            </div>
          )}
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
            {children}
          </main>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AdminLayout;
