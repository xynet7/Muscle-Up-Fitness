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

const ExerciseSchema = z.object({
  name: z.string().describe('Name of the exercise.'),
  sets: z.string().describe('Number of sets (e.g., "3-4").'),
  reps: z.string().describe('Number of repetitions (e.g., "8-12").'),
  rest: z.string().describe('Rest time between sets (e.g., "60-90 seconds").'),
  notes: z.string().optional().describe('Additional notes or instructions for the exercise.'),
});

const WorkoutDaySchema = z.object({
  day: z.string().describe('The day of the workout (e.g., "Day 1", "Monday").'),
  focus: z.string().describe('The main muscle group or focus for the day (e.g., "Chest & Triceps", "Full Body Strength").'),
  exercises: z.array(ExerciseSchema).describe('A list of exercises for the workout day.'),
});

const PersonalizedWorkoutPlanOutputSchema = z.object({
  title: z.string().describe('A catchy and descriptive title for the generated workout plan.'),
  weeklySchedule: z.array(WorkoutDaySchema).describe('A structured array representing the weekly workout schedule.'),
  disclaimer: z
    .string()
    .optional()
    .describe('A disclaimer to consult a doctor before starting any new workout regimen.'),
});
export type PersonalizedWorkoutPlanOutput = z.infer<typeof PersonalizedWorkoutPlanOutputSchema>;

export async function getPersonalizedWorkoutPlan(input: PersonalizedWorkoutPlanInput): Promise<PersonalizedWorkoutPlanOutput> {
  return personalizedWorkoutPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedWorkoutPlanPrompt',
  input: {schema: PersonalizedWorkoutPlanInputSchema},
  output: {schema: PersonalizedWorkoutPlanOutputSchema},
  prompt: `You are a world-class certified personal trainer and fitness coach. Your task is to generate a detailed, structured, and personalized workout plan based on the user's specific details.

The output MUST be a valid JSON object matching the provided schema.

User Details:
- Fitness Goals: {{{fitnessGoals}}}
- Subscription Level: {{{subscriptionLevel}}}
- Current Fitness Level: {{{currentFitnessLevel}}}
- Equipment Available: {{{equipmentAvailable}}}
- Time Commitment: {{{timeCommitment}}}

Instructions:
1.  Create a catchy and motivating 'title' for the workout plan.
2.  Structure the plan into a 'weeklySchedule', which is an array of workout days.
3.  For each workout day, specify the 'day' (e.g., "Day 1", "Monday"), the 'focus' (e.g., "Upper Body Strength"), and a list of 'exercises'.
4.  For each exercise, provide the 'name', 'sets', 'reps', and 'rest' duration. Add 'notes' for tips on form or intensity where helpful.
5.  Tailor the plan's complexity and detail to the 'subscriptionLevel'. A 'VIP' plan should be more comprehensive than a 'basic' one, potentially including warm-ups, cool-downs, or more advanced techniques.
6.  Include a standard 'disclaimer' advising the user to consult a healthcare professional before starting the plan.
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
