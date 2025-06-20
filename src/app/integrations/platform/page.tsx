
"use client";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Construction } from 'lucide-react';

export default function PlatformIntegrationsPage() {
  return (
    <AppLayout>
      <PageHeader 
        title="Platform Integrations" 
        description="Connect Impact Explorer with various platforms like Blogger, Meta, Calendars, Chatrooms, and Community posting platforms."
        icon={Share2}
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Construction className="mr-2 h-6 w-6 text-accent" />
            Feature Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground text-center py-10">
            Integration capabilities with platforms such as Blogger, Meta, Calendars, Chatrooms, and Community posting sites are planned for a future update.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
