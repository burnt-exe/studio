
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from '@/lib/utils';
import { 
  List, 
  Bot, 
  KeyRound, 
  FileText, 
  Megaphone, 
  FilePieChart, 
  Share2, 
  Store,
  LayoutDashboard,
  Settings,
  ArrowRightLeft
} from 'lucide-react';

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/", label: "API Endpoints", icon: List },
  { href: "/api-assistant", label: "API Assistant", icon: Bot },
  { href: "/access-tokens", label: "Access Tokens", icon: KeyRound },
  { href: "/connections", label: "Connections", icon: ArrowRightLeft },
  { type: "separator" as const },
  { href: "/contract-management", label: "Contract Management", icon: FileText },
  { href: "/marketing-management", label: "Marketing Management", icon: Megaphone },
  { href: "/report-management", label: "Report Management", icon: FilePieChart },
  { type: "separator" as const },
  { href: "/integrations/platform", label: "Platform Integrations", icon: Share2 },
  { href: "/integrations/marketplace", label: "Marketplace Integrations", icon: Store },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4 justify-center hidden md:flex group-data-[collapsible=icon]:hidden">
         {/* Logo or App Name if needed here, otherwise AppHeader handles it */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {isLoading ? (
            <>
              {[...Array(8)].map((_, i) => <SidebarMenuSkeleton key={i} showIcon />)}
            </>
          ) : (
            navItems.map((item, index) => 
              item.type === "separator" ? (
                <SidebarSeparator key={`sep-${index}`} className="my-2" />
              ) : (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, className: "font-body" }}
                    className="font-body"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        {!isLoading && (
           <SidebarMenuItem>
              <SidebarMenuButton 
                asChild
                isActive={pathname === '/settings'}
                tooltip={{ children: "Settings", className: "font-body" }}
                className="font-body"
              >
                <Link href="/settings">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
