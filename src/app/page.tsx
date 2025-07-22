
"use client";

import React, { useState } from 'react';
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/common/page-header";
import { ApiEndpointTable } from "@/components/features/api-endpoints/api-endpoint-table";
import { CodeSnippetGenerator } from "@/components/features/api-endpoints/code-snippet-generator";
import { apiEndpointsData, type ApiEndpoint } from '@/lib/api-endpoints-data';
import { List } from '@/components/common/icons';
import { Card, CardContent } from '@/components/ui/card'; // Added Card for better structure

export default function ApiEndpointsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(apiEndpointsData[0] || null);

  const handleSelectEndpoint = (endpoint: ApiEndpoint) => {
    setSelectedEndpoint(endpoint);
    // Scroll to the snippet generator smoothly
    const generatorElement = document.getElementById('snippet-generator');
    if (generatorElement) {
      generatorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AppLayout>
      <PageHeader 
        title="API Endpoint Index" 
        description="Browse and interact with available API endpoints. Select an endpoint to view details and generate code snippets."
        icon={List}
      />
      
      <Card className="shadow-lg">
        <CardContent className="p-4 md:p-6">
          <ApiEndpointTable endpoints={apiEndpointsData} onSelectEndpoint={handleSelectEndpoint} />
        </CardContent>
      </Card>

      <div id="snippet-generator" className="mt-8"> {/* Added ID for scrolling */}
        <CodeSnippetGenerator selectedEndpoint={selectedEndpoint} />
      </div>
    </AppLayout>
  );
}
