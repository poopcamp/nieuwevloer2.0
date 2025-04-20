
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeftCircle, Home, Save, PlusCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const SeoManagementPage = () => {
  const [activeTab, setActiveTab] = useState("meta-tags");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">SEO Beheer</h1>
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

      <Card>
        <CardHeader>
          <CardTitle>Website SEO Optimalisatie</CardTitle>
          <CardDescription>
            Beheer en optimaliseer de SEO instellingen van uw website voor betere vindbaarheid in zoekmachines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="meta-tags">Meta Tags</TabsTrigger>
              <TabsTrigger value="local-seo">Lokale SEO</TabsTrigger>
              <TabsTrigger value="schema-markup">Schema Markup</TabsTrigger>
              <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
            </TabsList>
            
            <TabsContent value="meta-tags">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="homepage-title">Homepage Titel</Label>
                    <Input 
                      id="homepage-title" 
                      defaultValue="NieuweVloer.be | Professionele tegelplaatsing & badkamerrenovatie" 
                    />
                    <p className="text-xs text-gray-500">Aanbevolen lengte: 50-60 tekens</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="homepage-description">Homepage Meta Beschrijving</Label>
                    <Textarea 
                      id="homepage-description" 
                      defaultValue="Professionele tegelplaatsing en badkamerrenovatie door ervaren vakmensen. Vraag een vrijblijvende prijsofferte aan via onze online configurator." 
                    />
                    <p className="text-xs text-gray-500">Aanbevolen lengte: 150-160 tekens</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="configurator-title">Configurator Titel</Label>
                    <Input 
                      id="configurator-title" 
                      defaultValue="Bereken uw prijsindicatie | NieuweVloer.be" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="configurator-description">Configurator Meta Beschrijving</Label>
                    <Textarea 
                      id="configurator-description" 
                      defaultValue="Bereken eenvoudig een prijsindicatie voor uw tegelproject. Vloeren, badkamers, wanden en meer. Directe prijsindicatie zonder verplichtingen." 
                    />
                  </div>
                </div>
                
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Opslaan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Wijzigingen Opslaan
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="local-seo">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Bedrijfsnaam</Label>
                  <Input 
                    id="business-name" 
                    defaultValue="NieuweVloer.be" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="business-address">Bedrijfsadres</Label>
                  <Textarea 
                    id="business-address" 
                    defaultValue="Industrieweg 10, 9990 Maldegem, België" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="service-radius">Service Radius (km)</Label>
                  <Input 
                    id="service-radius" 
                    type="number" 
                    defaultValue="30" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="service-locations">Service Locaties</Label>
                  <Textarea 
                    id="service-locations" 
                    defaultValue="Maldegem, Eeklo, Knokke, Brugge, Gent, Aalter, Zomergem, Waarschoot" 
                  />
                  <p className="text-xs text-gray-500">Scheid locaties met een komma</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="google-business" defaultChecked />
                  <Label htmlFor="google-business">Google Business Profiel Geoptimaliseerd</Label>
                </div>
                
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Opslaan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Wijzigingen Opslaan
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="schema-markup">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Switch id="enable-localBusiness" defaultChecked />
                  <Label htmlFor="enable-localBusiness">LocalBusiness Schema Inschakelen</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="enable-product" defaultChecked />
                  <Label htmlFor="enable-product">Product Schema Inschakelen</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="enable-breadcrumbs" defaultChecked />
                  <Label htmlFor="enable-breadcrumbs">Breadcrumbs Schema Inschakelen</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="enable-faq" defaultChecked />
                  <Label htmlFor="enable-faq">FAQ Schema Inschakelen</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rating-value">Gemiddelde Beoordeling (1-5)</Label>
                  <Input 
                    id="rating-value" 
                    type="number" 
                    min="1" 
                    max="5" 
                    step="0.1" 
                    defaultValue="4.8" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rating-count">Aantal Beoordelingen</Label>
                  <Input 
                    id="rating-count" 
                    type="number" 
                    defaultValue="57" 
                  />
                </div>
                
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Opslaan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Wijzigingen Opslaan
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="sitemap">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Switch id="auto-sitemap" defaultChecked />
                  <Label htmlFor="auto-sitemap">Automatisch Sitemap Genereren</Label>
                </div>
                
                <div className="space-y-2">
                  <Label>Laatste Sitemap Update</Label>
                  <div className="text-sm text-gray-700 font-medium">
                    14 April 2025, 09:24
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Sitemap URL</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      value="https://nieuwevloer.be/sitemap.xml" 
                      readOnly
                      className="bg-gray-50"
                    />
                    <Button variant="outline" onClick={() => navigator.clipboard.writeText("https://nieuwevloer.be/sitemap.xml")}>
                      Kopiëren
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="submit-search-engines" defaultChecked />
                  <Label htmlFor="submit-search-engines">Automatisch indienen bij zoekmachines</Label>
                </div>
                
                <div className="pt-4 flex space-x-2">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Opslaan...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Wijzigingen Opslaan
                      </>
                    )}
                  </Button>
                  <Button variant="outline">
                    Sitemap Nu Genereren
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="keywords">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="primary-keywords">Primaire Keywords</Label>
                  <Textarea 
                    id="primary-keywords" 
                    defaultValue="tegelplaatsing, vloerwerken, badkamerrenovatie, tegelzetter Maldegem, vloerder Eeklo, tegels plaatsen Knokke" 
                  />
                  <p className="text-xs text-gray-500">Scheid keywords met een komma</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondary-keywords">Secundaire Keywords</Label>
                  <Textarea 
                    id="secondary-keywords" 
                    defaultValue="natuursteen vloeren, keramische tegels, grootformaat tegels, badkamer betegelen, vloerverwarming tegels, douche betegelen" 
                  />
                  <p className="text-xs text-gray-500">Scheid keywords met een komma</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="local-keywords">Lokale Keywords</Label>
                  <Textarea 
                    id="local-keywords" 
                    defaultValue="tegelzetter Maldegem, vloerder Eeklo, badkamerrenovatie Knokke, tegels plaatsen Brugge, vloerwerken Gent, tegelwerken Aalter" 
                  />
                  <p className="text-xs text-gray-500">Scheid keywords met een komma</p>
                </div>
                
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Opslaan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Wijzigingen Opslaan
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeoManagementPage;
