'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const avatar = placeholderImagesData.placeholderImages.find(p => p.id === 'admin-avatar');

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
               {avatar && <AvatarImage src={avatar.imageUrl} data-ai-hint={avatar.imageHint} />}
               <AvatarFallback>AD</AvatarFallback>
             </Avatar>
             <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold truncate">Admin User</span>
                <span className="text-xs text-muted-foreground truncate">admin@muscleup.com</span>
             </div>
          </div>
          <SidebarMenuButton asChild variant="ghost">
            <Link href="/">
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
