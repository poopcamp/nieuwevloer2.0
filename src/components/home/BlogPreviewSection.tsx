
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Book, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url: string;
  tags: string[];
  published: boolean;
  publish_date: string;
}

export default function BlogPreviewSection() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeHover, setActiveHover] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('publish_date', { ascending: false })
        .limit(3);

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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('nl-BE', options);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-white to-neutral-50">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full opacity-30 blur-3xl -translate-x-24 -translate-y-24"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-50 rounded-full opacity-30 blur-3xl translate-x-24 translate-y-24"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full font-medium text-sm mb-3 shadow-sm">
              <Book className="h-4 w-4" />
              <span>Blog & Gidsen</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Tegelkennis & Inspiratie</h2>
            <p className="text-gray-600 max-w-2xl text-lg">
              Ontdek onze nieuwste artikelen over tegeltrends, plaatsingstechnieken en handige tips voor uw projecten.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <Button 
              asChild 
              variant="outline" 
              className="group min-h-11 border-primary-200 hover:border-primary-300 hover:bg-primary-50"
            >
              <Link to="/gidsen" className="flex items-center">
                Bekijk alle gidsen
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <motion.div variants={itemVariants} key={index}>
                <Card className="overflow-hidden border border-gray-100 shadow-sm bg-white h-full">
                  <Skeleton className="h-52 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-24 mb-3" />
                    <Skeleton className="h-6 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="flex gap-2 mt-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-0">
                    <Skeleton className="h-11 w-full" />
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : blogPosts.length > 0 ? (
            // Blog posts
            blogPosts.map((post) => (
              <motion.div 
                variants={itemVariants}
                key={post.id}
              >
                <Card 
                  className={`overflow-hidden border border-gray-100 shadow-sm bg-white transition-all duration-300 h-full ${
                    activeHover === post.id ? "shadow-lg transform -translate-y-1" : ""
                  }`}
                  onMouseEnter={() => setActiveHover(post.id)}
                  onMouseLeave={() => setActiveHover(null)}
                >
                  <div className="h-52 overflow-hidden bg-gray-100 relative">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className={`h-full w-full object-cover transition-transform duration-700 ${
                          activeHover === post.id ? "scale-110" : "scale-100"
                        }`}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-100">
                        <span className="text-gray-400">Geen afbeelding</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 text-primary-400" />
                      <time dateTime={post.publish_date}>
                        {formatDate(post.publish_date)}
                      </time>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600">{post.title}</h3>
                    <p className="text-gray-600 line-clamp-2 mb-3">
                      {post.content.substring(0, 140)}...
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="bg-primary-50 text-primary-700 hover:bg-primary-100 border-none">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 2 && (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            +{post.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-0">
                    <Button asChild variant="outline" className="w-full min-h-11 group border-primary-200 hover:border-primary-300 hover:bg-primary-50">
                      <Link to={`/blog/${post.id}`} className="flex items-center justify-center">
                        Lees meer
                        <ArrowRight className="ml-1 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            // No posts message
            <div className="col-span-full bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium text-gray-900 mb-2">Binnenkort nieuwe artikelen</h3>
              <p className="text-gray-600 mb-4">
                We werken momenteel aan nieuwe content en handige gidsen voor uw tegelprojecten.
              </p>
              <div className="flex justify-center mt-4">
                <Button asChild variant="outline" className="min-h-11 border-primary-200 hover:border-primary-300 hover:bg-primary-50">
                  <Link to="/gidsen">Bekijk onze tegelgidsen</Link>
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Blog preview footer with CTA */}
        {blogPosts.length > 0 && (
          <div className="mt-12 md:mt-16 text-center">
            <Button asChild className="min-h-11 px-8 text-base group bg-primary-600 hover:bg-primary-700">
              <Link to="/blog" className="flex items-center">
                Alle artikelen bekijken
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
