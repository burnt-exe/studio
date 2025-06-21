
"use client";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Rss, ThumbsUp, CalendarDays, MessageSquare, MessageCircle } from 'lucide-react';

const integrations = [
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
    connected: true, // Example of a connected app
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


export default function PlatformIntegrationsPage() {
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
                    ? <span className="text-accent">Coming Soon</span> 
                    : integration.connected 
                    ? <span className="text-green-600">Connected</span> 
                    : 'Available'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{integration.description}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={integration.connected ? "outline" : "default"} disabled={integration.comingSoon}>
                {integration.comingSoon ? 'Coming Soon' : integration.connected ? 'Manage' : 'Connect'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
