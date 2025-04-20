
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/formatters";

interface Submission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  project_type: string;
  square_meters: number;
  total_price: number | null;
  wants_to_buy_tiles: boolean;
  tile_price_per_sqm: number | null;
}

const SubmissionsManager = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch submissions from the database
  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('configurations')
          .select('id, created_at, name, email, phone, project_type, square_meters, total_price, wants_to_buy_tiles, tile_price_per_sqm')
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (error) {
          throw new Error(error.message);
        }
        
        console.log(`Retrieved ${data?.length || 0} submissions:`, data);
        setSubmissions(data || []);
      } catch (error: any) {
        console.error(`Error fetching submissions:`, error);
        setError(`Fout bij ophalen van aanvragen: ${error.message}`);
        toast({
          variant: "destructive",
          title: "Fout bij ophalen aanvragen",
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aanvragen Overzicht</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.length === 0 ? (
              <Card className="bg-gray-50 p-4">
                <p className="text-sm text-gray-500 text-center">
                  Geen aanvragen gevonden.
                </p>
              </Card>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Datum</th>
                      <th className="px-4 py-2 text-left">Naam</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Telefoon</th>
                      <th className="px-4 py-2 text-left">Project Type</th>
                      <th className="px-4 py-2 text-left">Opp.</th>
                      <th className="px-4 py-2 text-left">Prijs</th>
                      <th className="px-4 py-2 text-left">Tegels</th>
                      <th className="px-4 py-2 text-left">Tegelprijs</th>
                      <th className="px-4 py-2 text-left">Actie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => {
                      const date = new Date(submission.created_at);
                      const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                      
                      return (
                        <tr key={submission.id} className="border-b">
                          <td className="px-4 py-2">{formattedDate}</td>
                          <td className="px-4 py-2">{submission.name}</td>
                          <td className="px-4 py-2">{submission.email}</td>
                          <td className="px-4 py-2">{submission.phone}</td>
                          <td className="px-4 py-2">{submission.project_type}</td>
                          <td className="px-4 py-2">{submission.square_meters} m²</td>
                          <td className="px-4 py-2">
                            {submission.total_price ? formatCurrency(submission.total_price) : 'Op aanvraag'}
                          </td>
                          <td className="px-4 py-2">
                            {submission.wants_to_buy_tiles ? 'Via ons' : 'Zelf'}
                          </td>
                          <td className="px-4 py-2">
                            {submission.tile_price_per_sqm ? `€${submission.tile_price_per_sqm}/m²` : '-'}
                          </td>
                          <td className="px-4 py-2">
                            <a 
                              href={`mailto:${submission.email}`} 
                              className="text-primary hover:text-primary-dark"
                              title="Email klant"
                            >
                              <Mail size={16} />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubmissionsManager;
