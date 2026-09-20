
import { createContext, useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle, Home } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminShellContext = createContext(false);

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const nested = useContext(AdminShellContext);
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  if (nested) {
    return <>{children}</>;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  void location;

  return (
    <AdminShellContext.Provider value={true}>
      <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
            userEmail={user?.email || ""}
          />

          <TooltipProvider>
            {isMobile && (
              <div className="flex justify-end space-x-2 bg-slate-900 p-2 text-white">
                <Button variant="outline" size="sm" className="h-8 gap-1 py-1 border-white/20 bg-transparent text-white" asChild>
                  <Link to="/admin">
                    <ArrowLeftCircle className="h-3 w-3" />
                    Overzicht
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1 py-1 border-white/20 bg-transparent text-white" asChild>
                  <Link to="/">
                    <Home className="h-3 w-3" />
                    Site
                  </Link>
                </Button>
              </div>
            )}

            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-4 dark:bg-slate-950 sm:p-6">
              <div className="mx-auto max-w-6xl">{children}</div>
            </main>
          </TooltipProvider>
        </div>
      </div>
    </AdminShellContext.Provider>
  );
};

export default AdminLayout;
