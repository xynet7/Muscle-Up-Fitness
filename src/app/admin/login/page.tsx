'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Logo } from '@/components/Logo';
import { useAuth, useUser, useFirestore }from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';


const formSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export default function AdminLoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

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
        toast({
            variant: 'destructive',
            title: 'Login failed',
            description: 'Authentication service is not available.'
        });
        return;
    }
    try {
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        const loggedInUser = userCredential.user;

        if (loggedInUser && firestore) {
            const adminRoleDoc = doc(firestore, 'roles_admin', loggedInUser.uid);
            const adminDocSnapshot = await getDoc(adminRoleDoc);

            if (adminDocSnapshot.exists()) {
                // User is an admin, redirect
                router.push('/admin/memberships');
            } else {
                // Not an admin, sign out and show error
                await auth.signOut();
                setError('You are not authorized to access this panel.');
            }
        }
    } catch (e: any) {
        // Handle Firebase auth errors (wrong password, user not found, etc.)
        const errorMessage = e.code === 'auth/invalid-credential' 
            ? 'Invalid email or password.'
            : e.message || 'An unexpected error occurred.';
        setError(errorMessage);
    }
  }
  
  // This effect handles the case where an already-logged-in user (from a previous session)
  // navigates to the login page.
  useEffect(() => {
    const checkAdminStatus = async () => {
        if (!isUserLoading && user && firestore) {
            const adminRoleDoc = doc(firestore, 'roles_admin', user.uid);
            const adminDocSnapshot = await getDoc(adminRoleDoc);
            if (adminDocSnapshot.exists()) {
                router.push('/admin/memberships');
            }
            // If they are a user but not an admin, they just stay on the login page
            // they can attempt to log in as an admin.
        }
    };
    checkAdminStatus();
  }, [user, isUserLoading, firestore, router]);


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
