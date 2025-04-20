import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { tableNames } from "@/utils/supabase/customTypes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

export default function Uitschrijven() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;
    unsubscribe();
  }, [email]);

  const unsubscribe = async () => {
    if (!email) return;

    setStatus('processing');
    try {
      // Update the contact_submissions table to set receives_newsletter = false
      const { error } = await supabase
        .from(tableNames.CONTACT_SUBMISSIONS)
        .update({ receives_newsletter: false })
        .eq('email', email);

      if (error) throw error;
      
      setStatus('success');
    } catch (error: any) {
      console.error('Error unsubscribing:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Er is iets misgegaan bij het uitschrijven.');
    }
  };

  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Uitschrijven Nieuwsbrief</h1>
          
          {status === 'idle' && (
            <div className="space-y-4">
              <p>Wilt u zich uitschrijven voor onze nieuwsbrief?</p>
              <p className="text-sm text-gray-600">U gaat uitschrijven met het e-mailadres: <strong>{email}</strong></p>
              <Button 
                className="w-full mt-4" 
                onClick={unsubscribe}
                disabled={!email}
              >
                Bevestig uitschrijving
              </Button>
            </div>
          )}

          {status === 'processing' && (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4">Bezig met uitschrijven...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Uitschrijving voltooid</h2>
              <p>U bent succesvol uitgeschreven van onze nieuwsbrief.</p>
              <p className="text-sm text-gray-600 mt-4">Heeft u zich per ongeluk uitgeschreven? Neem dan contact op via ons contactformulier.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Er is iets misgegaan</h2>
              <p>{errorMessage || 'We konden uw uitschrijving niet verwerken. Probeer het later opnieuw of neem contact met ons op.'}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
