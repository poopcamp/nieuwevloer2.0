
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url: string;
  tags: string[];
  published: boolean;
  publish_date: string;
  created_at: string;
}

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { postId } = useParams();

  useEffect(() => {
    if (postId) {
      fetchSinglePost(postId);
    } else {
      fetchBlogPosts();
    }
  }, [postId]);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('publish_date', { ascending: false });

      if (error) {
        throw error;
      }

      setBlogPosts(data || []);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSinglePost = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setBlogPosts([data]);
      }
    } catch (error) {
      console.error("Failed to fetch blog post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('nl-BE', options);
  };

  // Format blog content with paragraphs
  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{postId ? (blogPosts[0]?.title || "Blog artikel") : "Blog | NieuweVloer.be"}</title>
        <meta 
          name="description" 
          content={postId ? (blogPosts[0]?.content?.substring(0, 160) || "Lees ons blog artikel") : "Ontdek handige tips en advies over tegelplaatsing, vloeren en badkamerrenovaties in ons blog."}
        />
      </Helmet>

      <Navbar />

      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {!postId && (
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Ons Blog</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Ontdek handige tips, inspiratie en vakkennis over tegelplaatsing, vloeren en badkamerrenovaties.
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-6 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : postId && blogPosts.length > 0 ? (
            // Single blog post view
            <div className="max-w-4xl mx-auto">
              <Button asChild variant="outline" className="mb-8">
                <Link to="/blog" className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                  Terug naar alle artikelen
                </Link>
              </Button>
            
              <article>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{blogPosts[0].title}</h1>
                
                <div className="flex items-center text-gray-500 mb-6">
                  <Calendar className="h-4 w-4 mr-2" />
                  <time dateTime={blogPosts[0].publish_date}>
                    {formatDate(blogPosts[0].publish_date)}
                  </time>
                </div>
                
                {blogPosts[0].image_url && (
                  <div className="mb-8 rounded-lg overflow-hidden">
                    <img 
                      src={blogPosts[0].image_url} 
                      alt={blogPosts[0].title} 
                      className="w-full h-auto"
                    />
                  </div>
                )}
                
                <div className="prose prose-lg max-w-none">
                  {formatContent(blogPosts[0].content)}
                </div>
                
                {blogPosts[0].tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <div className="flex flex-wrap gap-2">
                      {blogPosts[0].tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </div>
          ) : blogPosts.length > 0 ? (
            // Blog list view
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map(post => (
                <Card key={post.id} className="overflow-hidden flex flex-col">
                  <div className="h-48 overflow-hidden bg-gray-100">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-100">
                        <span className="text-gray-400">Geen afbeelding</span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={post.publish_date}>
                        {formatDate(post.publish_date)}
                      </time>
                    </div>
                    <h2 className="text-xl font-bold line-clamp-2">{post.title}</h2>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {post.content.substring(0, 150)}...
                    </p>
                    <div className="mt-auto pt-4">
                      <Button asChild>
                        <Link to={`/blog/${post.id}`}>Lees meer</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Geen artikelen gevonden</h2>
              <p className="text-muted-foreground">
                Er zijn momenteel geen blogartikelen beschikbaar. Kom later terug voor nieuwe inhoud.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
