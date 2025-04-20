
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Trash2, Image as ImageIcon, ArrowLeftCircle, Home, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminMediaPage = () => {
  const [activeTab, setActiveTab] = useState('images');
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      // For demo purposes, let's use the hero_images table
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: 'Fout bij ophalen afbeeldingen',
        description: 'Er is een fout opgetreden bij het ophalen van afbeeldingen.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    setUploading(true);
    
    try {
      // For demo purposes (would normally use storage buckets)
      // Simulate file upload
      toast({
        title: 'Afbeelding uploaden',
        description: 'Afbeelding wordt geüpload...',
      });
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add to hero_images table
      const { error } = await supabase
        .from('hero_images')
        .insert([
          { 
            url: URL.createObjectURL(file), // Just for demo, normally would be a storage URL
            alt_text: file.name.split('.')[0]
          }
        ]);
        
      if (error) throw error;
      
      toast({
        title: 'Afbeelding geüpload',
        description: 'De afbeelding is succesvol geüpload.',
      });
      
      fetchImages();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Fout bij uploaden',
        description: 'Er is een fout opgetreden bij het uploaden van de afbeelding.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    // Request confirmation for first click
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      toast({
        title: 'Bevestig verwijderen',
        description: 'Klik nogmaals op verwijderen om te bevestigen.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Afbeelding verwijderd',
        description: 'De afbeelding is succesvol verwijderd.',
      });
      
      setDeleteConfirm(null);
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Fout bij verwijderen',
        description: 'Er is een fout opgetreden bij het verwijderen van de afbeelding.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Media Beheer</h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              asChild
            >
              <Link to="/admin">
                <ArrowLeftCircle className="h-4 w-4" />
                Terug naar dashboard
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={fetchImages}
            >
              <RefreshCw className="h-4 w-4" />
              Vernieuwen
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Media Bibliotheek</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="images">Afbeeldingen</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="images">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : images.length === 0 ? (
                  <div className="text-center py-8">
                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">Geen afbeeldingen gevonden</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab('upload')}
                    >
                      Upload afbeeldingen
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={image.url} 
                            alt={image.alt_text} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => handleDeleteImage(image.id)}
                            className="h-9 w-9"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs mt-1 truncate">{image.alt_text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="upload">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="space-y-4">
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="h-10 w-10 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium">Sleep afbeeldingen hierheen</h3>
                        <p className="mt-1 text-xs text-gray-500">
                          Of klik om te browsen
                        </p>
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="image-upload"
                        onChange={handleUpload}
                        disabled={uploading}
                      />
                      <Label
                        htmlFor="image-upload"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary cursor-pointer"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploaden...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Kies bestand
                          </>
                        )}
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Ondersteunde formaten</h3>
                    <p className="text-xs text-gray-500">
                      JPG, PNG, GIF, WebP, SVG
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminMediaPage;
