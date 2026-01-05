'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { type PersonalizedWorkoutPlanOutput } from '@/ai/flows/personalized-workout-plan-suggestions';
import { generateWorkoutPlanAction } from './actions';
import { Loader2, Sparkles, AlertTriangle, Target, Dumbbell, Timer, Repeat } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  fitnessGoals: z.string().min(1, 'Please specify your fitness goals.'),
  subscriptionLevel: z.enum(['basic', 'premium', 'vip']),
  currentFitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  equipmentAvailable: z.enum(['bodyweight', 'home_gym', 'full_gym']),
  timeCommitment: z.string().min(1, 'Please specify your time commitment.'),
});

type FormValues = z.infer<typeof formSchema>;
type MembershipTier = 'basic' | 'premium' | 'vip';

export function WorkoutPlannerForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PersonalizedWorkoutPlanOutput | null>(null);
  const { toast } = useToast();
  
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const subscriptionsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'subscriptions');
  }, [user, firestore]);

  const { data: subscriptions, isLoading: isLoadingSubscriptions } = useCollection(subscriptionsQuery);

  const [highestTier, setHighestTier] = useState<MembershipTier>('basic');
  const [isTierLoading, setIsTierLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fitnessGoals: '',
      subscriptionLevel: 'basic',
      currentFitnessLevel: 'intermediate',
      equipmentAvailable: 'full_gym',
      timeCommitment: '3-4 times a week, 60 minutes per session',
    },
  });

  useEffect(() => {
    if (isUserLoading || isLoadingSubscriptions) {
      setIsTierLoading(true);
      return;
    }

    let activeTier: MembershipTier = 'basic';
    if (subscriptions && subscriptions.length > 0) {
      const tierOrder: MembershipTier[] = ['vip', 'premium', 'basic'];
      const activeSubscriptions = subscriptions.filter((sub: any) => {
          // Check for active status and a valid end date
          const endDate = sub.endDate?.toDate ? sub.endDate.toDate() : null;
          return sub.status === 'active' && endDate && endDate > new Date();
      });

      for (const tier of tierOrder) {
        if (activeSubscriptions.some((sub: any) => sub.membershipPlanId === tier)) {
          activeTier = tier;
          break;
        }
      }
    }
    
    setHighestTier(activeTier);
    form.setValue('subscriptionLevel', activeTier);
    setIsTierLoading(false);

  }, [user, isUserLoading, subscriptions, isLoadingSubscriptions, form]);

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    const response = await generateWorkoutPlanAction({
      ...values,
      equipmentAvailable: values.equipmentAvailable.replace('_', ' ')
    });
    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Create Your Workout</CardTitle>
          <CardDescription>Fill in your details and our AI will generate a personalized plan for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fitnessGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fitness Goals</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., lose 10 pounds, build muscle, run a 5k" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="currentFitnessLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Fitness Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select your fitness level" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="equipmentAvailable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equipment Available</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select your equipment" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bodyweight">Bodyweight only</SelectItem>
                          <SelectItem value="home_gym">Home Gym</SelectItem>
                          <SelectItem value="full_gym">Full Gym</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                control={form.control}
                name="timeCommitment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Commitment</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 3 hours per week" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="subscriptionLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Membership Tier (for plan detail)</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value} disabled>
                        <FormControl>
                          <SelectTrigger>
                            {isTierLoading ? <Skeleton className="h-5 w-24" /> : <SelectValue />}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <Button type="submit" disabled={isLoading || isTierLoading} className="w-full">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Generate Plan</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="flex items-start justify-center rounded-lg border-2 border-dashed border-border p-4 min-h-[400px] overflow-y-auto">
        {isLoading && (
          <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse self-center">
            <Sparkles className="h-12 w-12 text-primary" />
            <p className="font-semibold">Generating your personalized plan...</p>
            <p className="text-sm">This may take a moment.</p>
          </div>
        )}
        {!isLoading && result && (
          <Card className="w-full bg-transparent shadow-none border-none animate-in fade-in">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2"><Sparkles className="text-primary"/> {result.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                {result.weeklySchedule?.map((day, dayIndex) => (
                  <AccordionItem value={`item-${dayIndex}`} key={dayIndex}>
                    <AccordionTrigger className="font-semibold text-lg hover:no-underline">
                      <div className='flex items-center gap-3'>
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm">{dayIndex + 1}</div>
                        <div>
                            <p>{day.day}: <span className="font-normal text-base">{day.focus}</span></p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-4 pt-2">
                        {day.exercises.map((exercise, exIndex) => (
                          <li key={exIndex} className="p-4 bg-muted/50 rounded-md border">
                            <h4 className="font-semibold flex items-center gap-2"><Dumbbell size={16}/> {exercise.name}</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-sm text-muted-foreground">
                                <p className="flex items-center gap-1.5"><Repeat size={14}/> <strong>Sets:</strong> {exercise.sets}</p>
                                <p className="flex items-center gap-1.5"><Target size={14}/> <strong>Reps:</strong> {exercise.reps}</p>
                                <p className="flex items-center gap-1.5"><Timer size={14}/> <strong>Rest:</strong> {exercise.rest}</p>
                            </div>
                            {exercise.notes && <p className="text-xs mt-2 text-muted-foreground/80"><em>Note: {exercise.notes}</em></p>}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {result.disclaimer && (
                <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800 mt-6">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <h4 className="font-bold">Disclaimer</h4>
                    <p className="mt-1">{result.disclaimer}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        {!isLoading && !result && (
          <div className="text-center text-muted-foreground p-8 self-center">
            <h3 className="font-headline text-lg">Your workout plan will appear here.</h3>
            <p className="mt-2 text-sm">Fill out the form to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
