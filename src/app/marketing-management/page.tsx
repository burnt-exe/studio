
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Rss, ThumbsUp, Mail, Link as LinkIcon, Copy, Loader2, Linkedin, X as XIcon, Reddit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { WhatsAppIcon } from '@/components/common/whatsapp-icon';


const LOCAL_STORAGE_KEY = 'impactExplorer_integrations';

interface Contract {
  id: string;
  name: string;
}

interface ContractContent {
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  affiliateLink: string;
}

const contracts: Contract[] = [
  { id: 'sage', name: 'Sage' },
  { id: 'nike', name: 'Nike' },
  { id: 'adobe', name: 'Adobe Creative Cloud' },
  { id: 'content-spark', name: 'Content Spark AI' },
];

const contentData: Record<string, ContractContent> = {
  sage: {
    title: "Streamline Your Business with Sage Accounting",
    description: "Get 50% off your first 6 months of Sage Accounting. Effortlessly manage invoices, track expenses, and handle taxes with the #1 cloud accounting software for small businesses.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "office accounting",
    affiliateLink: "https://impact.com/promo/sage-q3-2024",
  },
  nike: {
    title: "Nike Air Max Dn: The Next Generation of Air",
    description: "Feel the unreal. The new Nike Air Max Dn features our Dynamic Air unit system, bringing you a revolutionary feel with every step. Shop the latest collection now.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "running shoes",
    affiliateLink: "https://impact.com/promo/nike-airmax-dn",
  },
  adobe: {
    title: "Unleash Your Creativity with Adobe Creative Cloud",
    description: "Get access to Photoshop, Illustrator, Premiere Pro, and more with the Adobe Creative Cloud All Apps plan. Start creating today with a 7-day free trial.",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "digital art",
    affiliateLink: "https://impact.com/promo/adobe-cc-all-apps",
  },
  'content-spark': {
    title: "Generate Weeks of Content with AI",
    description: "Creates weeks of content in a brand's unique voice – from social posts to emails to blogs – without hiring expensive agencies. When you share a tool that helps businesses grow, you earn meaningful commissions.\n\nOur affiliate program at a glance:\n\n- Initial reward\n- Recurring income\n- Growth potential\n- Sustainability: Average customer stays 12+ months",
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "ai writing",
    affiliateLink: "https://impact.com/promo/content-spark-ai",
  },
};

export default function ContentSyndicationPage() {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [content, setContent] = useState<ContractContent | null>(null);
  const [isBloggerConnected, setIsBloggerConnected] = useState(false);
  const [isMetaConnected, setIsMetaConnected] = useState(false);
  const [isLinkedInConnected, setIsLinkedInConnected] = useState(false);
  const [isXConnected, setIsXConnected] = useState(false);
  const [isRedditConnected, setIsRedditConnected] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
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

  const handleContractChange = (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId) || null;
    setSelectedContract(contract);
    setContent(contentData[contractId] || null);
  };

  const handleShare = (platform: string) => {
    if (!content) return;
    toast({
      title: `Shared to ${platform}!`,
      description: `Your content "${content.title}" has been posted.`,
    });
  };

  const handleShareByEmail = () => {
    if (!content) return;
    const subject = `Check this out: ${content.title}`;
    const body = `${content.description}\n\nFind out more here: ${content.affiliateLink}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  
  const handleShareByWhatsApp = () => {
    if (!content) return;
    const text = `${content.title}\n\n${content.description}\n\n${content.affiliateLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast({ title: "Link Copied!", description: "Affiliate link copied to clipboard." }))
      .catch(() => toast({ variant: "destructive", title: "Failed to copy", description: "Could not copy link." }));
  };

  if (!isMounted) {
    return (
      <AppLayout>
        <PageHeader 
          title="Content Syndication" 
          description="Select a contract to access its promotional content and share it across your platforms."
          icon={Send}
        />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Select a Contract</CardTitle>
                <CardDescription>Choose a media partner contract to view available content.</CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="shadow-lg h-full flex items-center justify-center">
              <CardContent className="text-center text-muted-foreground p-6">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader 
        title="Content Syndication" 
        description="Select a contract to access its promotional content and share it across your platforms."
        icon={Send}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                <CardTitle>Select a Contract</CardTitle>
                <CardDescription>Choose a media partner contract to view available content.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Select onValueChange={handleContractChange}>
                        <SelectTrigger>
                        <SelectValue placeholder="Choose a contract..." />
                        </SelectTrigger>
                        <SelectContent>
                        {contracts.map(contract => (
                            <SelectItem key={contract.id} value={contract.id}>{contract.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {content && (
                <Card className="shadow-lg">
                    <CardHeader>
                    <CardTitle>Share Content</CardTitle>
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
            )}
        </div>
        
        <div className="space-y-6">
            {content ? (
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>{content.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="overflow-hidden rounded-lg border">
                            <Image
                                src={content.imageUrl}
                                alt={content.title}
                                width={600}
                                height={400}
                                data-ai-hint={content.imageHint}
                                className="object-cover w-full"
                            />
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{content.description}</p>
                        
                        <div className="space-y-2">
                           <label className="text-sm font-medium">Affiliate Link</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={content.affiliateLink}
                                    className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <Button variant="outline" size="icon" onClick={() => copyToClipboard(content.affiliateLink)}><Copy className="h-4 w-4" /></Button>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            ) : (
                <Card className="shadow-lg h-full flex items-center justify-center">
                    <CardContent className="text-center text-muted-foreground p-6">
                        <p>Select a contract to see its content here.</p>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </AppLayout>
  );
}
