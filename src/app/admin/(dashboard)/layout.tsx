'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, useUser } from "@/firebase";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { ADMIN_NAV_LINKS } from "@/lib/constants";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import placeholderImagesData from "@/lib/placeholder-images.json";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const avatar = placeholderImagesData.placeholderImages.find(p => p.id === 'admin-avatar');

  useEffect(() => {
    // If auth state is done loading and there is still no user,
    // they are not logged in. Redirect to login.
    if (!isUserLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    if (!auth) return;
    await auth.signOut();
    router.push('/admin/login');
  };

  // While loading user, show a loading screen.
  // We no longer check for authorization here, just authentication.
  if (isUserLoading || !user) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Logo />
                <p className="text-muted-foreground">Loading...</p>
                <div className="w-full max-w-xs">
                    <Skeleton className="h-40 w-full" />
                </div>
            </div>
        </div>
    );
  }

  // Render the dashboard if authenticated.
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo disableLink={true} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {ADMIN_NAV_LINKS.map((link) => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(link.href)}>
                  <Link href={link.href}>
                    <link.icon />
                    <span>{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="space-y-2">
          {isClient && user && (
            <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
              <Avatar className="h-9 w-9">
                {avatar && <AvatarImage src={user.photoURL || avatar.imageUrl} data-ai-hint={avatar.imageHint} />}
                <AvatarFallback>{user.displayName?.charAt(0) ?? 'A'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold truncate">{user.displayName || "Admin User"}</span>
                  <span className="text-xs text-muted-foreground truncate">{user.email || "admin@muscleup.com"}</span>
              </div>
            </div>
          )}
          {!isClient && (
             <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex flex-col gap-1.5 overflow-hidden w-full">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                </div>
              </div>
          )}
          <SidebarMenuButton asChild variant="ghost" onClick={handleLogout}>
            <button type="button">
              <LogOut />
              <span>Logout</span>
            </button>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:bg-transparent md:border-0 md:h-auto">
            <SidebarTrigger className="md:hidden" />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
