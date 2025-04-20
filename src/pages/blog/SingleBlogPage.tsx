
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Calendar } from "lucide-react";
import { BlogPost } from "@/types/blog";

const SingleBlogPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        
        if (!postId) {
          throw new Error("Blog ID ontbreekt");
        }

        console.log("Fetching blog post with ID:", postId);
        
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", postId)
          .eq("published", true)
          .single();
          
        if (error) throw new Error(error.message);
        
        console.log("Retrieved blog post data:", data);
        setPost(data);
      } catch (err: any) {
        console.error("Error fetching blog post:", err);
        setError(err.message || "Er is een probleem opgetreden bij het laden van dit blogartikel");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogPost();
  }, [postId]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('nl-BE', options);
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      paragraph.trim() ? <p key={index} className="mb-4">{paragraph}</p> : null
    ));
  };

  return (
    <>
      <Helmet>
        <title>{post ? `${post.title} | NieuweVloer.be` : "Artikel | NieuweVloer.be"}</title>
        <meta 
          name="description" 
          content={post?.content?.substring(0, 160) || "Lees ons blog artikel over tegelwerken en renovaties."}
        />
      </Helmet>

      <Navbar />
      
      <main className="pt-16 md:pt-20 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-4 w-32 mb-8" />
              <Skeleton className="h-64 w-full mb-8" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Er is een probleem opgetreden</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button asChild>
                <Link to="/blog">Terug naar het blog overzicht</Link>
              </Button>
            </div>
          ) : post ? (
            <div className="max-w-4xl mx-auto">
              <Button asChild variant="outline" className="mb-8">
                <Link to="/blog" className="flex items-center">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Terug naar alle artikelen
                </Link>
              </Button>

              <article>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                
                <div className="flex items-center text-gray-500 mb-6">
                  <Calendar className="h-4 w-4 mr-2" />
                  <time dateTime={post.created_at}>
                    {formatDate(post.created_at)}
                  </time>
                </div>
                
                {post.image_url && (
                  <div className="mb-8 rounded-lg overflow-hidden">
                    <img 
                      src={post.image_url} 
                      alt={post.title} 
                      className="w-full h-auto"
                    />
                  </div>
                )}
                
                <div className="prose prose-lg max-w-none">
                  {formatContent(post.content)}
                </div>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
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
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Artikel niet gevonden</h2>
              <p className="text-gray-600 mb-6">
                Het artikel dat u zoekt bestaat niet of is niet meer beschikbaar.
              </p>
              <Button asChild>
                <Link to="/blog">Terug naar het blog overzicht</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default SingleBlogPage;
