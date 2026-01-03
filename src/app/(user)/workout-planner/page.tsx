import { WorkoutPlannerForm } from './WorkoutPlannerForm';

export default function WorkoutPlannerPage() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline">AI Workout Planner</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Get a tailored workout plan based on your goals, experience, and equipment. Let our AI be your personal trainer.
          </p>
        </div>
        <WorkoutPlannerForm />
      </div>
    </section>
  );
}
