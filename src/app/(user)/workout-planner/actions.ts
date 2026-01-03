'use server';
import { getPersonalizedWorkoutPlan, type PersonalizedWorkoutPlanInput } from '@/ai/flows/personalized-workout-plan-suggestions';

export async function generateWorkoutPlanAction(input: PersonalizedWorkoutPlanInput) {
  try {
    const result = await getPersonalizedWorkoutPlan(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate workout plan. Please try again.' };
  }
}
