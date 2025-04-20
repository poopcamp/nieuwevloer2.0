
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { getCompanyInfo, updateCompanyInfo } from "@/utils/companySettingsHelpers";
import { CompanyInfo } from "@/utils/supabase/customTypes";
import { Loader2, Save, ShieldAlert, ArrowLeftCircle, Home } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "react-router-dom";

const CompanyInfoManager = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    setLoading(true);
    try {
      const data = await getCompanyInfo();
      setCompanyInfo(data);
    } catch (error: any) {
      console.error('Error fetching company info:', error);
      toast({
        title: "Fout bij ophalen",
        description: "Er is een fout opgetreden bij het ophalen van de bedrijfsgegevens.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CompanyInfo, value: string | boolean) => {
    if (!companyInfo) return;
    
    setCompanyInfo({
      ...companyInfo,
      [field]: value
    });
  };

  const saveCompanyInfo = async () => {
    if (!companyInfo || !isAdmin) return;
    
    setSaving(true);
    try {
      // Log de data die we gaan verzenden om te debuggen
      console.log('Sending company info to save:', companyInfo);
      
      const success = await updateCompanyInfo(companyInfo);
      
      if (!success) {
        throw new Error("Er is een fout opgetreden bij het opslaan van de bedrijfsgegevens.");
      }

      toast({
        title: "Opgeslagen",
        description: "Bedrijfsgegevens zijn succesvol bijgewerkt.",
      });
      
      // Ververs de gegevens om te controleren of de updates daadwerkelijk zijn opgeslagen
      await fetchCompanyInfo();
    } catch (error: any) {
      console.error('Error saving company info:', error);
      toast({
        title: "Fout bij opslaan",
        description: error.message || "Er is een fout opgetreden bij het opslaan van de bedrijfsgegevens.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin && !loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Beheer Bedrijfsgegevens</CardTitle>
          <CardDescription>
            Bewerk de bedrijfsgegevens die worden weergegeven op de website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <ShieldAlert className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Toegang geweigerd</h3>
            <p className="text-muted-foreground max-w-md">
              U heeft geen beheerdersrechten om bedrijfsgegevens te wijzigen. Neem contact op met een administrator voor toegang.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4">
        <div className="flex items-center justify-between w-full">
          <CardTitle>Beheer Bedrijfsgegevens</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              asChild
            >
              <Link to="/admin">
                <ArrowLeftCircle className="h-4 w-4" />
                Terug
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              asChild
            >
              <Link to="/">
                <Home className="h-4 w-4" />
                Homepagina
              </Link>
            </Button>
          </div>
        </div>
        <CardDescription>
          Bewerk de bedrijfsgegevens die worden weergegeven op de website.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : companyInfo ? (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Bedrijfsnaam</Label>
                  <Input 
                    id="company-name"
                    value={companyInfo.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-address">Adres</Label>
                  <Input 
                    id="company-address"
                    value={companyInfo.company_address}
                    onChange={(e) => handleInputChange('company_address', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-vat">BTW-nummer</Label>
                  <Input 
                    id="company-vat"
                    value={companyInfo.company_vat}
                    onChange={(e) => handleInputChange('company_vat', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-email">E-mail</Label>
                  <Input 
                    id="company-email"
                    type="email"
                    value={companyInfo.company_email}
                    onChange={(e) => handleInputChange('company_email', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Telefoonnummer</Label>
                  <Input 
                    id="company-phone"
                    value={companyInfo.company_phone}
                    onChange={(e) => handleInputChange('company_phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-end pt-4">
              <Button 
                onClick={saveCompanyInfo} 
                disabled={saving || !isAdmin}
                className="gap-2"
                style={{
                  backgroundColor: '#00847E',
                  borderColor: '#00847E' 
                }}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Bedrijfsgegevens Opslaan
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default CompanyInfoManager;
