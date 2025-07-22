
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
import { Bot, Copy } from '@/components/common/icons';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  apiDocumentation: z.string().min(50, { message: "API documentation must be at least 50 characters." }),
  question: z.string().min(5, { message: "Question must be at least 5 characters." }),
});

type FormData = z.infer<typeof formSchema>;

export default function ApiAssistantPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AskApiDocumentationOutput | null>(null);
  const { toast } = useToast();

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

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text)
      .then(() => toast({ title: "Copied!", description: "Code snippet copied to clipboard." }))
      .catch(() => toast({ variant: "destructive", title: "Failed to copy", description: "Could not copy to clipboard." }));
  };

  return (
    <AppLayout>
      <PageHeader 
        title="AI-Powered API Assistant" 
        description="Get help with APIs. Ask questions or describe what you want to do, and the AI will provide an explanation and a code snippet."
        icon={Bot}
      />

      <Card className="shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Ask for Help</CardTitle>
              <CardDescription>Paste your API documentation and ask a question or describe a task.</CardDescription>
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
                      Provide the text of the API documentation you need help with.
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
                    <FormLabel>Your Question or Task</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., How do I fetch a list of users?" {...field} />
                    </FormControl>
                    <FormDescription>
                      Ask a question or describe what you want to accomplish.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                {isLoading ? 'Thinking...' : 'Ask AI Assistant'}
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
              <h3 className="font-semibold text-lg mb-2">Explanation:</h3>
              <div className="p-4 bg-muted rounded-md text-sm leading-relaxed whitespace-pre-wrap">{result.explanation}</div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Generated Code Snippet:</h3>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto font-code text-sm border">
                  <code>{result.codeSnippet}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => copyToClipboard(result.codeSnippet)}
                  aria-label="Copy code snippet"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">The AI generates code based on the documentation provided. Always review it before use.</p>
            </div>
          </div>
        ) : null}
        title="AI Assistant's Response"
        loadingText="Generating explanation and code..."
        noResultsText="Ask a question about your API documentation to get an explanation and a code snippet."
      />
    </AppLayout>
  );
}
