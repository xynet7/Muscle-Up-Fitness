'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Dumbbell, Sparkles, User, Shield, LogIn, LogOut, UserCircle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useAuth, useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';


export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleLogout = () => {
    auth.signOut();
  };

  const getInitials = (name?: string | null) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length > 1 && nameParts[0] && nameParts[1]) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    if (nameParts[0]) {
      return nameParts[0][0].toUpperCase();
    }
    return '';
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Logo />
        <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center gap-2 sm:gap-4">
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
              
              {isUserLoading ? (
                <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                       <Avatar className="h-8 w-8">
                          <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                          <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                        </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                        <div className="flex flex-col items-start p-2">
                            <p className="font-medium">{user.displayName || 'User'}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/profile">
                            <UserCircle className="mr-2 h-4 w-4" />
                            <span>My Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <LogIn className="h-4 w-4" />
                      <span className="hidden sm:inline">Sign In</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link href="/login">
                        <User className="mr-2 h-4 w-4" />
                        <span>Member Login</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/login">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Login</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>
        </div>
      </div>
    </header>
  );
}
