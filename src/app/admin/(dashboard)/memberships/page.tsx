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
import { MOCK_MEMBERSHIPS, MEMBERSHIP_PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function MembershipsPage() {
  const getPlanName = (planId: string) => {
    return MEMBERSHIP_PLANS.find(p => p.id === planId)?.name || 'Unknown Plan';
  };

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
              <TableHead className="hidden md:table-cell">Start Date</TableHead>
              <TableHead className="hidden md:table-cell">End Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_MEMBERSHIPS.map((membership) => (
              <TableRow key={membership.id}>
                <TableCell>
                  <div className="font-medium">{membership.userName}</div>
                  <div className="text-sm text-muted-foreground">{membership.userEmail}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{getPlanName(membership.planId)}</TableCell>
                <TableCell className="hidden md:table-cell">{membership.startDate}</TableCell>
                <TableCell className="hidden md:table-cell">{membership.endDate}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      membership.status === "active" ? "default" :
                      membership.status === "expired" ? "secondary" : "destructive"
                    }
                    className={cn(
                      'capitalize',
                      membership.status === "active" && "bg-green-600 hover:bg-green-700 border-transparent text-primary-foreground"
                    )}
                  >
                    {membership.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
