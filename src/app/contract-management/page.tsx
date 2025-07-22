
"use client";
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/common/page-header";
import { ResultDisplay } from "@/components/common/result-display";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { summarizeContract, AiContractSummaryInput, AiContractSummaryOutput } from '@/ai/flows/ai-contract-summary';
import { FileText, UploadCloud } from '@/components/common/icons';
import { useToast } from '@/hooks/use-toast';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["application/pdf", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];


const formSchema = z.object({
  contractFile: z
    .custom<FileList>((val) => val instanceof FileList && val.length > 0, "Please select a contract document.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE_BYTES, `File size should be less than ${MAX_FILE_SIZE_MB}MB.`)
    .refine((files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), "Invalid file type. Please upload a PDF, TXT, DOC, or DOCX file."),
});

type FormData = z.infer<typeof formSchema>;

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function ContractManagementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiContractSummaryOutput | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const file = data.contractFile[0];
      const contractDataUri = await fileToDataUri(file);
      const input: AiContractSummaryInput = { contractDataUri };
      const response = await summarizeContract(input);
      setResult(response);
      toast({ title: "Contract Summarized", description: "The contract has been successfully summarized by AI." });
    } catch (e: any) {
      setError(e.message || "Failed to summarize contract.");
      toast({ variant: "destructive", title: "Error", description: e.message || "Failed to summarize contract." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
      // Trigger validation for the file input
      form.setValue('contractFile', files, { shouldValidate: true });
    } else {
      setFileName(null);
      form.resetField('contractFile');
    }
  };

  return (
    <AppLayout>
      <PageHeader 
        title="AI Contract Management" 
        description="Upload a contract document (PDF, TXT, DOC, DOCX) to get an AI-generated summary of key terms and obligations."
        icon={FileText}
      />

      <Card className="shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Summarize Contract</CardTitle>
              <CardDescription>Upload your contract document below.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="contractFile"
                render={({ field: { onChange, onBlur, name, ref } }) => ( // Handling file input correctly
                  <FormItem>
                    <FormLabel
                      htmlFor="contract-file-input"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PDF, TXT, DOC, DOCX (MAX. {MAX_FILE_SIZE_MB}MB)</p>
                        {fileName && <p className="text-xs text-primary mt-2">{fileName}</p>}
                      </div>
                      <FormControl>
                        <Input
                          id="contract-file-input"
                          type="file"
                          className="hidden"
                          accept={ACCEPTED_FILE_TYPES.join(",")}
                          onChange={(e) => {
                            handleFileChange(e); // Manages fileName display
                            onChange(e.target.files); // RHF updates form value
                          }}
                          onBlur={onBlur}
                          name={name}
                          ref={ref}
                        />
                      </FormControl>
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                {isLoading ? 'Summarizing...' : 'Summarize Contract'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <ResultDisplay
        isLoading={isLoading}
        error={error}
        data={result ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contract Summary:</h3>
            <div className="p-4 bg-muted rounded-md whitespace-pre-wrap text-sm leading-relaxed">{result.summary}</div>
          </div>
        ) : null}
        title="AI Contract Analysis"
        loadingText="AI is analyzing the contract..."
        noResultsText="Upload a contract and click 'Summarize Contract' to see the AI-generated summary."
      />
    </AppLayout>
  );
}
