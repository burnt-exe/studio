
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, KeyRound } from '@/components/common/icons';
import { useToast } from '@/hooks/use-toast';

const LOCAL_STORAGE_KEY = 'impactExplorer_integrations';

export default function MockAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [platform, setPlatform] = useState<string | null>(null);

  useEffect(() => {
    const platformName = searchParams.get('platform');
    if (platformName) {
      setPlatform(platformName);
    } else {
      // If no platform, redirect back
      router.replace('/integrations/platform');
    }
  }, [searchParams, router]);

  const handleAuthorize = () => {
    if (!platform) return;

    try {
      const storedIntegrationsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      // Ensure we start with an array
      let integrations: {name: string, connected: boolean}[] = storedIntegrationsRaw ? JSON.parse(storedIntegrationsRaw) : [];

      const integrationIndex = integrations.findIndex((i) => i.name === platform);

      if (integrationIndex > -1) {
        // Update existing integration
        integrations[integrationIndex].connected = true;
      } else {
        // Add new integration if it doesn't exist in storage
        integrations.push({ name: platform, connected: true });
      }
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(integrations));

      toast({
        title: 'Connection Successful!',
        description: `You have successfully connected to ${platform}.`,
      });
      
      router.push('/integrations/platform');

    } catch (error) {
      console.error("Failed to update localStorage", error);
      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description: 'Something went wrong during the authorization process.',
      });
      router.push('/integrations/platform');
    }
  };

  if (!platform) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
       <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-6 w-6 text-primary" />
            Authorize {platform}
          </CardTitle>
          <CardDescription>
            You are authorizing Impact Explorer to access your {platform} account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/50">
                <h4 className="font-semibold text-sm mb-2">Impact Explorer will be able to:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Read your profile information.</li>
                    <li>Post content on your behalf.</li>
                    <li>View analytics and performance data.</li>
                </ul>
            </div>
          <p className="text-xs text-muted-foreground text-center">
            This is a simulated authorization flow. In a real application, you would be redirected to the official {platform} login page.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAuthorize} className="w-full">
            Grant Access
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
