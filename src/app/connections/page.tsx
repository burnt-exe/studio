
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';

export default function ConnectionsPage() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center text-center" style={{minHeight: 'calc(100vh - 15rem)'}}>
        <div className="max-w-xl">
            <h1 className="text-2xl font-bold text-foreground mb-4">Connections</h1>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                The Connections screen is used to connect to other platforms for submitting or retrieving batch jobs (e.g., conversion data, action modifications/reversals, etc.) to impact.com for batch processing. The tool currently supports FTP, SFTP, and SMTP (Email) connection methods.
            </p>
            <Link href="/create-connection" passHref>
                <Button size="lg">
                    Create Connection
                </Button>
            </Link>
        </div>
      </div>
    </AppLayout>
  );
}
