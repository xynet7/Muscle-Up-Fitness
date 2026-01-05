'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, DocumentData, doc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MEMBERSHIP_PLANS } from '@/lib/constants';
import { format, startOfDay, isEqual } from 'date-fns';
import { Crown, Dumbbell, Star, AlertTriangle, User, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const subscriptionsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'subscriptions');
  }, [user, firestore]);

  const { data: subscriptions, isLoading: isLoadingSubscriptions } = useCollection(subscriptionsQuery);

  const attendanceQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'attendance');
  }, [user, firestore]);

  const { data: attendance, isLoading: isLoadingAttendance } = useCollection(attendanceQuery);

  const attendedDays = useMemo(() => {
    if (!attendance) return [];
    // Use a Set to store unique date strings to prevent duplicates
    const uniqueDateStrings = new Set(
      attendance.map(a => format(startOfDay(a.date.toDate()), 'yyyy-MM-dd'))
    );
    // Convert the unique strings back to Date objects
    return Array.from(uniqueDateStrings).map(dateStr => new Date(dateStr));
  }, [attendance]);

  const handleDayClick = async (day: Date | undefined, { selected }: { selected: boolean }) => {
    if (!day || !user || !firestore) return;
    
    // Normalize the clicked day to the start of the day to ensure consistency
    const dayStart = startOfDay(day);
    const docId = format(dayStart, 'yyyy-MM-dd');
    const docRef = doc(firestore, `users/${user.uid}/attendance/${docId}`);

    if (selected) {
      // Day was already selected, so un-select it (delete the record)
      deleteDocumentNonBlocking(docRef);
       toast({ title: 'Attendance Removed', description: `Removed attendance for ${format(dayStart, 'PPP')}.` });
    } else {
      // Day was not selected, so select it (create the record)
      const attendanceData = {
        id: docId,
        userId: user.uid,
        date: dayStart,
      };
      setDocumentNonBlocking(docRef, attendanceData, {});
      toast({ title: 'Attendance Marked!', description: `You marked your attendance for ${format(dayStart, 'PPP')}.` });
    }
  };
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

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

  const sortedSubscriptions = subscriptions?.sort((a, b) => {
    const dateA = a.requestedDate?.toDate ? a.requestedDate.toDate() : new Date(0);
    const dateB = b.requestedDate?.toDate ? b.requestedDate.toDate() : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });


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
          <CardContent className="space-y-6 pt-6">
            <Skeleton className="h-8 w-1/3" />
            <div className="space-y-4">
               <Skeleton className="h-24 w-full" />
               <Skeleton className="h-24 w-full" />
            </div>
             <Skeleton className="h-8 w-1/3 mt-6" />
             <Skeleton className="h-64 w-full" />
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
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
            </Avatar>
            <div className="w-full">
                <CardTitle className="font-headline text-3xl">{user.displayName || 'User'}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
            </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
            <div>
                <h3 className="text-xl font-semibold font-headline mb-4">My Memberships</h3>
                {isLoadingSubscriptions ? (
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full rounded-lg" />
                    </div>
                ) : sortedSubscriptions && sortedSubscriptions.length > 0 ? (
                <div className="grid gap-4">
                    {sortedSubscriptions.map((sub: any) => {
                      const plan = getPlanDetails(sub.membershipPlanId);
                      if (!plan) return null;

                      const getStatusBadge = () => {
                          switch (sub.status) {
                            case 'active':
                              return <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>;
                            case 'pending':
                              return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white"><Clock className="mr-1.5 h-3 w-3" />Pending Approval</Badge>;
                            case 'expired':
                                return <Badge variant="destructive">Expired</Badge>;
                            case 'cancelled':
                                return <Badge variant="destructive">Cancelled</Badge>;
                            default:
                                return <Badge variant="secondary">{sub.status}</Badge>;
                          }
                      };

                      const getSubscriptionPeriod = () => {
                        if (!isClient) return 'Loading...';
                        if (sub.status === 'active' && sub.startDate && sub.endDate) {
                          const startDate = sub.startDate?.toDate ? format(sub.startDate.toDate(), 'PPP') : 'N/A';
                          const endDate = sub.endDate?.toDate ? format(sub.endDate.toDate(), 'PPP') : 'N/A';
                          return `Active from ${startDate} to ${endDate}.`;
                        }
                        if(sub.status === 'pending' && sub.requestedDate) {
                            const requestedDate = sub.requestedDate?.toDate ? format(sub.requestedDate.toDate(), 'PPP') : 'N/A';
                            return `Requested on ${requestedDate}.`
                        }
                        return 'Awaiting activation to see subscription period.';
                      }

                      return (
                          <div key={sub.id} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-4">
                                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary')}>
                                      {getPlanIcon(plan.id)}
                                  </div>
                                  <div>
                                  <p className="font-semibold">{plan.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                      {getSubscriptionPeriod()}
                                  </p>
                                  </div>
                              </div>
                              {getStatusBadge()}
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
            <div>
                 <h3 className="text-xl font-semibold font-headline mb-4">My Attendance</h3>
                 <Card className="p-4 flex justify-center">
                    {isLoadingAttendance ? (
                        <Skeleton className="h-80 w-full max-w-sm" />
                    ) : (
                        <Calendar
                            mode="multiple"
                            min={0}
                            selected={attendedDays}
                            onDayClick={handleDayClick}
                            className="p-0"
                            classNames={{
                                day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground",
                                day_today: "bg-accent text-accent-foreground",
                                day_outside: "text-muted-foreground opacity-50",
                                cell: "text-center",
                            }}
                            footer={<p className="text-xs text-muted-foreground pt-4 text-center">Select a day to mark your attendance.</p>}
                        />
                    )}
                 </Card>
            </div>
            </CardContent>
        </Card>
        </div>
    </div>
  );
}
