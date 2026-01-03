import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Dumbbell, Sparkles, User, UserPlus, Shield } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Logo />
        <nav className="ml-auto flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/#plans">
              <Dumbbell className="h-4 w-4" />
              <span className="hidden sm:inline">Plans</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/workout-planner">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">AI Planner</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/login">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/admin/login">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Up</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
