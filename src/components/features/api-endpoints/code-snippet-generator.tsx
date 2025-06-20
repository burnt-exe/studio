
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Code2, Copy } from 'lucide-react';
import type { ApiEndpoint, ApiParameter } from '@/lib/api-endpoints-data';
import { useToast } from '@/hooks/use-toast';

interface CodeSnippetGeneratorProps {
  selectedEndpoint: ApiEndpoint | null;
}

export function CodeSnippetGenerator({ selectedEndpoint }: CodeSnippetGeneratorProps) {
  const [generatedSnippet, setGeneratedSnippet] = useState<string>('');
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyParamValues, setBodyParamValues] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (selectedEndpoint) {
      const initialParams: Record<string, string> = {};
      selectedEndpoint.parameters.forEach(p => {
        initialParams[p.name] = p.placeholder || '';
      });
      setParamValues(initialParams);

      const initialBodyParams: Record<string, string> = {};
        (selectedEndpoint.bodyParameters || []).forEach(p => {
        initialBodyParams[p.name] = p.placeholder || '';
      });
      setBodyParamValues(initialBodyParams);
      setGeneratedSnippet(''); // Clear previous snippet
    }
  }, [selectedEndpoint]);

  const handleParamChange = (name: string, value: string) => {
    setParamValues(prev => ({ ...prev, [name]: value }));
  };

  const handleBodyParamChange = (name: string, value: string) => {
    setBodyParamValues(prev => ({ ...prev, [name]: value }));
  };

  const generateSnippet = () => {
    if (!selectedEndpoint) return;

    let path = selectedEndpoint.path;
    selectedEndpoint.parameters.forEach(param => {
      path = path.replace(`{${param.name}}`, paramValues[param.name] || `{${param.name}}`);
    });

    const options: RequestInit = {
      method: selectedEndpoint.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Placeholder
      },
    };

    let bodySnippet = '';
    if (['POST', 'PUT'].includes(selectedEndpoint.method) && selectedEndpoint.bodyParameters) {
        const bodyObject: Record<string, any> = {};
        selectedEndpoint.bodyParameters.forEach(param => {
            try {
                // Attempt to parse if it looks like JSON (array/object) or keep as string
                if ((bodyParamValues[param.name].startsWith('{') && bodyParamValues[param.name].endsWith('}')) ||
                    (bodyParamValues[param.name].startsWith('[') && bodyParamValues[param.name].endsWith(']'))) {
                    bodyObject[param.name] = JSON.parse(bodyParamValues[param.name]);
                } else if (param.type === 'number') {
                    bodyObject[param.name] = parseFloat(bodyParamValues[param.name]);
                } else if (param.type === 'boolean') {
                    bodyObject[param.name] = bodyParamValues[param.name].toLowerCase() === 'true';
                } else {
                    bodyObject[param.name] = bodyParamValues[param.name];
                }
            } catch (e) {
                 bodyObject[param.name] = bodyParamValues[param.name]; // Fallback to string if parse fails
            }
        });
        options.body = JSON.stringify(bodyObject, null, 2);
        bodySnippet = `const body = ${options.body};\n`;
    }


    const snippet = `
async function callApi() {
  const url = 'https://your-api-domain.com${path}'; // Replace with your actual API domain
  ${bodySnippet}
  const options = {
    method: '${selectedEndpoint.method}',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // Replace with your actual token
    }${options.body ? `,\n    body: JSON.stringify(body)` : ''}
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
}

callApi();
`;
    setGeneratedSnippet(snippet.trim());
  };

  const copyToClipboard = () => {
    if (!generatedSnippet) return;
    navigator.clipboard.writeText(generatedSnippet)
      .then(() => toast({ title: "Copied!", description: "Code snippet copied to clipboard." }))
      .catch(() => toast({ variant: "destructive", title: "Failed to copy", description: "Could not copy to clipboard." }));
  };
  
  const renderParameterInput = (param: ApiParameter, value: string, onChange: (val: string) => void) => {
    if (param.type === 'array' || param.type === 'object') {
      return (
        <Textarea
          id={param.name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={param.placeholder || `Enter ${param.type === 'array' ? 'JSON array' : 'JSON object'}`}
          className="font-code"
          rows={3}
        />
      );
    }
    return (
      <Input
        id={param.name}
        type={param.type === 'number' ? 'number' : 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={param.placeholder || param.name}
        className="font-code"
      />
    );
  };


  if (!selectedEndpoint) {
    return (
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Code2 className="mr-2 h-6 w-6 text-primary" /> Code Snippet Generator</CardTitle>
          <CardDescription>Select an API endpoint from the table above to generate a code snippet and test parameters.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No endpoint selected.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center"><Code2 className="mr-2 h-6 w-6 text-primary" /> {selectedEndpoint.name}</CardTitle>
        <CardDescription>Generate a JavaScript code snippet for this endpoint. Fill in the parameters below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {selectedEndpoint.parameters.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 font-headline">URL Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedEndpoint.parameters.map(param => (
                <div key={param.name} className="space-y-1">
                  <Label htmlFor={param.name} className="text-sm font-medium">
                    {param.name} {param.required && <span className="text-destructive">*</span>}
                    <span className="text-xs text-muted-foreground ml-1">({param.type})</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mb-1">{param.description}</p>
                  {renderParameterInput(param, paramValues[param.name] || '', (val) => handleParamChange(param.name, val))}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedEndpoint.bodyParameters && selectedEndpoint.bodyParameters.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 font-headline">Body Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedEndpoint.bodyParameters.map(param => (
                <div key={param.name} className="space-y-1">
                  <Label htmlFor={`body-${param.name}`} className="text-sm font-medium">
                    {param.name} {param.required && <span className="text-destructive">*</span>}
                    <span className="text-xs text-muted-foreground ml-1">({param.type})</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mb-1">{param.description}</p>
                  {renderParameterInput(param, bodyParamValues[param.name] || '', (val) => handleBodyParamChange(param.name, val))}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {(selectedEndpoint.parameters.length === 0 && (!selectedEndpoint.bodyParameters || selectedEndpoint.bodyParameters.length === 0)) && (
            <p className="text-muted-foreground">This endpoint does not require any parameters.</p>
        )}

        <Button onClick={generateSnippet} className="w-full md:w-auto bg-primary hover:bg-primary/90">
          Generate Snippet
        </Button>

        {generatedSnippet && (
          <div className="mt-4 space-y-2">
            <Label htmlFor="code-snippet" className="text-lg font-semibold font-headline">Generated JavaScript Snippet</Label>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-md overflow-x-auto font-code text-sm border border-border">
                <code>{generatedSnippet}</code>
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7"
                onClick={copyToClipboard}
                aria-label="Copy code snippet"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Remember to replace placeholders like <code>YOUR_ACCESS_TOKEN</code> and <code>https://your-api-domain.com</code> with actual values.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
