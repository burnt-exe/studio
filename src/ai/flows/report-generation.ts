'use server';

/**
 * @fileOverview An AI agent for automated report generation.
 *
 * - generateReport - A function that handles the report generation process.
 * - GenerateReportInput - The input type for the generateReport function.
 * - GenerateReportOutput - The return type for the generateReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportInputSchema = z.object({
  reportType: z.string().describe('The type of report to generate (e.g., weekly sales, monthly marketing).'),
  parameters: z.record(z.any()).optional().describe('Additional parameters for the report, specific to the report type.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  report: z.string().describe('The generated report in a suitable format (e.g., Markdown, JSON, PDF text representation).'),
  summary: z.string().describe('A brief summary of the report.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: {schema: GenerateReportInputSchema},
  output: {schema: GenerateReportOutputSchema},
  prompt: `You are an AI-powered report generator. Based on the requested report type and provided parameters, generate a comprehensive report and a brief summary.

Report Type: {{{reportType}}}
Parameters: {{{parameters}}}

Generate the report and summary.
`, // Consider adding output format instructions here if needed
});

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
