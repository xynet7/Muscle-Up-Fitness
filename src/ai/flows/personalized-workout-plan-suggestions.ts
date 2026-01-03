'use server';
/**
 * @fileOverview Provides personalized workout plan suggestions based on user fitness goals and subscription level.
 *
 * - getPersonalizedWorkoutPlan - A function that generates a personalized workout plan.
 * - PersonalizedWorkoutPlanInput - The input type for the getPersonalizedWorkoutPlan function.
 * - PersonalizedWorkoutPlanOutput - The return type for the getPersonalizedWorkoutPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedWorkoutPlanInputSchema = z.object({
  fitnessGoals: z
    .string()
    .describe('The fitness goals of the user (e.g., weight loss, muscle gain, endurance).'),
  subscriptionLevel: z
    .string()
    .describe(
      'The subscription level of the user (e.g., basic, premium, VIP). This affects the complexity and resources available in the workout plan.'
    ),
  currentFitnessLevel: z
    .string()
    .describe('The current fitness level of the user (e.g. beginner, intermediate, advanced)'),
  equipmentAvailable: z
    .string()
    .describe('The equipment available to the user (e.g. home gym, full gym, bodyweight only)'),
  timeCommitment: z
    .string()
    .describe('The amount of time the user can commit to working out per week (e.g. 3 hours, 5 hours, everyday).'),
});
export type PersonalizedWorkoutPlanInput = z.infer<typeof PersonalizedWorkoutPlanInputSchema>;

const PersonalizedWorkoutPlanOutputSchema = z.object({
  workoutPlan: z.string().describe('A personalized workout plan based on the user inputs.'),
  disclaimer: z.string().optional().describe('A disclaimer to consult a doctor before starting any workout plan.')
});
export type PersonalizedWorkoutPlanOutput = z.infer<typeof PersonalizedWorkoutPlanOutputSchema>;

export async function getPersonalizedWorkoutPlan(input: PersonalizedWorkoutPlanInput): Promise<PersonalizedWorkoutPlanOutput> {
  return personalizedWorkoutPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedWorkoutPlanPrompt',
  input: {schema: PersonalizedWorkoutPlanInputSchema},
  output: {schema: PersonalizedWorkoutPlanOutputSchema},
  prompt: `You are a certified personal trainer. Generate a personalized workout plan based on the user's fitness goals, subscription level, current fitness level, equipment available and time commitment.

Fitness Goals: {{{fitnessGoals}}}
Subscription Level: {{{subscriptionLevel}}}
Current Fitness Level: {{{currentFitnessLevel}}}
Equipment Available: {{{equipmentAvailable}}}
Time Commitment: {{{timeCommitment}}}

Consider the subscription level when creating the workout plan. Premium and VIP members should receive more detailed and comprehensive plans.

Include a disclaimer to consult a doctor before starting any workout plan.
`,
});

const personalizedWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'personalizedWorkoutPlanFlow',
    inputSchema: PersonalizedWorkoutPlanInputSchema,
    outputSchema: PersonalizedWorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
