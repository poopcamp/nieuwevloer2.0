
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

interface MonthlyProject {
  id: string;
  title: string;
  description: string;
  image_url: string;
  client_name: string;
  location: string;
  created_at: string;
}

export default function ProjectOfTheMonth() {
  const [project, setProject] = useState<MonthlyProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCurrentProject();
  }, []);

  const fetchCurrentProject = async () => {
    try {
      const { data, error } = await supabase
        .from('monthly_projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching monthly project:", error);
        setIsLoading(false);
        return;
      }

      setProject(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch monthly project:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <ProjectSkeleton />;
  }

  if (!project) {
    return null;
  }

  return (
    <section className="py-14 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Van De Maand</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ontdek ons meest recente uitgelichte project en laat u inspireren door ons vakmanschap.
          </p>
        </div>

        <Card className="overflow-hidden border-0 shadow-lg rounded-xl">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="h-64 md:h-auto overflow-hidden">
                <img 
                  src={project.image_url} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-10 flex flex-col justify-center">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
                    <p className="text-primary font-medium">
                      {project.client_name} • {project.location}
                    </p>
                  </div>
                  
                  <p className="text-gray-600">
                    {project.description}
                  </p>
                  
                  <div className="pt-4">
                    <Button asChild className="min-h-11 w-full md:w-auto text-base px-6">
                      <Link to="/configurator" className="flex items-center justify-center">
                        Configureer Soortgelijk Project
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ProjectSkeleton() {
  return (
    <section className="py-14 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
        </div>

        <div className="rounded-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <Skeleton className="h-64 md:h-96" />
            <div className="p-6 md:p-10 space-y-4 bg-gray-50">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
              <Skeleton className="h-11 w-full md:w-48 mt-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
