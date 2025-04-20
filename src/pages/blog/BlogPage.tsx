
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPost } from "@/types/blog";

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false });
          
        if (error) throw new Error(error.message);
        
        setBlogPosts(data || []);
      } catch (err: any) {
        console.error("Error fetching blog posts:", err);
        setError(err.message || "Er is een probleem opgetreden bij het laden van de blogartikelen");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogPosts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Blog | NieuweVloer.be</title>
        <meta 
          name="description" 
          content="Tips, trends en inspiratie over tegelplaatsing, badkamerrenovatie en vloerwerken. Lees onze expert artikelen." 
        />
        <meta 
          name="keywords" 
          content="tegels blog, badkamer inspiratie, vloertegels tips, tegeltrends, vloer onderhoud, badkamerrenovatie" 
        />
      </Helmet>

      <Navbar />
      
      <main className="pt-16 md:pt-20">
        <PageHeader 
          title="Blog" 
          subtitle="Inspiratie, tips en trends voor uw tegelvloer en badkamer"
          bgColor="bg-indigo-50"
        />
        
        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardHeader>
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Er is een probleem opgetreden</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Probeer opnieuw te laden
              </Button>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Geen blogartikelen gevonden</h3>
              <p className="text-gray-600">Kom binnenkort terug voor nieuwe artikelen en inspiratie.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden flex flex-col h-full">
                  {post.image_url && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <img 
                        src={post.image_url} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" /> 
                      {new Date(post.created_at).toLocaleDateString('nl-BE')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 line-clamp-3">
                      {post.content.substring(0, 150)}...
                    </p>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-100">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/blog/${post.id}`} className="flex items-center justify-center">
                        Lees meer <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default BlogPage;
