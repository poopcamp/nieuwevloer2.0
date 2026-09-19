
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useAuth } from "@/contexts/auth-context";
import { Helmet } from "react-helmet-async";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { AUTH_API_URL } from "@/integrations/supabase/client";
import { isSupabaseCoHost } from "@/config/api";

const loginSchema = z.object({
  email: z.string().email("Voer een geldig e-mailadres in"),
  password: z.string().min(6, "Wachtwoord moet minimaal 6 tekens bevatten"),
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

  const from = location.state?.from?.pathname || "/admin";
  const authHost = AUTH_API_URL.replace(/^https:\/\//, "");
  const unsafeHost = isSupabaseCoHost(AUTH_API_URL);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  useEffect(() => {
    if (user && isAdmin && !isLoading) {
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, isLoading, navigate, from]);

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsSubmitting(true);
      setLoginSuccess(false);

      const result = await signIn(data.email, data.password, !!data.rememberMe);

      if (result) {
        setLoginSuccess(true);
        await refreshAuth();
        toast({
          title: "Inloggen gelukt",
          description: "U wordt doorverwezen naar het overzicht",
        });
        navigate(from, { replace: true });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Er is een fout opgetreden bij het inloggen";
      toast({
        title: "Inloggen mislukt",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loginSuccess && (isLoading || (user && isAdmin))) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Spinner />
          <p className="text-lg font-semibold">Sessie actief</p>
          <p className="text-sm text-slate-400">Doorverwijzen naar het beheer…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Helmet>
        <title>Aanmelden | Beheer NieuweVloer + NieuwTerras</title>
      </Helmet>

      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Beheer</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">NieuweVloer + NieuwTerras</h1>
          <p className="mt-2 text-sm text-slate-400">
            Eén aanmelding voor beide merken. Brian Vanderheyden, Maldegem.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
          {unsafeHost && (
            <p className="mb-4 rounded-md border border-red-500/40 bg-red-950/60 px-3 py-2 text-sm text-red-200">
              Login-host is *.supabase.co — dat veroorzaakt “Load failed”. Zet VITE_SUPABASE_URL op
              https://api.nieuwevloer.be.
            </p>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">E-mailadres</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="uw@email.be"
                        className="border-white/10 bg-slate-950 text-slate-100"
                        autoComplete="username"
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
                    <FormLabel className="text-slate-200">Wachtwoord</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="border-white/10 bg-slate-950 text-slate-100"
                        autoComplete="current-password"
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
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="cursor-pointer text-sm text-slate-300">Onthoud mij</FormLabel>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting || unsafeHost}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" size="sm" />
                    Inloggen…
                  </>
                ) : (
                  "Inloggen"
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-xs text-slate-500">
            Auth-host: <span className="font-mono text-slate-300">{authHost}</span>
            {" · "}niet *.supabase.co
          </p>
        </div>

        <Button variant="link" className="mt-6 text-slate-400" onClick={() => navigate("/")}>
          Terug naar website
        </Button>
      </div>
    </div>
  );
};

export default AdminLogin;
