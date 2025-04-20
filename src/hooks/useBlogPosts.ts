
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BlogPost } from "../types/blog";

export const useBlogPosts = (initialTab = "all") => {
  const [isLoading, setIsLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState(initialTab);
  const { toast } = useToast();

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      
      // Filter based on active tab
      if (activeTab === "published") {
        query = query.eq('published', true);
      } else if (activeTab === "drafts") {
        query = query.eq('published', false);
      }
      
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setBlogPosts(data || []);
    } catch (error: any) {
      console.error("Error fetching blog posts:", error);
      toast({
        title: "Fout bij ophalen",
        description: "Kon de blogberichten niet ophalen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Weet je zeker dat je dit blogbericht wilt verwijderen?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        throw error;
      }

      toast({
        title: "Bericht verwijderd",
        description: "Het blogbericht is succesvol verwijderd.",
      });

      await fetchBlogPosts();
    } catch (error: any) {
      console.error("Error deleting blog post:", error);
      toast({
        title: "Fout bij verwijderen",
        description: error.message || "Er is een fout opgetreden bij het verwijderen van het blogbericht.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, [activeTab]);

  return {
    isLoading,
    blogPosts,
    activeTab,
    setActiveTab,
    fetchBlogPosts,
    handleDeletePost
  };
};
