
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, Upload } from 'lucide-react';
import Logo from '@/components/Logo';

const LogoManager = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // In een echte implementatie zou dit het logo uit de database halen
    // maar voor nu gebruiken we het statische logo
    const fetchLogo = async () => {
      try {
        setLoading(true);
        // Dit is een placeholder voor het ophalen van het logo uit de database
        // In een werkelijke implementatie zou je dit uit een instellingen tabel halen
        setLogoUrl('/icon.svg');
      } catch (error) {
        console.error('Error fetching logo:', error);
        toast({
          title: 'Fout bij ophalen logo',
          description: 'Er is een fout opgetreden bij het ophalen van het logo.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, [toast]);

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    if (!file.type.includes('svg') && !file.type.includes('image')) {
      toast({
        title: 'Ongeldig bestandsformaat',
        description: 'Upload een SVG of afbeeldingsbestand.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // In een echte implementatie zou je het logo uploaden naar storage
      // en de URL opslaan in de database
      toast({
        title: 'Logo uploaden',
        description: 'Logo wordt geüpload...',
      });

      // Simuleer upload vertraging
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Gebruik een object URL voor preview
      const previewUrl = URL.createObjectURL(file);
      setLogoUrl(previewUrl);

      toast({
        title: 'Logo geüpload',
        description: 'Het logo is succesvol geüpload.',
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: 'Fout bij uploaden',
        description: 'Er is een fout opgetreden bij het uploaden van het logo.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // In een echte implementatie zou je de logo-instellingen opslaan in de database

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Logo opgeslagen',
        description: 'De logo-instellingen zijn succesvol opgeslagen.',
      });
    } catch (error) {
      console.error('Error saving logo settings:', error);
      toast({
        title: 'Fout bij opslaan',
        description: 'Er is een fout opgetreden bij het opslaan van de logo-instellingen.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Logo Beheer</h2>
        <Button onClick={handleSave} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Opslaan
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-medium">Huidig logo</h3>
              <div className="border rounded-md p-6 bg-gray-50 flex items-center justify-center">
                {logoUrl ? (
                  <div className="flex flex-col items-center gap-4">
                    <Logo size="lg" className="text-primary" />
                    <Logo showText={false} size="lg" className="text-primary" />
                  </div>
                ) : (
                  <p className="text-gray-500">Geen logo gevonden</p>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Het logo wordt weergegeven in de navbar, footer en andere plaatsen op de website.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Logo uploaden</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-4">
                    Sleep een SVG-bestand hierheen of klik om te browsen
                  </p>
                  <input
                    type="file"
                    accept=".svg,image/*"
                    className="hidden"
                    id="logo-upload"
                    onChange={handleUploadLogo}
                    disabled={uploading}
                  />
                  <Button
                    asChild
                    variant="outline"
                    disabled={uploading}
                    className="gap-2"
                  >
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploaden...
                        </>
                      ) : (
                        <>Bestand kiezen</>
                      )}
                    </label>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Aanbevolen bestandsformaten</h4>
                <ul className="text-xs text-gray-500 list-disc pl-5 space-y-1">
                  <li>SVG (vectorbestand) voor de beste schaalbaarheid</li>
                  <li>Bewaar de afmetingen in verhouding</li>
                  <li>Gebruik eenvoudige, duidelijke lijnen voor het beste resultaat</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogoManager;
