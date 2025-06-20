
"use client";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Construction } from 'lucide-react';

export default function SettingsPage() {
  return (
    <AppLayout>
      <PageHeader 
        title="Settings" 
        description="Manage your application preferences and account settings."
        icon={SettingsIcon}
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Construction className="mr-2 h-6 w-6 text-accent" />
            Settings Page Under Development
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground text-center py-10">
            This section will allow you to configure application settings, manage your profile, and set preferences. Stay tuned for updates!
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
