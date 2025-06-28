"use client";
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/common/page-header";
import { ResultDisplay } from "@/components/common/result-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateBrandedContent, GenerateBrandedContentInput, GenerateBrandedContentOutput } from '@/ai/flows/content-generation';
import { PenSquare, Rss, ThumbsUp, Mail, Linkedin, Reddit } from 'lucide-react';
import { X as XIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WhatsAppIcon } from '@/components/common/whatsapp-icon';

const brandVoiceOptions = [
  "Professional & Authoritative",
  "Friendly & Approachable",
  "Witty & Humorous",
  "Luxurious & Sophisticated",
  "Bold & Edgy",
  "Minimalist & Modern",
  "Enthusiastic & Passionate",
  "Informative & Educational",
  "Nostalgic & Sentimental",
];

const topicOptions = [
  "Announce a new product launch",
  "Promote a seasonal sale",
  "Share a behind-the-scenes look",
  "Highlight a customer testimonial",
  "Post an educational 'how-to' guide",
  "Run a contest or giveaway",
  "Ask a question to engage the audience",
  "Share a company milestone or achievement",
  "Feature an employee or team member",
];

const formSchema = z.object({
  brandVoice: z.string().min(1, { message: "Please select a brand voice." }),
  topic: z.string().min(1, { message: "Please select a topic." }),
  contentType: z.enum(['Social Media Post', 'Email Newsletter', 'Blog Post'], { required_error: "You need to select a content type." }),
});

type FormData = z.infer<typeof formSchema>;

const LOCAL_STORAGE_KEY = 'impactExplorer_integrations';

export default function CreateContentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateBrandedContentOutput | null>(null);
  const [isBloggerConnected, setIsBloggerConnected] = useState(false);
  const [isMetaConnected, setIsMetaConnected] = useState(false);
  const [isLinkedInConnected, setIsLinkedInConnected] = useState(false);
  const [isXConnected, setIsXConnected] = useState(false);
  const [isRedditConnected, setIsRedditConnected] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandVoice: "",
      topic: "",
    },
  });

  useEffect(() => {
    try {
      const storedIntegrations = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedIntegrations) {
        const parsed = JSON.parse(storedIntegrations);
        const blogger = parsed.find((i: any) => i.name === 'Blogger');
        const meta = parsed.find((i: any) => i.name === 'Meta');
        const linkedin = parsed.find((i: any) => i.name === 'LinkedIn');
        const x = parsed.find((i: any) => i.name === 'X');
        const reddit = parsed.find((i: any) => i.name === 'Reddit');

        if (blogger?.connected) setIsBloggerConnected(true);
        if (meta?.connected) setIsMetaConnected(true);
        if (linkedin?.connected) setIsLinkedInConnected(true);
        if (x?.connected) setIsXConnected(true);
        if (reddit?.connected) setIsRedditConnected(true);
      }
    } catch (e) {
      console.error("Failed to parse integrations from localStorage", e);
    }
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await generateBrandedContent(data);
      setResult(response);
      toast({ title: "Content Generated!", description: `Your ${data.contentType} has been successfully generated.` });
    } catch (e: any) {
      setError(e.message || "Failed to generate content.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = (platform: string) => {
    if (!result) return;
    toast({
      title: `Shared to ${platform}!`,
      description: `Your content "${result.title}" has been posted.`,
    });
  };

  const handleShareByEmail = () => {
    if (!result) return;
    const subject = result.title;
    const body = result.body;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  
  const handleShareByWhatsApp = () => {
    if (!result) return;
    const text = `${result.title}\n\n${result.body}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <AppLayout>
      <PageHeader 
        title="AI Content Creator" 
        description="Generate weeks of content in a brand's unique voice – from social posts to emails to blogs."
        icon={PenSquare}
      />

      <Card className="shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Create New Content</CardTitle>
              <CardDescription>Define your brand, topic, and content type, and let AI do the writing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="brandVoice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Voice & Style</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a brand voice..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {brandVoiceOptions.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    <FormDescription>
                      Choose the tone, voice, and personality for your brand.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Topic or Idea</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a topic..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {topicOptions.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        What should the content be about?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type of content..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Social Media Post">Social Media Post</SelectItem>
                          <SelectItem value="Email Newsletter">Email Newsletter</SelectItem>
                          <SelectItem value="Blog Post">Blog Post</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        What format should the content be in?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                {isLoading ? 'Generating...' : 'Create Content with AI'}
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
              <h3 className="font-semibold text-lg mb-2">{result.title}</h3>
              <div className="p-4 bg-muted rounded-md text-sm leading-relaxed whitespace-pre-wrap">{result.body}</div>
            </div>
            <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Share Content</CardTitle>
                  <CardDescription>Publish this content to your connected platforms.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <Button onClick={handleShareByEmail} variant="outline" className="w-full justify-start"><Mail className="mr-2 h-4 w-4"/> Email</Button>
                    <Button onClick={handleShareByWhatsApp} variant="outline" className="w-full justify-start"><WhatsAppIcon /> WhatsApp</Button>
                    {isMetaConnected ? (
                          <Button onClick={() => handleShare('Meta')} variant="outline" className="w-full justify-start"><ThumbsUp className="mr-2 h-4 w-4"/> Post to Meta</Button>
                    ) : (
                        <Button variant="outline" className="w-full justify-start" disabled><ThumbsUp className="mr-2 h-4 w-4"/> Post to Meta</Button>
                    )}
                    {isBloggerConnected ? (
                          <Button onClick={() => handleShare('Blogger')} variant="outline" className="w-full justify-start"><Rss className="mr-2 h-4 w-4"/> Post to Blogger</Button>
                    ) : (
                        <Button variant="outline" className="w-full justify-start" disabled><Rss className="mr-2 h-4 w-4"/> Post to Blogger</Button>
                    )}
                    {isLinkedInConnected ? (
                        <Button onClick={() => handleShare('LinkedIn')} variant="outline" className="w-full justify-start"><Linkedin className="mr-2 h-4 w-4"/> Post to LinkedIn</Button>
                    ) : (
                        <Button variant="outline" className="w-full justify-start" disabled><Linkedin className="mr-2 h-4 w-4"/> Post to LinkedIn</Button>
                    )}
                    {isXConnected ? (
                        <Button onClick={() => handleShare('X')} variant="outline" className="w-full justify-start"><XIcon className="mr-2 h-4 w-4"/> Post to X</Button>
                    ) : (
                        <Button variant="outline" className="w-full justify-start" disabled><XIcon className="mr-2 h-4 w-4"/> Post to X</Button>
                    )}
                    {isRedditConnected ? (
                        <Button onClick={() => handleShare('Reddit')} variant="outline" className="w-full justify-start"><Reddit className="mr-2 h-4 w-4"/> Post to Reddit</Button>
                    ) : (
                        <Button variant="outline" className="w-full justify-start" disabled><Reddit className="mr-2 h-4 w-4"/> Post to Reddit</Button>
                    )}
                </CardContent>
                <CardFooter>
                      <p className="text-xs text-muted-foreground">
                        Enable more platforms in the <Link href="/integrations/platform" className="text-primary underline">Platform Integrations</Link> page.
                      </p>
                </CardFooter>
            </Card>
          </div>
        ) : null}
        title="AI Generated Content"
        loadingText="Generating content..."
        noResultsText="Fill out the form above to generate branded content with AI."
      />
    </AppLayout>
  );
}
