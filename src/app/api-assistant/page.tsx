
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { askApiDocumentation, AskApiDocumentationInput, AskApiDocumentationOutput } from '@/ai/flows/api-documentation-qa';
import { Bot } from 'lucide-react';

const formSchema = z.object({
  apiDocumentation: z.string().min(50, { message: "API documentation must be at least 50 characters." }),
  question: z.string().min(5, { message: "Question must be at least 5 characters." }),
});

type FormData = z.infer<typeof formSchema>;

export default function ApiAssistantPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AskApiDocumentationOutput | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiDocumentation: "",
      question: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await askApiDocumentation(data);
      setResult(response);
    } catch (e: any) {
      setError(e.message || "Failed to get answer from AI assistant.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader 
        title="AI-Powered API Assistant" 
        description="Ask questions about API usage, endpoints, and parameters. Provide the API documentation text below."
        icon={Bot}
      />

      <Card className="shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
              <CardDescription>Paste your API documentation and ask a specific question about it.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="apiDocumentation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Documentation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the relevant API documentation here..."
                        className="min-h-[200px] resize-y font-code"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide the text of the API documentation you want to ask about.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Question</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., How do I authenticate requests for the /users endpoint?" {...field} />
                    </FormControl>
                    <FormDescription>
                      Ask a clear and specific question.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                {isLoading ? 'Asking AI...' : 'Ask AI Assistant'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <ResultDisplay
        isLoading={isLoading}
        error={error}
        data={result ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Answer:</h3>
            <p className="text-foreground whitespace-pre-wrap">{result.answer}</p>
          </div>
        ) : null}
        title="AI Assistant's Response"
        loadingText="Fetching answer from AI..."
      />
    </AppLayout>
  );
}
