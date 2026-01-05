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
  const [isVerifying, setIsVerifying] = useState(true);

  const avatar = placeholderImagesData.placeholderImages.find(p => p.id === 'admin-avatar');

  useEffect(() => {
    // Wait until Firebase auth state is resolved.
    if (isUserLoading || !firestore || !auth) {
      return;
    }

    // If there's no user, they are not logged in. Redirect to login.
    if (!user) {
      router.push('/admin/login?error=You must be logged in to view this page.');
      return;
    }

    // User is logged in, now check for admin role.
    const checkAdminStatus = async () => {
      setIsVerifying(true);
      const adminRoleDoc = doc(firestore, 'roles_admin', user.uid);
      try {
        const adminDocSnapshot = await getDoc(adminRoleDoc);
        if (adminDocSnapshot.exists()) {
          setIsAuthorized(true);
        } else {
          // If user exists but is not an admin, sign them out and redirect.
          await auth.signOut();
          router.push('/admin/login?error=You are not authorized to access this panel.');
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        // On error, assume not authorized, sign out and redirect.
        await auth.signOut();
        router.push('/admin/login?error=An error occurred while verifying your permissions.');
      } finally {
        setIsVerifying(false);
      }
    };

    checkAdminStatus();

  }, [user, isUserLoading, firestore, auth, router]);

  // While loading auth state or verifying admin role, show a full-screen loader.
  if (isUserLoading || isVerifying || !isAuthorized) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Logo />
                <p className="text-muted-foreground">Verifying access...</p>
                <div className="w-full max-w-xs">
                    <Skeleton className="h-40 w-full" />
                </div>
            </div>
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
