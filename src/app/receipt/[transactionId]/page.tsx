'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, DocumentData } from 'firebase/firestore';
import { MEMBERSHIP_PLANS } from '@/lib/constants';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/Logo';
import { Printer, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ReceiptPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const params = useParams();
  const transactionId = params.transactionId as string;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const subscriptionDocRef = useMemoFirebase(() => {
    if (!user || !firestore || !transactionId) return null;
    // The receipt is for a subscription, which is stored in a subcollection.
    return doc(firestore, 'users', user.uid, 'subscriptions', transactionId);
  }, [user, firestore, transactionId]);

  const { data: subscription, isLoading: isLoadingSubscription } = useDoc(subscriptionDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const planDetails = subscription ? MEMBERSHIP_PLANS.find(p => p.id === subscription.membershipPlanId) : null;

  const handlePrint = () => {
    window.print();
  };

  const renderContent = () => {
    if (isLoadingSubscription || isUserLoading || !isClient) {
      return <ReceiptSkeleton />;
    }

    if (!subscription || !planDetails) {
      return (
         <Alert variant="destructive" className="mt-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Receipt Not Found</AlertTitle>
            <AlertDescription>
                We could not find a receipt with this transaction ID for your account. Please check the ID or contact support.
            </AlertDescription>
        </Alert>
      );
    }
    
    const purchaseDate = subscription.approvedDate?.toDate ? format(subscription.approvedDate.toDate(), 'PPP p') : (subscription.requestedDate?.toDate ? format(subscription.requestedDate.toDate(), 'PPP') : 'N/A');

    return (
      <>
        <CardHeader className="text-center">
            <div className="mx-auto">
                <Logo />
            </div>
            <CardTitle className="font-headline text-2xl mt-4">Payment Receipt</CardTitle>
            <CardDescription>Thank you for your purchase!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <h3 className="font-semibold">Billed To:</h3>
                <p className="text-muted-foreground">{user?.displayName}</p>
                <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <Separator />
            <div className="space-y-4">
                <h3 className="font-semibold">Transaction Details:</h3>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <span>{subscription.id}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Date of Purchase:</span>
                    <span>{purchaseDate}</span>
                </div>
            </div>
            <Separator />
             <div className="space-y-4">
                <h3 className="font-semibold">Order Summary:</h3>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium">{planDetails.name} Membership</p>
                        <p className="text-sm text-muted-foreground">{planDetails.duration}</p>
                    </div>
                    <p className="font-bold text-lg">₹{planDetails.price}</p>
                </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Amount Paid</span>
                <span>₹{planDetails.price}</span>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
            <Button onClick={handlePrint} className="w-full print:hidden">
                <Printer className="mr-2 h-4 w-4" /> Print Receipt
            </Button>
            <p className="text-xs text-muted-foreground text-center print:hidden">
                If you have any questions, please contact our support team.
            </p>
        </CardFooter>
      </>
    );
  };

  return (
    <div className="bg-muted/40 min-h-screen py-12 px-4 flex items-center justify-center print:bg-white print:py-0">
        <Card className="w-full max-w-lg shadow-lg print:shadow-none print:border-none">
            {renderContent()}
        </Card>
    </div>
  );
}

function ReceiptSkeleton() {
    return (
        <>
            <CardHeader className="text-center items-center">
                <Skeleton className="h-10 w-24 mb-4" />
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-64 mt-1" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-56" />
                </div>
                <Separator />
                <div className="space-y-4">
                     <Skeleton className="h-5 w-32" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-full" />
                </div>
                <Separator />
                <div className="space-y-4">
                     <Skeleton className="h-5 w-32" />
                     <Skeleton className="h-8 w-full" />
                </div>
                <Separator />
                <div className="flex justify-between">
                     <Skeleton className="h-6 w-36" />
                     <Skeleton className="h-6 w-24" />
                </div>
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </>
    )
}
