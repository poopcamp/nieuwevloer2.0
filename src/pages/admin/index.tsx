
import { Helmet } from "react-helmet-async";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/auth-context";
import ShowroomVisitManager from "@/components/admin/home/ShowroomVisitManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import QuickActionsSection from "@/components/admin/dashboard/quickActions/QuickActionsSection";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | NieuweVloer.be</title>
      </Helmet>
      
      <AdminLayout>
        <div className="space-y-6">
          <div className="grid gap-5 lg:grid-cols-3 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Welkom, {user?.email || 'Admin'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Beheer instellingen en content van uw website</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Recente leads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Dashboard wordt geladen...</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Statistieken</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </CardContent>
            </Card>
          </div>
          
          <QuickActionsSection />
          
          <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
            <ShowroomVisitManager />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
