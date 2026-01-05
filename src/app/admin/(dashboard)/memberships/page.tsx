'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MEMBERSHIP_PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, query, serverTimestamp, writeBatch } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { add } from "date-fns";

export default function MembershipsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const subscriptionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "subscriptions_flat"));
  }, [firestore]);

  const { data: subscriptions, isLoading: isLoadingSubscriptions } = useCollection(subscriptionsQuery);

  const getPlanName = (planId: string) => {
    return MEMBERSHIP_PLANS.find(p => p.id === planId)?.name || 'Unknown Plan';
  };
  
  const getPlanDurationMonths = (planId: string): number => {
    const plan = MEMBERSHIP_PLANS.find(p => p.id === planId);
    if (!plan) return 0;
    // A simple way to parse duration like "month", "6 months", "12 months"
    if (plan.duration === 'month') return 1;
    const months = parseInt(plan.duration.split(' ')[0]);
    return isNaN(months) ? 0 : months;
  }

  const handleApprove = async (subId: string, userId: string, planId: string) => {
    if(!firestore) return;
    
    // Create a batch
    const batch = writeBatch(firestore);

    // Reference to the subscription document in the user's subcollection
    const userSubDocRef = doc(firestore, 'users', userId, 'subscriptions', subId);
    
    // Reference to the subscription document in the flat collection for admins
    const flatSubDocRef = doc(firestore, 'subscriptions_flat', subId);
    
    try {
      const now = new Date();
      const durationMonths = getPlanDurationMonths(planId);
      const endDate = add(now, { months: durationMonths });

      const updateData = {
        status: 'active',
        startDate: now,
        endDate: endDate,
        approvedDate: serverTimestamp(),
      };
      
      // Add both update operations to the batch
      batch.update(userSubDocRef, updateData);
      batch.update(flatSubDocRef, updateData);

      // Commit the batch
      await batch.commit();

      toast({
        title: "Membership Approved",
        description: "The user's membership is now active.",
      });

    } catch (error) {
       toast({
        variant: "destructive",
        title: "Approval Failed",
        description: "Could not approve the membership. You may not have the required permissions.",
      });
      console.error("Error approving membership:", error);
    }
  };
  
  const sortedSubscriptions = subscriptions?.sort((a, b) => {
    const statusOrder = { pending: 1, active: 2, expired: 3, cancelled: 4 };
    if (statusOrder[a.status as keyof typeof statusOrder] !== statusOrder[b.status as keyof typeof statusOrder]) {
      return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
    }
    const dateA = a.requestedDate?.toDate ? a.requestedDate.toDate() : new Date(0);
    const dateB = b.requestedDate?.toDate ? b.requestedDate.toDate() : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Manage Memberships</CardTitle>
        <CardDescription>View and manage all active, expired, and cancelled memberships.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead className="hidden sm:table-cell">Plan</TableHead>
              <TableHead className="hidden md:table-cell">Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingSubscriptions && (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                   <TableCell className="text-right"><Skeleton className="h-8 w-24 rounded-md" /></TableCell>
                </TableRow>
              ))
            )}
            {!isLoadingSubscriptions && sortedSubscriptions?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        <Alert className="max-w-md mx-auto">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>No Subscriptions</AlertTitle>
                            <AlertDescription>
                                No user subscriptions found.
                            </AlertDescription>
                        </Alert>
                    </TableCell>
                </TableRow>
            )}
            {!isLoadingSubscriptions && sortedSubscriptions?.map((membership: any) => (
              <TableRow key={membership.id}>
                <TableCell>
                  <div className="font-medium">{membership.userName}</div>
                  <div className="text-sm text-muted-foreground">{membership.userEmail}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{getPlanName(membership.membershipPlanId)}</TableCell>
                <TableCell className="hidden md:table-cell">
                    {membership.requestedDate?.toDate ? membership.requestedDate.toDate().toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      membership.status === "active" ? "default" :
                      membership.status === "pending" ? "secondary" : "destructive"
                    }
                    className={cn(
                      'capitalize',
                       membership.status === "active" && "bg-green-600 hover:bg-green-700",
                       membership.status === "pending" && "bg-yellow-500 hover:bg-yellow-600 text-white",
                    )}
                  >
                   {membership.status === 'pending' && <Clock className="mr-1.5 h-3 w-3" />}
                    {membership.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                    {membership.status === 'pending' ? (
                        <Button size="sm" onClick={() => handleApprove(membership.id, membership.userId, membership.membershipPlanId)}>
                          <CheckCircle className="mr-2 h-4 w-4"/> Approve
                        </Button>
                    ) : (
                        <span className="text-xs text-muted-foreground">No action</span>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
