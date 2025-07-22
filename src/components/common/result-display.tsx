
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, Info } from '@/components/common/icons';

interface ResultDisplayProps {
  isLoading: boolean;
  error: React.ReactNode | null;
  data: React.ReactNode | null;
  title?: string;
  description?: string;
  loadingText?: string;
  noResultsText?: string;
  successTitle?: string;
}

export function ResultDisplay({ 
  isLoading, 
  error, 
  data, 
  title,
  description,
  loadingText = "Processing your request...", 
  noResultsText = "No results to display yet. Submit the form above to see results.",
  successTitle = "Results" 
}: ResultDisplayProps) {
  if (isLoading) {
    return (
      <Card className="mt-6 shadow-md">
        <CardHeader>
           {title && <CardTitle className="flex items-center"><Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" /> {title}</CardTitle>}
           {!title && <CardTitle className="flex items-center"><Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" /> {loadingText}</CardTitle>}
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description || "Please wait while we fetch the information."}</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-6 border-destructive shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertCircle className="mr-2 h-5 w-5" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive-foreground bg-destructive/10 p-3 rounded-md">
            {typeof error === 'string' ? <p>{error}</p> : error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data) {
    return (
      <Card className="mt-6 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <CheckCircle2 className="mr-2 h-5 w-5" /> 
            {title || successTitle}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{data}</CardContent>
      </Card>
    );
  }

  return (
     <Card className="mt-6 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-muted-foreground">
            <Info className="mr-2 h-5 w-5" />
            {title || "Information"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">{noResultsText}</p>
        </CardContent>
      </Card>
  );
}
