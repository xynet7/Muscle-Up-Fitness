import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MEMBERSHIP_PLANS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { PlanDialog } from "./PlanDialog";

export default function PlansPage() {
  return (
    <Card>
      <CardHeader className="flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="font-headline">Manage Plans</CardTitle>
          <CardDescription>Create, edit, and remove gym membership plans.</CardDescription>
        </div>
        <PlanDialog>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Plan
            </Button>
        </PlanDialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden sm:table-cell">Features</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MEMBERSHIP_PLANS.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>
                  <div className="font-medium">{plan.name}</div>
                  {plan.highlight && <Badge variant="outline">Most Popular</Badge>}
                </TableCell>
                <TableCell>₹{plan.price}/{plan.duration}</TableCell>
                <TableCell className="hidden sm:table-cell">{plan.features.length} features</TableCell>
                <TableCell className="text-right">
                    <PlanDialog plan={plan}>
                        <Button variant="ghost" size="icon">
                            <span className="sr-only">Edit Plan</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </PlanDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
