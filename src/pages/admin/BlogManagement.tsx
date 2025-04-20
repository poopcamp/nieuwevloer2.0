
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
import { BlogPost } from '@/types/blog';

const BlogManagementPage = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [published, setPublished] = useState(false);
  const [tags, setTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Reset form when dialog closes
  useEffect(() => {
    if (!dialogOpen) {
      resetForm();
    }
  }, [dialogOpen]);

  // Set form values when a blog is selected for editing
  useEffect(() => {
    if (selectedBlog) {
      setTitle(selectedBlog.title);
      setContent(selectedBlog.content);
      setImageUrl(selectedBlog.image_url || '');
      setPublished(selectedBlog.published || false);
      setTags((selectedBlog.tags || []).join(', '));
    }
  }, [selectedBlog]);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching blogs from Supabase...");
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log(`Retrieved ${data?.length || 0} blog posts:`, data);
      setBlogs(data || []);
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      toast({
        title: 'Fout bij ophalen van blogs',
        description: 'Er is een fout opgetreden bij het ophalen van blogs.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setImageUrl('');
    setPublished(false);
    setTags('');
    setSelectedBlog(null);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: 'Vul alle verplichte velden in',
        description: 'Titel en inhoud zijn verplicht.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const blogData = {
        title,
        content,
        image_url: imageUrl,
        published,
        tags: tagsArray,
        publish_date: published ? new Date().toISOString() : null
      };
      
      console.log("Blog data to save:", blogData);
      console.log("Selected blog ID:", selectedBlog?.id);

      let result;
      if (selectedBlog) {
        // Update existing blog
        console.log(`Updating blog with ID: ${selectedBlog.id}`);
        result = await supabase
          .from('blog_posts')
          .update(blogData)
          .eq('id', selectedBlog.id);
      } else {
        // Insert new blog
        console.log("Inserting new blog post");
        result = await supabase.from('blog_posts').insert([blogData]);
      }

      if (result.error) {
        console.error("Error saving blog:", result.error);
        throw result.error;
      }
      
      console.log("Save result:", result);

      toast({
        title: selectedBlog ? 'Blog bijgewerkt' : 'Blog aangemaakt',
        description: selectedBlog
          ? 'De blog is succesvol bijgewerkt.'
          : 'De blog is succesvol aangemaakt.',
      });

      setDialogOpen(false);
      resetForm();
      await fetchBlogs();
    } catch (error: any) {
      console.error('Error saving blog:', error);
      toast({
        title: 'Fout bij opslaan',
        description: 'Er is een fout opgetreden bij het opslaan van de blog: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (blog: BlogPost) => {
    setSelectedBlog(blog);
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

    setIsDeleting(true);
    try {
      console.log(`Deleting blog with ID: ${id}`);
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);

      if (error) {
        console.error("Delete error:", error);
        throw error;
      }

      toast({
        title: 'Blog verwijderd',
        description: 'De blog is succesvol verwijderd.',
      });

      fetchBlogs();
    } catch (error: any) {
      console.error('Error deleting blog:', error);
      toast({
        title: 'Fout bij verwijderen',
        description: 'Er is een fout opgetreden bij het verwijderen van de blog: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setConfirmDeleteId(null);
    }
  };

  // Filter blogs based on search term
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Beheer</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nieuwe Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedBlog ? 'Blog Bewerken' : 'Nieuwe Blog'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  placeholder="Blog titel"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Inhoud</Label>
                <Textarea
                  id="content"
                  placeholder="Blog inhoud"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Afbeelding URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://voorbeeld.nl/afbeelding.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (gescheiden door komma's)</Label>
                <Input
                  id="tags"
                  placeholder="tegels, badkamer, renovatie"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
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
          <CardTitle>Blog Artikelen</CardTitle>
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
          ) : filteredBlogs.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              Geen blogs gevonden.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titel</TableHead>
                  <TableHead>Gemaakt op</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="w-[120px]">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell>
                      {new Date(blog.created_at).toLocaleDateString('nl-BE')}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          blog.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {blog.published ? 'Gepubliceerd' : 'Concept'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {blog.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(blog)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDelete(blog.id)}
                          disabled={isDeleting}
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
                            href={`/blog/${blog.id}`}
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

export default BlogManagementPage;
