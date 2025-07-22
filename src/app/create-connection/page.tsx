
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
import { ArrowRightLeft, HelpCircle, KeyRound, CalendarClock, Server } from '@/components/common/icons';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";


const formSchema = z.object({
  connectionName: z.string().min(3, { message: "Connection name must be at least 3 characters." }),
  direction: z.enum(["give", "receive"], { required_error: "You need to select a connection direction." }),
  method: z.enum(["sftp", "ftp", "smtp"], { required_error: "You need to select a method." }),
  methodology: z.enum(["push", "pull"], { required_error: "You need to select a methodology." }),

  // Connection Details
  host: z.string().optional(),
  port: z.coerce.number().positive().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  recipientEmail: z.string().optional(),

  // Scheduling Details
  schedule: z.enum(["none", "daily", "weekly", "monthly"]).default("none"),
  scheduleTime: z.string().optional(), // "HH:MM" format
  scheduleDayOfWeek: z.string().optional(),
  scheduleDayOfMonth: z.coerce.number().optional(),
}).superRefine((data, ctx) => {
    if (data.method === 'sftp' || data.method === 'ftp') {
        if (!data.host) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Host is required.", path: ["host"] });
        if (!data.username) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Username is required.", path: ["username"] });
    }
    if (data.method === 'smtp') {
        if (!data.host) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "SMTP Server is required.", path: ["host"] });
        if (!data.recipientEmail || !z.string().email().safeParse(data.recipientEmail).success) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "A valid recipient email is required.", path: ["recipientEmail"] });
        }
    }
    
    if (data.schedule !== 'none') {
        if (!data.scheduleTime) {
             ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Time is required for scheduling.", path: ["scheduleTime"] });
        }
    }
    if (data.schedule === 'weekly') {
        if (!data.scheduleDayOfWeek) {
             ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Day of the week is required for weekly scheduling.", path: ["scheduleDayOfWeek"] });
        }
    }
    if (data.schedule === 'monthly') {
        if (!data.scheduleDayOfMonth) {
             ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Day of the month is required for monthly scheduling.", path: ["scheduleDayOfMonth"] });
        } else if (data.scheduleDayOfMonth < 1 || data.scheduleDayOfMonth > 31) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Day must be between 1 and 31.", path: ["scheduleDayOfMonth"] });
        }
    }
});


type FormData = z.infer<typeof formSchema>;

export default function CreateConnectionPage() {
    const { toast } = useToast();
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            connectionName: "",
            schedule: "none",
        },
    });

    const method = form.watch("method");
    const schedule = form.watch("schedule");

    function onSubmit(data: FormData) {
        console.log("Form submitted:", data);
        toast({
            title: "Connection Setup Submitted",
            description: `Connection "${data.connectionName}" has been configured.`,
        });
    }

    const getHostLabel = () => {
        switch(method) {
            case 'sftp':
            case 'ftp':
                return 'Host';
            case 'smtp':
                return 'SMTP Server';
            default:
                return 'Host/Server';
        }
    }

    return (
        <AppLayout>
            <PageHeader 
                title="Create Connection"
                description="Configure a new data connection to give data to or receive data from Impact."
                icon={ArrowRightLeft}
            />

            <TooltipProvider>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <Card className="shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center"><Server className="mr-2 h-5 w-5 text-primary"/>Connection Details</CardTitle>
                                        <CardDescription>Start by defining the basic properties of your new connection.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-8">
                                        <FormField control={form.control} name="connectionName" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Connection Name</FormLabel>
                                                <FormControl><Input placeholder="e.g., My Weekly Report Feed" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <FormField control={form.control} name="direction" render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <div className="flex items-center gap-2"><FormLabel>Direction</FormLabel><Tooltip><TooltipTrigger asChild><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></TooltipTrigger><TooltipContent><p>Choose 'Give' to send data to Impact.com, or 'Receive' to get data.</p></TooltipContent></Tooltip></div>
                                                    <FormControl>
                                                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                                                            <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="give" /></FormControl><FormLabel className="font-normal">Give data to Impact</FormLabel></FormItem>
                                                            <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="receive" /></FormControl><FormLabel className="font-normal">Receive data from Impact</FormLabel></FormItem>
                                                        </RadioGroup>
                                                    </FormControl><FormMessage />
                                                </FormItem>
                                            )}/>
                                            <FormField control={form.control} name="method" render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <div className="flex items-center gap-2"><FormLabel>Method</FormLabel><Tooltip><TooltipTrigger asChild><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></TooltipTrigger><TooltipContent><p>SFTP is secure and recommended. SMTP is for email.</p></TooltipContent></Tooltip></div>
                                                    <FormControl>
                                                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                                                            <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="sftp" /></FormControl><FormLabel className="font-normal">SFTP</FormLabel></FormItem>
                                                            <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="ftp" /></FormControl><FormLabel className="font-normal">FTP</FormLabel></FormItem>
                                                            <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="smtp" /></FormControl><FormLabel className="font-normal">SMTP (Email)</FormLabel></FormItem>
                                                        </RadioGroup>
                                                    </FormControl><FormMessage />
                                                </FormItem>
                                            )}/>
                                        </div>
                                         <FormField control={form.control} name="methodology" render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <div className="flex items-center gap-2"><FormLabel>Methodology</FormLabel><Tooltip><TooltipTrigger asChild><HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" /></TooltipTrigger><TooltipContent><p>'Push': Impact sends data to your server.<br/>'Pull': You fetch data from Impact's server.</p></TooltipContent></Tooltip></div>
                                                <FormControl>
                                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                                                        <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="push" /></FormControl><FormLabel className="font-normal">Push to a third party server</FormLabel></FormItem>
                                                        <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="pull" /></FormControl><FormLabel className="font-normal">Pull from Impact</FormLabel></FormItem>
                                                    </RadioGroup>
                                                </FormControl><FormMessage />
                                            </FormItem>
                                        )}/>
                                    </CardContent>
                                </Card>

                                {method && (
                                <Card className="shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center"><KeyRound className="mr-2 h-5 w-5 text-primary"/>Authentication</CardTitle>
                                        <CardDescription>Provide the credentials for the {method.toUpperCase()} connection.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField control={form.control} name="host" render={({ field }) => (
                                                <FormItem><FormLabel>{getHostLabel()}</FormLabel><FormControl><Input placeholder={method === 'smtp' ? "smtp.example.com" : "ftp.example.com"} {...field} /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <FormField control={form.control} name="port" render={({ field }) => (
                                                <FormItem><FormLabel>Port</FormLabel><FormControl><Input type="number" placeholder={method === 'sftp' ? '22' : method === 'ftp' ? '21' : '587'} {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                        </div>
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField control={form.control} name="username" render={({ field }) => (
                                                <FormItem><FormLabel>Username</FormLabel><FormControl><Input placeholder="Your username" {...field} /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <FormField control={form.control} name="password" render={({ field }) => (
                                                <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="Your secret password" {...field} /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                        </div>
                                        {method === 'smtp' && (
                                            <FormField control={form.control} name="recipientEmail" render={({ field }) => (
                                                <FormItem><FormLabel>Recipient Email</FormLabel><FormControl><Input type="email" placeholder="recipient@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                        )}
                                    </CardContent>
                                </Card>
                                )}
                                
                                <Card className="shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center"><CalendarClock className="mr-2 h-5 w-5 text-primary"/>Scheduling</CardTitle>
                                        <CardDescription>Set a schedule to run this connection job automatically. All times are in UTC.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <FormField control={form.control} name="schedule" render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Frequency</FormLabel>
                                                <FormControl>
                                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
                                                        <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="none" /></FormControl><FormLabel className="font-normal">None (Manual)</FormLabel></FormItem>
                                                        <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="daily" /></FormControl><FormLabel className="font-normal">Daily</FormLabel></FormItem>
                                                        <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="weekly" /></FormControl><FormLabel className="font-normal">Weekly</FormLabel></FormItem>
                                                        <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="monthly" /></FormControl><FormLabel className="font-normal">Monthly</FormLabel></FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                        {schedule !== 'none' && <Separator />}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {schedule !== 'none' && (
                                                <FormField control={form.control} name="scheduleTime" render={({ field }) => (
                                                    <FormItem><FormLabel>Time (UTC)</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                                                )}/>
                                            )}
                                            {schedule === 'weekly' && (
                                                <FormField control={form.control} name="scheduleDayOfWeek" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Day of the Week</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a day" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="sunday">Sunday</SelectItem>
                                                                <SelectItem value="monday">Monday</SelectItem>
                                                                <SelectItem value="tuesday">Tuesday</SelectItem>
                                                                <SelectItem value="wednesday">Wednesday</SelectItem>
                                                                <SelectItem value="thursday">Thursday</SelectItem>
                                                                <SelectItem value="friday">Friday</SelectItem>
                                                                <SelectItem value="saturday">Saturday</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}/>
                                            )}
                                            {schedule === 'monthly' && (
                                                 <FormField control={form.control} name="scheduleDayOfMonth" render={({ field }) => (
                                                    <FormItem><FormLabel>Day of the Month</FormLabel><FormControl><Input type="number" min="1" max="31" placeholder="e.g., 15" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
                                                )}/>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90">Create and Schedule Connection</Button>
                                    </CardFooter>
                                </Card>

                            </form>
                        </Form>
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="shadow-lg sticky top-24">
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
                                <AccordionItem value="scheduling-jobs">
                                <AccordionTrigger>Scheduling Jobs</AccordionTrigger>
                                <AccordionContent className="space-y-2 text-sm leading-relaxed">
                                    <p>Automate your data transfers by setting a schedule. You can have jobs run automatically at a specific time every day, on a certain day of the week, or on a specific day of the month.</p>
                                    <p className="font-semibold">All schedule times are in Coordinated Universal Time (UTC) to ensure consistency.</p>
                                </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </TooltipProvider>
        </AppLayout>
    );
}
