'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { useAuth, useUser, useFirestore } from "@/firebase";

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
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const avatar = placeholderImagesData.placeholderImages.find(p => p.id === 'admin-avatar');

  useEffect(() => {
    // If auth state is still loading, do nothing yet.
    if (isUserLoading || !firestore) {
      return;
    }

    // If there's no user, redirect to login with an error.
    if (!user) {
      router.push('/admin/login?error=You must be logged in to view this page.');
      return;
    }

    // Check for admin role once we have a user.
    const checkAdminStatus = async () => {
      const adminRoleDoc = doc(firestore, 'roles_admin', user.uid);
      try {
        const adminDocSnapshot = await getDoc(adminRoleDoc);
        if (adminDocSnapshot.exists()) {
          setIsAuthorized(true);
        } else {
          // If user is not an admin, sign them out and redirect.
          await auth.signOut();
          router.push('/admin/login?error=You are not authorized to access this panel.');
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        await auth.signOut();
        router.push('/admin/login?error=An error occurred while verifying your permissions.');
      }
    };

    checkAdminStatus();

  }, [user, isUserLoading, firestore, auth, router]);

  // While loading or verifying, show a loading skeleton.
  if (isUserLoading || !isAuthorized) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Skeleton className="h-full w-full" />
        </div>
    );
  }

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/admin/login');
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
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
          <SidebarMenuButton asChild variant="ghost" onClick={handleLogout}>
            <Link href="#">
              <LogOut />
              <span>Logout</span>
            </Link>
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
