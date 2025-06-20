
"use client";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Construction } from 'lucide-react';

export default function MarketplaceIntegrationsPage() {
  return (
    <AppLayout>
      <PageHeader 
        title="Marketplace Integrations" 
        description="Integrate with popular marketplaces like Google Marketing Platform, Microsoft Marketplace, and Bing."
        icon={Store}
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
            Connect Impact Explorer with Google Marketing Platform, Microsoft Marketplace, Bing, and other marketplaces in an upcoming release.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
