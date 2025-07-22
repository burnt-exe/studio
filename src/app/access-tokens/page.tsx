
"use client";
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { KeyRound, Trash2, PlusCircle, HelpCircle } from '@/components/common/icons';
import { useToast } from '@/hooks/use-toast';

interface AccessToken {
  id: string;
  name: string;
  token: string;
  createdAt: string; 
}

const formSchema = z.object({
  name: z.string().min(3, { message: "Token name must be at least 3 characters." }),
  token: z.string().min(10, { message: "Token value must be at least 10 characters." }),
});

type FormData = z.infer<typeof formSchema>;

const LOCAL_STORAGE_KEY = 'impactExplorer_accessTokens';

export default function AccessTokensPage() {
  const [tokens, setTokens] = useState<AccessToken[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", token: "" },
  });

  useEffect(() => {
    setIsMounted(true);
    const storedTokens = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTokens) {
      setTokens(JSON.parse(storedTokens));
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tokens));
    }
  }, [tokens, isMounted]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const newToken: AccessToken = { 
      id: uuidv4(), 
      ...data, 
      createdAt: new Date().toISOString() 
    };
    setTokens(prev => [newToken, ...prev]);
    toast({ title: "Token Added", description: `Token "${data.name}" has been successfully added.` });
    form.reset();
  };

  const deleteToken = (id: string) => {
    setTokens(prev => prev.filter(token => token.id !== id));
    toast({ title: "Token Deleted", description: "The selected token has been deleted." });
  };

  const maskToken = (token: string) => {
    if (token.length <= 8) return '********';
    return `${token.substring(0, 4)}...${token.substring(token.length - 4)}`;
  };
  
  const copyToken = (tokenValue: string, tokenName: string) => {
    navigator.clipboard.writeText(tokenValue)
      .then(() => toast({ title: "Token Copied!", description: `Token "${tokenName}" copied to clipboard.` }))
      .catch(() => toast({ variant: "destructive", title: "Failed to copy", description: "Could not copy token to clipboard." }));
  };


  if (!isMounted) {
    return (
      <AppLayout>
        <PageHeader title="Access Token Management" icon={KeyRound} />
        <div className="flex items-center justify-center h-64">
          <KeyRound className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader 
        title="Access Token Management" 
        description="Securely store and manage your API access tokens for use within this application. All tokens are stored securely in your browser's local storage and are never sent to any server."
        icon={KeyRound}
      />

      <Card className="shadow-lg mb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="flex items-center"><PlusCircle className="mr-2 h-5 w-5 text-primary"/>Add New Token</CardTitle>
              <CardDescription>Enter a name and the value for your new access token.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token Name</FormLabel>
                    <FormControl><Input placeholder="e.g., My Production API Key" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token Value</FormLabel>
                    <FormControl><Input type="password" placeholder="Enter your secret token value" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="bg-primary hover:bg-primary/90">Add Token</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Stored Tokens</CardTitle>
          <CardDescription>
            {tokens.length > 0 ? "Manage your saved access tokens below." : "No tokens stored yet. Use the form above to add one. Below are some examples."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tokens.length > 0 ? (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Token (Masked)</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens.map(token => (
                  <TableRow key={token.id}>
                    <TableCell className="font-medium">{token.name}</TableCell>
                    <TableCell className="font-mono">{maskToken(token.token)}</TableCell>
                    <TableCell>{new Date(token.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="outline" size="sm" onClick={() => copyToken(token.token, token.name)}>Copy</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-1 md:mr-2" />Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the token "{token.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteToken(token.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg opacity-60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Token (Masked)</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="pointer-events-none">
                    <TableCell className="font-medium text-muted-foreground italic">e.g., GitHub PAT</TableCell>
                    <TableCell className="font-mono text-muted-foreground italic">ghp_...xxxx</TableCell>
                    <TableCell className="text-muted-foreground italic">YYYY-MM-DD</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" disabled>Copy</Button>
                      <Button variant="destructive" size="sm" disabled><Trash2 className="h-4 w-4" /> Delete</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow className="pointer-events-none">
                    <TableCell className="font-medium text-muted-foreground italic">e.g., Google Cloud API Key</TableCell>
                    <TableCell className="font-mono text-muted-foreground italic">AIzaS...xxxx</TableCell>
                    <TableCell className="text-muted-foreground italic">YYYY-MM-DD</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" disabled>Copy</Button>
                      <Button variant="destructive" size="sm" disabled><Trash2 className="h-4 w-4" /> Delete</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow className="pointer-events-none">
                    <TableCell className="font-medium text-muted-foreground italic">e.g., Firebase Deploy Token</TableCell>
                    <TableCell className="font-mono text-muted-foreground italic">1//...xxxx</TableCell>
                    <TableCell className="text-muted-foreground italic">YYYY-MM-DD</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" disabled>Copy</Button>
                      <Button variant="destructive" size="sm" disabled><Trash2 className="h-4 w-4" /> Delete</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
         {tokens.length > 0 && (
          <CardFooter>
            <p className="text-xs text-muted-foreground">Tokens are stored in your browser's local storage and are not sent to any server.</p>
          </CardFooter>
        )}
      </Card>
      
      <Card className="shadow-lg mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="mr-2 h-5 w-5 text-primary"/>
            Guidance & Examples
          </CardTitle>
          <CardDescription>
            Learn more about access tokens and how to use them effectively.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what-are-tokens">
              <AccordionTrigger>What are Access Tokens?</AccordionTrigger>
              <AccordionContent className="space-y-2 text-sm leading-relaxed">
                <p>Access tokens are credentials used to authenticate with an API. They are like a key that grants this application permission to access your data on another service without you having to share your password.</p>
                <p>You can use this page to store tokens for APIs you want to test using the <Link href="/" className="text-primary underline hover:text-primary/80">API Endpoint Index</Link>.</p>
                <p className="font-semibold text-destructive/90">Important: Treat your access tokens like passwords. Do not share them publicly.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="example-github">
              <AccordionTrigger>Example: GitHub Personal Access Token (PAT)</AccordionTrigger>
              <AccordionContent className="space-y-2 text-sm leading-relaxed">
                <p>You can generate a PAT to use with the GitHub API.</p>
                <ol className="list-decimal list-inside space-y-1 pl-2">
                  <li>Go to your <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">GitHub token settings</a>.</li>
                  <li>Click "Generate new token" (select classic or fine-grained).</li>
                  <li>Give your token a descriptive name and select the necessary scopes (e.g., `repo`, `user`).</li>
                  <li>Click "Generate token" and copy the token value.</li>
                  <li>Come back here, give it a name like "My GitHub Token", and paste the value.</li>
                </ol>
                <p className="font-mono bg-muted p-2 rounded-md text-xs mt-2">A classic GitHub token often looks like: `ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890`</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="example-generic">
              <AccordionTrigger>Example: Generic Bearer Token</AccordionTrigger>
              <AccordionContent className="space-y-2 text-sm leading-relaxed">
                <p>Many APIs use a "Bearer Token" for authentication. This is usually provided in the API documentation or your account settings on the service's website.</p>
                <p>When you get your token, you can add it here. Later, when making an API call, you would typically include it in the `Authorization` header like this:</p>
                <pre className="bg-muted p-3 rounded-md text-xs mt-2 font-code overflow-x-auto">
                  <code>
{`fetch('https://api.example.com/data', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_VALUE_HERE'
  }
});`}
                  </code>
                </pre>
                <p>Our code snippet generator will handle this for you by using placeholders for tokens.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

    </AppLayout>
  );
}
