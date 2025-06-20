
"use client";
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/common/page-header";
import { ResultDisplay } from "@/components/common/result-display";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { analyzeMarketingCampaign, AnalyzeMarketingCampaignInput, AnalyzeMarketingCampaignOutput } from '@/ai/flows/marketing-campaign-analyzer';
import { Megaphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  campaignData: z.string().min(50, { message: "Campaign data must be at least 50 characters." })
    .max(5000, { message: "Campaign data must not exceed 5000 characters." }),
});

type FormData = z.infer<typeof formSchema>;

export default function MarketingManagementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeMarketingCampaignOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campaignData: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await analyzeMarketingCampaign(data);
      setResult(response);
      toast({ title: "Campaign Analyzed", description: "The marketing campaign data has been successfully analyzed." });
    } catch (e: any) {
      setError(e.message || "Failed to analyze marketing campaign.");
      toast({ variant: "destructive", title: "Error", description: e.message || "Failed to analyze marketing campaign." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader 
        title="AI Marketing Management" 
        description="Input your marketing campaign data (e.g., media performance, post engagement, ad spend) to get AI-driven analysis, insights, and recommendations."
        icon={Megaphone}
      />

      <Card className="shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Analyze Marketing Campaign</CardTitle>
              <CardDescription>Provide data related to your marketing campaign for AI analysis.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="campaignData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Data</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your campaign data here (e.g., KPIs, ad copy, target audience, results, spend, etc.)..."
                        className="min-h-[250px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                {isLoading ? 'Analyzing...' : 'Analyze Campaign'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <ResultDisplay
        isLoading={isLoading}
        error={error}
        data={result ? (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Summary:</h3>
              <p className="p-4 bg-muted rounded-md text-sm leading-relaxed">{result.summary}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Key Insights:</h3>
              <ul className="list-disc list-inside space-y-1 p-4 bg-muted rounded-md text-sm">
                {result.insights.map((insight, index) => <li key={index}>{insight}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Recommendations:</h3>
              <ul className="list-disc list-inside space-y-1 p-4 bg-muted rounded-md text-sm">
                {result.recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
              </ul>
            </div>
          </div>
        ) : null}
        title="AI Marketing Analysis"
        loadingText="AI is analyzing your campaign data..."
      />
    </AppLayout>
  );
}
