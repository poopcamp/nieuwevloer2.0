
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Demo guide data
const GUIDES_DATA = [
  { id: '1', title: 'Alles over tegelmaten en formaten', slug: 'tegelmaten-formaten', published: true, excerpt: 'Een complete gids over tegelmaten, formaten en hoe je de juiste keuze maakt voor jouw project.' },
  { id: '2', title: 'De juiste tegellijm kiezen', slug: 'tegellijm-kiezen', published: true, excerpt: 'Welke tegellijm is geschikt voor jouw project? Ontdek de verschillende soorten en hun toepassingen.' },
  { id: '3', title: 'Tegels leggen op vloerverwarming', slug: 'tegels-vloerverwarming', published: false, excerpt: 'Tips en richtlijnen voor het leggen van tegels op vloerverwarming, inclusief aandachtspunten en materiaaladviezen.' },
  { id: '4', title: 'Voegen kiezen en aanbrengen', slug: 'voegen-kiezen-aanbrengen', published: true, excerpt: 'Alles over voegmaterialen, kleuren, en technieken voor het perfect afwerken van tegelwerk.' },
];

const AdminGuidesPage = () => {
  const [guides, setGuides] = useState(GUIDES_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [featuredImage, setFeaturedImage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when dialog closes
  useEffect(() => {
    if (!dialogOpen) {
      resetForm();
    }
  }, [dialogOpen]);

  // Set form values when a guide is selected for editing
  useEffect(() => {
    if (selectedGuide) {
      setTitle(selectedGuide.title);
      setSlug(selectedGuide.slug);
      setExcerpt(selectedGuide.excerpt || '');
      setContent(selectedGuide.content || '');
      setPublished(selectedGuide.published);
      setFeaturedImage(selectedGuide.featuredImage || '');
    }
  }, [selectedGuide]);

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setPublished(false);
    setFeaturedImage('');
    setSelectedGuide(null);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Auto-generate slug if not manually edited
    if (!selectedGuide || !selectedGuide.slug) {
      setSlug(newTitle.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
      );
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) {
      toast({
        title: 'Vul alle verplichte velden in',
        description: 'Titel en slug zijn verplicht.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const guideData = {
        id: selectedGuide ? selectedGuide.id : Date.now().toString(),
        title,
        slug,
        excerpt,
        content,
        published,
        featuredImage
      };

      if (selectedGuide) {
        // Update existing guide
        setGuides(guides.map(guide => 
          guide.id === selectedGuide.id ? guideData : guide
        ));
        
        toast({
          title: 'Gids bijgewerkt',
          description: 'De gids is succesvol bijgewerkt.',
        });
      } else {
        // Create new guide
        setGuides([...guides, guideData]);
        
        toast({
          title: 'Gids aangemaakt',
          description: 'De gids is succesvol aangemaakt.',
        });
      }

      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving guide:', error);
      toast({
        title: 'Fout bij opslaan',
        description: 'Er is een fout opgetreden bij het opslaan van de gids.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (guide: any) => {
    setSelectedGuide(guide);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      toast({
        title: 'Bevestig verwijderen',
        description: 'Klik nogmaals op verwijderen om te bevestigen.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setGuides(guides.filter(guide => guide.id !== id));
      
      toast({
        title: 'Gids verwijderd',
        description: 'De gids is succesvol verwijderd.',
      });
    } catch (error) {
      console.error('Error deleting guide:', error);
      toast({
        title: 'Fout bij verwijderen',
        description: 'Er is een fout opgetreden bij het verwijderen van de gids.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setConfirmDeleteId(null);
    }
  };

  // Filter guides based on search term
  const filteredGuides = guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gidsen Beheer</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nieuwe Gids
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedGuide ? 'Gids Bewerken' : 'Nieuwe Gids'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  placeholder="Gids titel"
                  value={title}
                  onChange={handleTitleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="gids-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Samenvatting</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Korte samenvatting van de gids"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Inhoud</Label>
                <Textarea
                  id="content"
                  placeholder="Volledige inhoud van de gids"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="featuredImage">Uitgelichte Afbeelding URL</Label>
                <Input
                  id="featuredImage"
                  placeholder="https://voorbeeld.nl/afbeelding.jpg"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                />
                <Label htmlFor="published">Gepubliceerd</Label>
              </div>
              <div className="pt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuleren
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Opslaan...
                    </>
                  ) : (
                    'Opslaan'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gidsen</CardTitle>
          <div className="flex w-full items-center space-x-2 pt-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Zoek op titel of inhoud..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredGuides.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              Geen gidsen gevonden.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titel</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Samenvatting</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuides.map((guide) => (
                  <TableRow key={guide.id}>
                    <TableCell className="font-medium">{guide.title}</TableCell>
                    <TableCell>{guide.slug}</TableCell>
                    <TableCell className="max-w-xs truncate">{guide.excerpt}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          guide.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {guide.published ? 'Gepubliceerd' : 'Concept'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(guide)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDelete(guide.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-500"
                          asChild
                        >
                          <a
                            href={`/gidsen/${guide.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGuidesPage;
