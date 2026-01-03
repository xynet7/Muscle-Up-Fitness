'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MEMBERSHIP_PLANS } from '@/lib/constants';
import { format } from 'date-fns';
import { Crown, Dumbbell, Star, AlertTriangle } from 'lucide-react';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const subscriptionsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'subscriptions');
  }, [user, firestore]);

  const { data: subscriptions, isLoading: isLoadingSubscriptions } = useCollection(subscriptionsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const getInitials = (name?: string | null) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length > 1 && nameParts[0] && nameParts[1]) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    if (nameParts[0]) {
      return nameParts[0][0].toUpperCase();
    }
    return '';
  };

  const getPlanDetails = (planId: string) => {
    return MEMBERSHIP_PLANS.find(p => p.id === planId);
  };
  
  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic':
        return <Dumbbell className="h-5 w-5" />;
      case 'premium':
        return <Star className="h-5 w-5" />;
      case 'vip':
        return <Crown className="h-5 w-5" />;
      default:
        return null;
    }
  };


  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-8 w-1/3" />
            <div className="space-y-4">
               <Skeleton className="h-24 w-full" />
               <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-muted/40 min-h-screen">
        <div className="container mx-auto max-w-4xl py-12 px-4">
        <Card className="shadow-lg">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-muted/50 p-6">
            <Avatar className="h-20 w-20 border-4 border-background shadow-md">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                <AvatarFallback className="text-2xl">{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
            <div className="w-full">
                <CardTitle className="font-headline text-3xl">{user.displayName}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
            </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
            <div>
                <h3 className="text-xl font-semibold font-headline mb-4">My Memberships</h3>
                {isLoadingSubscriptions ? (
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full rounded-lg" />
                    </div>
                ) : subscriptions && subscriptions.length > 0 ? (
                <div className="grid gap-4">
                    {subscriptions.map((sub: any) => {
                    const plan = getPlanDetails(sub.membershipPlanId);
                    if (!plan) return null;

                    const endDate = sub.endDate?.toDate ? sub.endDate.toDate() : new Date(sub.endDate);
                    const isActive = endDate > new Date();

                    return (
                        <div key={sub.id} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary`}>
                                    {getPlanIcon(plan.id)}
                                </div>
                                <div>
                                <p className="font-semibold">{plan.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    Subscribed on {sub.startDate?.toDate ? format(sub.startDate.toDate(), 'PPP') : 'N/A'}.
                                    Renews on {format(endDate, 'PPP')}.
                                </p>
                                </div>
                            </div>
                            <Badge variant={isActive ? "default" : "destructive"} className={isActive ? "bg-green-600" : ""}>
                                {isActive ? 'Active' : 'Expired'}
                            </Badge>
                        </div>
                    );
                    })}
                </div>
                ) : (
                 <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>No Memberships Found</AlertTitle>
                    <AlertDescription>
                        You don't have any active or past memberships. Check out our plans to get started!
                    </AlertDescription>
                </Alert>
                )}
            </div>
            </CardContent>
        </Card>
        </div>
    </div>
  );
}
