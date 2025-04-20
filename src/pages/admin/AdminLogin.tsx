
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useAuth } from '@/contexts/auth-context';
import { Helmet } from 'react-helmet-async';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import LoadingSpinner from '@/components/admin/home/common/LoadingSpinner';

// Login form schema
const loginSchema = z.object({
  email: z.string().email('Voer een geldig e-mailadres in'),
  password: z.string().min(6, 'Wachtwoord moet minimaal 6 tekens bevatten'),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signIn } = useAuthActions();
  const { user, isAdmin, isLoading, refreshAuth } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);
  const [adminCheckAttempts, setAdminCheckAttempts] = useState(0);

  // Get the destination from the location state
  const from = location.state?.from?.pathname || '/admin/dashboard';

  // Form handling
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  // Debug log for component state
  useEffect(() => {
    console.log("AdminLogin Component State:", { 
      isLoading, 
      isSubmitting,
      loginSuccess,
      adminCheckComplete,
      adminCheckAttempts,
      hasUser: !!user, 
      isAdmin, 
      from 
    });
  }, [isLoading, isSubmitting, loginSuccess, adminCheckComplete, adminCheckAttempts, user, isAdmin, from]);

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (user && isAdmin && !isLoading) {
      console.log("[AdminLogin] Already authenticated as admin, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, isLoading, navigate, from]);

  // Check admin status and redirect after successful login
  useEffect(() => {
    const attemptRedirect = async () => {
      if (loginSuccess && user && !isLoading) {
        if (adminCheckAttempts >= 5) {
          console.log("[AdminLogin] Max admin check attempts reached");
          setAdminCheckComplete(true);
          // Als de gebruiker niet admin is na 5 pogingen, tonen we een foutmelding
          if (!isAdmin) {
            toast({
              title: "Toegang geweigerd",
              description: "U heeft geen beheerdersrechten voor deze pagina",
              variant: "destructive"
            });
          }
          return;
        }
        
        // Force refresh admin status with increasing delay
        console.log(`[AdminLogin] Login succeeded, checking admin status... (attempt ${adminCheckAttempts + 1})`);
        setAdminCheckAttempts(prev => prev + 1);
        
        // Wacht steeds langer tussen pogingen
        await new Promise(resolve => setTimeout(resolve, 1000 * (adminCheckAttempts + 1)));
        
        try {
          await refreshAuth();
          
          // After refresh, check if admin
          if (isAdmin) {
            console.log("[AdminLogin] Admin status confirmed, redirecting");
            setAdminCheckComplete(true);
            toast({
              title: "Inloggen gelukt",
              description: "U wordt doorverwezen naar het dashboard",
            });
            navigate(from, { replace: true });
          } else if (adminCheckAttempts >= 4) {
            // Last attempt, mark as complete
            console.log("[AdminLogin] Not admin after final attempt");
            setAdminCheckComplete(true);
            toast({
              title: "Toegang geweigerd",
              description: "U heeft geen beheerdersrechten voor deze pagina",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error("[AdminLogin] Error during admin check:", error);
        }
      }
    };
    
    attemptRedirect();
  }, [loginSuccess, user, isAdmin, isLoading, adminCheckAttempts, refreshAuth, navigate, from, toast]);

  // Handle form submission
  const onSubmit = async (data: LoginForm) => {
    try {
      setIsSubmitting(true);
      console.log("[AdminLogin] Attempting to sign in:", data.email);
      
      // Reset previous states
      setLoginSuccess(false);
      setAdminCheckComplete(false);
      setAdminCheckAttempts(0);
      
      // Show loading toast
      toast({
        title: "Inloggen",
        description: "Bezig met inloggen...",
      });
      
      const result = await signIn(data.email, data.password, !!data.rememberMe);
      console.log("[AdminLogin] Sign in result:", result ? "Success" : "Failed");
      
      if (result) {
        // Mark login as successful
        setLoginSuccess(true);
        
        // Wacht even voordat de admin status checks beginnen
        setTimeout(async () => {
          await refreshAuth();
        }, 1000);
      }
    } catch (error: any) {
      console.error("[AdminLogin] Sign in error:", error);
      toast({
        title: "Inloggen mislukt",
        description: error.message || "Er is een fout opgetreden bij het inloggen",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle demo login
  const handleDemoLogin = () => {
    form.setValue('email', 'admin@nieuwevloer.be');
    form.setValue('password', 'admin123');
    
    toast({
      title: "Demo inloggegevens ingevuld",
      description: "U kunt nu inloggen met de demo gegevens",
    });
  };

  // Show loading if auth is in process
  if (loginSuccess && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="flex flex-col items-center">
          <LoadingSpinner />
          <p className="text-xl font-semibold mt-4">Inloggen gelukt!</p>
          <p className="text-gray-600">Beheerdersrechten controleren...</p>
        </div>
      </div>
    );
  }

  // Show checking admin status if login successful but admin check in progress
  if (loginSuccess && user && !adminCheckComplete && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="flex flex-col items-center">
          <LoadingSpinner />
          <p className="text-xl font-semibold mt-4">Inloggen gelukt!</p>
          <p className="text-gray-600">Beheerdersrechten controleren... (poging {adminCheckAttempts + 1}/5)</p>
        </div>
      </div>
    );
  }

  // Show success and redirect message if logged in as admin
  if (loginSuccess && user && isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="flex flex-col items-center">
          <LoadingSpinner />
          <p className="text-xl font-semibold mt-4">Inloggen gelukt!</p>
          <p className="text-gray-600">U wordt doorverwezen naar het dashboard...</p>
        </div>
      </div>
    );
  }

  // Show access denied if login successful but not admin after all attempts
  if (loginSuccess && user && adminCheckComplete && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="flex flex-col items-center max-w-md text-center p-8 bg-white rounded-lg shadow-md">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Toegang geweigerd</h2>
          <p className="text-gray-600 mb-6">U heeft geen beheerdersrechten voor deze pagina.</p>
          <div className="space-y-3 w-full">
            <Button 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Terug naar homepagina
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setLoginSuccess(false);
                setAdminCheckComplete(false);
                setAdminCheckAttempts(0);
                refreshAuth();
                form.reset();
              }}
              className="w-full"
            >
              Opnieuw inloggen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Helmet>
        <title>Admin Login | NieuweVloer.be</title>
      </Helmet>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Log in om toegang te krijgen tot het beheerdersdashboard.
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mailadres</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="uw@email.be"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Wachtwoord</FormLabel>
                      <Button variant="link" className="p-0 h-auto text-sm" type="button" onClick={() => toast({
                        title: "Wachtwoord vergeten", 
                        description: "Neem contact op met de beheerder om uw wachtwoord te resetten."
                      })}>
                        Wachtwoord vergeten?
                      </Button>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                      />
                    </FormControl>
                    <FormLabel className="text-sm cursor-pointer">
                      Onthoud mij
                    </FormLabel>
                  </FormItem>
                )}
              />
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" size="sm" />
                    Inloggen...
                  </>
                ) : (
                  'Inloggen'
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleDemoLogin}
              >
                Demo inloggegevens
              </Button>
              
              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={() => navigate('/')}
              >
                Terug naar website
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;
