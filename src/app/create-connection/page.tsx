
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRightLeft, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  connectionName: z.string().min(3, { message: "Connection name must be at least 3 characters." }),
  direction: z.enum(["give", "receive"], {
    required_error: "You need to select a connection direction.",
  }),
  method: z.enum(["sftp", "ftp", "smtp"], {
    required_error: "You need to select a method.",
  }),
  methodology: z.enum(["push", "pull"], {
    required_error: "You need to select a methodology.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateConnectionPage() {
    const { toast } = useToast();
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            connectionName: "",
        },
    });

    function onSubmit(data: FormData) {
        console.log(data);
        toast({
            title: "Connection Created",
            description: `Connection "${data.connectionName}" has been successfully created.`,
        });
        form.reset();
    }

    return (
        <AppLayout>
            <PageHeader 
                title="Create Connection"
                description="Set up a new data connection to give data to or receive data from Impact."
                icon={ArrowRightLeft}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <Card className="shadow-lg">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <CardHeader>
                                    <CardTitle>Connection Details</CardTitle>
                                    <CardDescription>Fill in the details for your new connection.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="connectionName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Connection Name*</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., My Weekly Report Feed" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="direction"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Direction</FormLabel>
                                                <FormDescription>
                                                    Select the direction of the data that this connection should support
                                                </FormDescription>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="give" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Give data to Impact</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="receive" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Receive data from Impact</FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="method"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Method</FormLabel>
                                                <FormDescription>
                                                    Choose what method you want to use to receive Reports data from Impact
                                                </FormDescription>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex items-center space-x-4"
                                                    >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="sftp" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">SFTP</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="ftp" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">FTP</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="smtp" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">SMTP (Email)</FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={form.control}
                                        name="methodology"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Methodology</FormLabel>
                                                <FormDescription>
                                                    Should Impact push your data to a third party server or will you be pulling data from Impact?
                                                </FormDescription>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="push" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Push to a third party server</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="pull" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Pull from Impact</FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="bg-primary hover:bg-primary/90">Create Connection</Button>
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                </div>
                <div className="md:col-span-1">
                     <Card className="shadow-lg">
                        <CardHeader>
                        <CardTitle className="flex items-center">
                            <HelpCircle className="mr-2 h-5 w-5 text-primary"/>
                            Need Help?
                        </CardTitle>
                        </CardHeader>
                        <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="what-is-connection">
                            <AccordionTrigger>What is a Connection?</AccordionTrigger>
                            <AccordionContent className="space-y-2 text-sm leading-relaxed">
                                <p>A connection is a configured data pipeline that allows you to either send your data to the Impact platform or receive data (like reports) from it. This automates data exchange between your systems and Impact.</p>
                            </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="sftp-vs-ftp">
                            <AccordionTrigger>SFTP vs. FTP vs. SMTP</AccordionTrigger>
                            <AccordionContent className="space-y-2 text-sm leading-relaxed">
                                <p><span className="font-semibold">SFTP (Secure File Transfer Protocol)</span> is the recommended method as it encrypts both the authentication information and the data files being transferred, providing a high level of security.</p>
                                <p><span className="font-semibold">FTP (File Transfer Protocol)</span> is a standard protocol for transferring files but does not provide encryption. Use this only if your endpoint does not support SFTP.</p>
                                <p><span className="font-semibold">SMTP (Email)</span> allows you to send or receive data files as email attachments. This is useful for simple, notification-based integrations.</p>
                            </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="push-vs-pull">
                            <AccordionTrigger>Push vs. Pull Methodology</AccordionTrigger>
                            <AccordionContent className="space-y-2 text-sm leading-relaxed">
                                <p><span className="font-semibold">Push to third party:</span> Impact will actively send (push) the data to a server that you specify. You will need to provide credentials and an endpoint for Impact to connect to.</p>
                                <p><span className="font-semibold">Pull from Impact:</span> You will be responsible for fetching (pulling) the data from an endpoint provided by Impact. Impact will make the data available, and your system will need to connect to retrieve it.</p>
                            </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </AppLayout>
    );
}
