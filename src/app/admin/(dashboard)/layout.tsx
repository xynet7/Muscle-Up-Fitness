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
    if (isUserLoading || !firestore || !auth) {
      return;
    }

    if (!user) {
      router.push('/admin/login?error=You must be logged in to view this page.');
      return;
    }

    const checkAdminStatus = async () => {
      try {
        const adminRoleDocRef = doc(firestore, 'roles_admin', user.uid);
        const adminDocSnapshot = await getDoc(adminRoleDocRef);

        if (adminDocSnapshot.exists()) {
          setIsAuthorized(true);
        } else {
          await auth.signOut();
          router.push('/admin/login?error=You are not authorized to access this panel.');
        }
      } catch (error) {
        // A catch block here is important. If getDoc fails due to security rules,
        // it means the user isn't allowed to even check, which implies they are not an admin.
        console.error("Authorization check failed:", error);
        await auth.signOut();
        router.push('/admin/login?error=You do not have permission to access this panel.');
      } finally {
        setIsVerifying(false);
      }
    };

    checkAdminStatus();

  }, [user, isUserLoading, firestore, auth, router]);

  const handleLogout = async () => {
    if (!auth) return;
    await auth.signOut();
    router.push('/admin/login');
  };

  if (isVerifying) {
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

  if (!isAuthorized) {
      // This state is hit if verification is done, but the user was found to be unauthorized.
      // We can show a brief message before the redirect effect in useEffect kicks in.
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4 text-center">
                <Logo />
                <h1 className="text-xl font-semibold">Access Denied</h1>
                <p className="text-muted-foreground">You are not authorized. Redirecting to login...</p>
            </div>
        </div>
      );
  }


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
          {user && (
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
