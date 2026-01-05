'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Logo } from '@/components/Logo';
import { useAuth, useUser } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

function AdminLoginSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center space-y-2">
                <Logo className="justify-center mb-2" />
                <CardTitle className="font-headline text-2xl">Admin Panel</CardTitle>
                <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <AdminLoginSkeleton />;
  }

  return <AdminLoginForm />;
}


function AdminLoginForm() {
  const auth = useAuth();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Display any error messages passed in the URL parameters.
    const authError = searchParams.get('error');
    if (authError) {
      setError(authError);
    }
  }, [searchParams]);

  // If a user is already logged in, redirect them to the admin dashboard.
  // The dashboard layout is responsible for verifying if they are an authorized admin.
  useEffect(() => {
    if (user && !isUserLoading) {
        router.push('/admin');
    }
  }, [user, isUserLoading, router]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    if (!auth) {
        setError('Authentication service is not available.');
        return;
    }
    try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        // On successful login, the `useEffect` hook above will detect the user
        // and handle the redirect to the '/admin' page.
    } catch (e: any) {
        // Handle common Firebase auth errors.
        const errorMessage = e.code === 'auth/invalid-credential' 
            ? 'Invalid email or password. Please try again.'
            : e.message || 'An unexpected error occurred during login.';
        setError(errorMessage);
    }
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center space-y-2">
          <Logo className="justify-center mb-2" />
          <CardTitle className="font-headline text-2xl">Admin Panel</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
