
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeftCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CalculatorPricingManager from '@/components/admin/tile-management/calculator/CalculatorPricingManager';
import TileFormatsManager from '@/components/admin/tile-management/calculator/TileFormatsManager';
import TileTypeManager from '@/components/admin/tile-management/calculator/TileTypeManager';
import ProjectTypesManager from '@/components/admin/tile-management/calculator/ProjectTypesManager';
import ExtraOptionsManager from '@/components/admin/tile-management/calculator/ExtraOptionsManager';
import SubmissionsManager from '@/components/admin/tile-management/calculator/SubmissionsManager';
import { useToast } from '@/hooks/use-toast';
import { calculatorService } from '@/services/calculatorService';

const ExtendedCalculatorManagement = () => {
  const [activeTab, setActiveTab] = useState('calculator');
  const [error, setError] = useState<string | null>(null);
  const [databaseStatus, setDatabaseStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const { toast } = useToast();

  // Check database connection on component mount
  useEffect(() => {
    const checkDatabaseAccess = async () => {
      try {
        const accessCheck = await calculatorService.checkAccess();
        if (accessCheck.success) {
          setDatabaseStatus('connected');
          setError(null);
        } else {
          setDatabaseStatus('error');
          setError(accessCheck.error || "Database access check failed");
          toast({
            title: "Database verbindingsfout",
            description: accessCheck.error || "Kan geen verbinding maken met de database",
            variant: "destructive"
          });
        }
      } catch (err: any) {
        setDatabaseStatus('error');
        setError(err.message);
        toast({
          title: "Database verbindingsfout",
          description: err.message,
          variant: "destructive"
        });
      }
    };

    checkDatabaseAccess();
  }, [toast]);

  const handleTabChange = (value: string) => {
    try {
      setActiveTab(value);
      setError(null);
    } catch (err: any) {
      console.error("Error changing tab:", err);
      setError("Er is een fout opgetreden bij het laden van dit tabblad. Probeer de pagina te verversen.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Uitgebreide Calculator Beheer | Admin</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Uitgebreide Calculator Beheer</h1>
          <p className="text-gray-600 mt-1">
            Beheer alle aspecten van de uitgebreide calculator
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/admin">
            <ArrowLeftCircle className="mr-2 h-4 w-4" />
            Terug naar Dashboard
          </Link>
        </Button>
      </div>

      {databaseStatus === 'connected' && (
        <Alert variant="success" className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Database verbinding succesvol. RLS-policies zijn correct ingesteld.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium">Database error:</div>
            <div>{error}</div>
            <div className="text-sm mt-2">
              De RLS policies zijn mogelijk niet correct ingesteld voor de calculator_rates tabel.
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Configureer de uitgebreide tegelcalculator</CardTitle>
          <CardDescription>
            Beheer prijzen, opties en instellingen voor de calculator.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-6 overflow-x-auto whitespace-nowrap w-full pb-1">
              <TabsTrigger value="calculator">Calculator Prijzen</TabsTrigger>
              <TabsTrigger value="formats">Tegelformaten</TabsTrigger>
              <TabsTrigger value="floor_types">Vloertegel Types</TabsTrigger>
              <TabsTrigger value="wall_types">Wandtegel Types</TabsTrigger>
              <TabsTrigger value="projects">Project Types</TabsTrigger>
              <TabsTrigger value="options">Extra Opties</TabsTrigger>
              <TabsTrigger value="submissions">Aanvragen</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculator">
              <CalculatorPricingManager />
            </TabsContent>
            
            <TabsContent value="formats">
              <TileFormatsManager />
            </TabsContent>
            
            <TabsContent value="floor_types">
              <TileTypeManager category="floor" />
            </TabsContent>
            
            <TabsContent value="wall_types">
              <TileTypeManager category="wall" />
            </TabsContent>
            
            <TabsContent value="projects">
              <ProjectTypesManager />
            </TabsContent>
            
            <TabsContent value="options">
              <ExtraOptionsManager />
            </TabsContent>
            
            <TabsContent value="submissions">
              <SubmissionsManager />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

export default ExtendedCalculatorManagement;
