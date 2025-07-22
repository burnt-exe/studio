
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateReport, GenerateReportInput, GenerateReportOutput } from '@/ai/flows/report-generation';
import { FilePieChart, Lightbulb } from '@/components/common/icons';
import { useToast } from '@/hooks/use-toast';

const prebuiltPrompts = [
  "Weekly sales summary",
  "Monthly user engagement report",
  "Top 5 performing media partners by revenue",
  "Quarterly conversion rate analysis",
  "Campaign performance comparison for Q1 vs Q2",
];

const mockReportData = JSON.stringify(
  [
    { "date": "2023-10-01", "partnerId": "partner-123", "clicks": 1500, "conversions": 75, "revenue": 1875.00 },
    { "date": "2023-10-01", "partnerId": "partner-456", "clicks": 800, "conversions": 60, "revenue": 1200.00 },
    { "date": "2023-10-02", "partnerId": "partner-123", "clicks": 1650, "conversions": 80, "revenue": 2000.00 },
    { "date": "2023-10-02", "partnerId": "partner-789", "clicks": 2200, "conversions": 110, "revenue": 3300.00 },
    { "date": "2023-10-03", "partnerId": "partner-456", "clicks": 950, "conversions": 70, "revenue": 1400.00 }
  ],
  null,
  2
);


const formSchema = z.object({
  reportType: z.string().min(3, { message: "Please select a report type." }),
  reportData: z.string().min(1, "Please provide data for the report.").refine(
    (val) => {
      try {
        JSON.parse(val);
        return true;
      } catch (e) {
        return false;
      }
    },
    { message: "Data must be a valid JSON object." }
  ),
  parameters: z.string().optional().refine(
    (val) => {
      if (!val || val.trim() === "") return true; // Optional, so empty is fine
      try {
        JSON.parse(val);
        return true;
      } catch (e) {
        return false;
      }
    },
    { message: "Parameters must be a valid JSON object or empty." }
  ),
});

type FormData = z.infer<typeof formSchema>;

export default function ReportManagementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateReportOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportType: "",
      reportData: mockReportData,
      parameters: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const input: GenerateReportInput = {
        reportType: data.reportType,
        reportData: data.reportData,
        parameters: data.parameters ? JSON.parse(data.parameters) : undefined,
      };
      const response = await generateReport(input);
      setResult(response);
      toast({ title: "Report Generated", description: `A ${data.reportType} report has been successfully generated.` });
    } catch (e: any) {
      setError(e.message || "Failed to generate report.");
      toast({ variant: "destructive", title: "Error", description: e.message || "Failed to generate report." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader 
        title="AI Report Management" 
        description="Generate various types of reports automatically using AI. Select a report type, provide data, and get insights."
        icon={FilePieChart}
      />

      <Card className="shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Generate Report</CardTitle>
              <CardDescription>Select a report type, provide your data, and add any optional parameters.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="reportType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a pre-built report type..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {prebuiltPrompts.map(prompt => (
                          <SelectItem key={prompt} value={prompt}>{prompt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose a report from the list to get started.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="reportData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Data (JSON format)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={'Paste your organization or user data here...'}
                        className="min-h-[200px] resize-y font-code"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Provide the real-time data for the report. Mock data is pre-filled as an example.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parameters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Parameters (JSON format, optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={'e.g., { "region": "North America", "product_category": "Electronics" }'}
                        className="min-h-[100px] resize-y font-code"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Provide additional context or filters as a JSON object if needed.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                {isLoading ? 'Generating...' : 'Generate Report'}
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
              <h3 className="font-semibold text-lg mb-2">Generated Report:</h3>
              <div className="p-4 bg-muted rounded-md whitespace-pre-wrap text-sm leading-relaxed font-mono">{result.report}</div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Summary:</h3>
              <p className="p-4 bg-muted rounded-md text-sm leading-relaxed">{result.summary}</p>
            </div>
            {result.suggestedNextSteps && result.suggestedNextSteps.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-accent" />
                  Suggested Next Steps:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.suggestedNextSteps.map((step, index) => (
                    <Button key={index} variant="outline" size="sm" className="cursor-default">
                      {step}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
        title="AI-Generated Report"
        loadingText="AI is generating the report..."
      />
    </AppLayout>
  );
}
