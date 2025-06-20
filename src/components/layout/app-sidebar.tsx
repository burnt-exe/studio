
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
  Code2, 
  Bot, 
  KeyRound, 
  FileText, 
  Megaphone, 
  DollarSign, 
  FilePieChart, 
  Share2, 
  Store,
  LayoutDashboard,
  Settings
} from 'lucide-react';

const navItems = [
  { href: "/", label: "API Endpoints", icon: List },
  { href: "/api-assistant", label: "API Assistant", icon: Bot },
  { href: "/access-tokens", label: "Access Tokens", icon: KeyRound },
  { type: "separator" as const },
  { href: "/contract-management", label: "Contract Management", icon: FileText },
  { href: "/marketing-management", label: "Marketing Management", icon: Megaphone },
  { href: "/report-management", label: "Report Management", icon: FilePieChart },
  { href: "/payout-automation", label: "Payout Automation", icon: DollarSign },
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
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href || (item.href === "/" && pathname.startsWith("/api-endpoints"))} // Adjust if /api-endpoints is the actual root
                      tooltip={{ children: item.label, className: "font-body" }}
                      className="font-body"
                    >
                      <a>
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              )
            )
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        {!isLoading && (
           <SidebarMenuItem>
              <Link href="/settings" passHref legacyBehavior>
                <SidebarMenuButton 
                  asChild
                  isActive={pathname === '/settings'}
                  tooltip={{ children: "Settings", className: "font-body" }}
                  className="font-body"
                >
                  <a>
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
