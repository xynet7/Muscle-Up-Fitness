'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type MEMBERSHIP_PLANS } from "@/lib/constants";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

type Plan = typeof MEMBERSHIP_PLANS[0];

interface PlanDialogProps {
    children: React.ReactNode;
    plan?: Plan;
}

export function PlanDialog({ children, plan }: PlanDialogProps) {
    const [open, setOpen] = useState(false);
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-headline">{plan ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
                    <DialogDescription>
                        {plan ? 'Update the details of this membership plan.' : 'Fill in the details for the new membership plan.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" defaultValue={plan?.name} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">Price (₹)</Label>
                        <Input id="price" type="number" step="0.01" defaultValue={plan?.price} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="duration" className="text-right">Duration</Label>
                        <Input id="duration" defaultValue={plan?.duration} className="col-span-3" placeholder="e.g., month, 6 months" />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="features" className="text-right pt-2">Features</Label>
                        <Textarea id="features" defaultValue={plan?.features.join('\n')} className="col-span-3" placeholder="One feature per line" rows={4} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                         <div className="col-start-2 col-span-3 flex items-center space-x-2">
                            <Checkbox id="highlight" defaultChecked={plan?.highlight} />
                            <label
                                htmlFor="highlight"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Mark as "Most Popular"
                            </label>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" onClick={() => setOpen(false)}>{plan ? 'Save Changes' : 'Create Plan'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
