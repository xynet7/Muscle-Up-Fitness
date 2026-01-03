import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Dumbbell, Users, Award } from 'lucide-react';
import { MEMBERSHIP_PLANS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import placeholderImagesData from '@/lib/placeholder-images.json';

export default function HomePage() {
  const heroImage = placeholderImagesData.placeholderImages.find(p => p.id === 'hero-gym');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-auto pt-48 pb-20 md:pt-64 md:pb-28 flex items-center justify-center">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline tracking-tighter mb-4">
            Forge Your Strength
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Join MuscleUp and unlock your true potential. Premium facilities, expert trainers, and a community that inspires.
          </p>
          <Button size="lg" asChild>
            <Link href="#plans">
              View Membership Plans <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <Dumbbell className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-headline text-xl font-bold mb-2">Modern Equipment</h3>
              <p className="text-white/80 text-sm">State-of-the-art machines and free weights to help you reach your goals faster.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <Award className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-headline text-xl font-bold mb-2">Expert Trainers</h3>
              <p className="text-white/80 text-sm">Certified professionals dedicated to guiding you through every step of your journey.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-headline text-xl font-bold mb-2">Vibrant Community</h3>
              <p className="text-white/80 text-sm">Join a supportive and motivating community of fitness enthusiasts.</p>
            </div>
          </div>

        </div>
      </section>

      <section id="plans" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Choose Your Plan</h2>
            <p className="text-muted-foreground mt-2">Simple, transparent pricing for everyone.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {MEMBERSHIP_PLANS.map((plan) => (
              <Card key={plan.id} className={cn("flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2", plan.highlight && "border-primary ring-2 ring-primary shadow-lg")}>
                <CardHeader className="items-center text-center">
                  {plan.highlight && <Badge className="mb-2 absolute -top-3">Most Popular</Badge>}
                  <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="pt-2">
                    <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.duration}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant={plan.highlight ? 'default' : 'outline'}>
                    <Link href={`/receipt/${Date.now()}-${plan.id}`}>Subscribe Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
