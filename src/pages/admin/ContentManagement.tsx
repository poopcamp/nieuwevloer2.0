
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import HomeInfoManager from '@/components/admin/home/HomeInfoManager';
import CompanyInfoManager from '@/components/admin/home/CompanyInfoManager';
import HolidayDiscountManager from '@/components/admin/home/HolidayDiscountManager';
import ServicesManager from '@/components/admin/home/services/ServicesManager';
import ServicePagesManager from '@/components/admin/home/services/ServicePagesManager';
import GDPRRequestsManagement from './GDPRRequestsManagement';
import LogoManager from '@/components/admin/home/LogoManager';
import ShowroomVisitManager from '@/components/admin/home/ShowroomVisitManager';

const AdminContentPage = () => {
  const [activeTab, setActiveTab] = useState('home-info');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Content Beheer"
          backPath="/admin"
          backLabel="Terug naar dashboard"
        />

        <Card>
          <CardHeader>
            <CardTitle>Website Inhoud Beheren</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="home-info">Homepagina</TabsTrigger>
                <TabsTrigger value="services">Diensten (Home)</TabsTrigger>
                <TabsTrigger value="service-pages">Diensten Pagina</TabsTrigger>
                <TabsTrigger value="company-info">Bedrijfsinfo</TabsTrigger>
                <TabsTrigger value="logo">Logo</TabsTrigger>
                <TabsTrigger value="discounts">Kortingen</TabsTrigger>
                <TabsTrigger value="visit-options">Bezoekopties</TabsTrigger>
                <TabsTrigger value="gdpr-requests">GDPR Verzoeken</TabsTrigger>
              </TabsList>
              
              <TabsContent value="home-info">
                <HomeInfoManager />
              </TabsContent>
              
              <TabsContent value="services">
                <ServicesManager />
              </TabsContent>
              
              <TabsContent value="service-pages">
                <ServicePagesManager />
              </TabsContent>
              
              <TabsContent value="company-info">
                <CompanyInfoManager />
              </TabsContent>
              
              <TabsContent value="logo">
                <LogoManager />
              </TabsContent>
              
              <TabsContent value="discounts">
                <HolidayDiscountManager />
              </TabsContent>
              
              <TabsContent value="visit-options">
                <ShowroomVisitManager />
              </TabsContent>
              
              <TabsContent value="gdpr-requests">
                <GDPRRequestsManagement />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminContentPage;
