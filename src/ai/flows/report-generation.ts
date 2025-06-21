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
  reportData: z.string().describe('The raw data for the report, provided as a JSON string.'),
  parameters: z.record(z.any()).optional().describe('Additional parameters for the report, specific to the report type.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  report: z.string().describe('The generated report in a suitable format (e.g., Markdown, JSON, PDF text representation).'),
  summary: z.string().describe('A brief summary of the report.'),
  suggestedNextSteps: z.array(z.string()).describe('A list of suggested next steps or actions based on the report findings.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: {schema: GenerateReportInputSchema},
  output: {schema: GenerateReportOutputSchema},
  prompt: `You are an AI-powered report generator. Based on the requested report type, provided data, and any additional parameters, generate a comprehensive report and a brief summary.

You must use the provided real-time data as the primary source for your report generation.

In addition, provide a list of 2-3 actionable next steps a user could take based on the generated report.

Report Type: {{{reportType}}}
Parameters: {{{parameters}}}
Data:
\`\`\`json
{{{reportData}}}
\`\`\`

Generate the report, summary, and suggested next steps.
`, 
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
