'use client'; // For window.print()

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { Printer } from "lucide-react";
import { MEMBERSHIP_PLANS } from "@/lib/constants";

export default function ReceiptPage({ params }: { params: { transactionId: string } }) {
  const { transactionId } = params;
  const [timestamp, planId] = transactionId.split('-');
  
  const purchaseDate = new Date(parseInt(timestamp)).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const planDetails = MEMBERSHIP_PLANS.find(p => p.id === planId) || { name: 'Unknown Plan', price: '0.00' };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 print:bg-white print:block">
      <Card className="w-full max-w-2xl print:shadow-none print:border-none">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Logo />
              <CardDescription className="mt-2">Thank you for your purchase!</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={() => window.print()} className="print:hidden">
              <Printer className="h-4 w-4" />
              <span className="sr-only">Print Receipt</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <h3 className="font-semibold font-headline text-lg">Transaction Receipt</h3>
            <Separator />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="font-medium text-muted-foreground">Transaction ID:</span>
              <span className="text-right font-mono">{transactionId}</span>
              <span className="font-medium text-muted-foreground">Date:</span>
              <span className="text-right">{purchaseDate}</span>
              <span className="font-medium text-muted-foreground">Billed To:</span>
              <span className="text-right">John Doe (example)</span>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2 font-medium">
              <span>Description</span>
              <span className="text-right">Amount</span>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
              <span>MuscleUp - {planDetails.name} Membership</span>
              <span className="text-right">₹{planDetails.price}</span>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2 font-bold text-lg">
              <span>Total Paid</span>
              <span className="text-right">₹{planDetails.price}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <p>If you have any questions, contact us at support@muscleup.com.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
