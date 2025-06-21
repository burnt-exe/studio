"use client";
import React, { useState, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Share2, Rss, ThumbsUp, CalendarDays, MessageSquare, MessageCircle, Link as LinkIcon, Unlink } from 'lucide-react';

interface Integration {
  name: string;
  description: string;
  icon: LucideIcon;
  connected: boolean;
  comingSoon: boolean;
}

const initialIntegrations: Integration[] = [
  {
    name: 'Blogger',
    description: 'Automatically publish campaign summaries and performance reports to your Blogger blog.',
    icon: Rss,
    connected: false,
    comingSoon: false,
  },
  {
    name: 'Meta',
    description: 'Sync audiences and post campaign updates to Facebook Pages or Instagram accounts.',
    icon: ThumbsUp,
    connected: false,
    comingSoon: false,
  },
  {
    name: 'Google Calendar',
    description: 'Schedule marketing campaigns and payout dates directly in your Google Calendar.',
    icon: CalendarDays,
    connected: false,
    comingSoon: true,
  },
  {
    name: 'Slack',
    description: 'Receive real-time notifications for new conversions, payouts, and partner sign-ups.',
    icon: MessageSquare,
    connected: false,
    comingSoon: false,
  },
  {
    name: 'Reddit',
    description: 'Monitor subreddits for brand mentions and post to relevant communities.',
    icon: MessageCircle,
    connected: false,
    comingSoon: true,
  },
   {
    name: 'Community Forums',
    description: 'Engage with users and post updates on Discourse or other community platforms.',
    icon: Share2,
    connected: false,
    comingSoon: true,
  }
];

const LOCAL_STORAGE_KEY = 'impactExplorer_integrations';

export default function PlatformIntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedIntegrations = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedIntegrations) {
        const parsed = JSON.parse(storedIntegrations);
        if (Array.isArray(parsed) && parsed.every(p => 'name' in p && 'connected' in p)) {
            const mergedIntegrations = initialIntegrations.map(initial => {
                const stored = parsed.find(s => s.name === initial.name);
                return stored ? { ...initial, connected: stored.connected } : initial;
            });
            setIntegrations(mergedIntegrations);
        }
      }
    } catch (error) {
      console.error("Failed to parse integrations from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(integrations.map(i => ({name: i.name, connected: i.connected}))));
    }
  }, [integrations, isMounted]);

  const handleDisconnect = (name: string) => {
    setIntegrations(prev => 
      prev.map(int => int.name === name ? { ...int, connected: false } : int)
    );
    toast({ title: "Disconnected", description: `Successfully disconnected from ${name}.` });
  };

  return (
    <AppLayout>
      <PageHeader 
        title="Platform Integrations" 
        description="Connect Impact Explorer with various platforms to automate workflows and extend your reach."
        icon={Share2}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.name} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
              <div className="p-3 bg-muted rounded-md">
                <integration.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle>{integration.name}</CardTitle>
                <CardDescription>
                  {integration.comingSoon 
                    ? <span className="text-accent font-medium">Coming Soon</span> 
                    : integration.connected 
                    ? <span className="text-green-600 font-medium">Connected</span> 
                    : 'Available'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{integration.description}</p>
            </CardContent>
            <CardFooter>
                {integration.comingSoon ? (
                     <Button className="w-full" variant="outline" disabled>Coming Soon</Button>
                ) : integration.connected ? (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="w-full"><Unlink className="mr-2 h-4 w-4"/>Manage</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Manage {integration.name} Connection</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You are currently connected to {integration.name}. You can disconnect to stop data synchronization.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive hover:bg-destructive/90"
                                  onClick={() => handleDisconnect(integration.name)}
                                >
                                    Disconnect
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                ) : (
                    <Link href={`/auth/mock-auth?platform=${integration.name}`} passHref>
                      <Button className="w-full"><LinkIcon className="mr-2 h-4 w-4"/>Connect</Button>
                    </Link>
                )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
