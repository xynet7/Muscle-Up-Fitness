'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { MEMBERSHIP_PLANS } from '@/lib/constants';
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function SubscribePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const params = useParams();
  const { planId } = params;
  const { toast } = useToast();

  const plan = MEMBERSHIP_PLANS.find((p) => p.id === planId);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSubscribe = async () => {
    if (!user || !firestore || !plan) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not process subscription. User or plan not found.",
      });
      return;
    }

    try {
        const subscriptionsColRef = collection(firestore, 'users', user.uid, 'subscriptions');
        const newSubDocRef = doc(subscriptionsColRef); // Create a new doc with a generated ID
        const flatSubscriptionsColRef = collection(firestore, 'subscriptions_flat');

        const subscriptionData = {
            id: newSubDocRef.id,
            userId: user.uid,
            membershipPlanId: plan.id,
            status: 'pending',
            requestedDate: serverTimestamp(),
        };

        const flatSubscriptionData = {
            ...subscriptionData,
            userName: user.displayName,
            userEmail: user.email,
        }

        // Set the document in the user's subcollection
        setDocumentNonBlocking(newSubDocRef, subscriptionData, {});
        
        // Set the denormalized document in the flat collection for admins
        const flatDocRef = doc(flatSubscriptionsColRef, newSubDocRef.id);
        setDocumentNonBlocking(flatDocRef, flatSubscriptionData, {});

        toast({
            title: "Request Sent!",
            description: "Your membership request has been sent for approval.",
        });

        router.push('/profile');

    } catch (error) {
      console.error("Subscription Error: ", error);
      toast({
        variant: "destructive",
        title: "Subscription Failed",
        description: "There was an error sending your membership request.",
      });
    }
  };

  if (isUserLoading || !user || !plan) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Logo className="justify-center mb-2" />
          <CardTitle className="font-headline text-2xl">Confirm Your Subscription</CardTitle>
          <CardDescription>You are about to subscribe to the <span className="font-semibold text-primary">{plan.name}</span> plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="rounded-lg border bg-background p-4">
                <div className="flex justify-between items-center">
                    <span className="font-medium">{plan.name}</span>
                    <span className="font-bold text-lg">₹{plan.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Billed once for {plan.duration}.</p>
            </div>
             <p className="text-xs text-muted-foreground text-center">
                By clicking "Confirm & Subscribe", your request will be sent to our team for approval. 
                Your membership will become active once approved.
             </p>
        </CardContent>
        <CardContent>
          <Button onClick={handleSubscribe} className="w-full">
            <CheckCircle className="mr-2 h-4 w-4" />
            Confirm & Subscribe
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
