'use server';

/**
 * @fileOverview An AI agent that summarizes key terms and obligations of a contract.
 *
 * - summarizeContract - A function that handles the contract summarization process.
 * - AiContractSummaryInput - The input type for the summarizeContract function.
 * - AiContractSummaryOutput - The return type for the summarizeContract function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiContractSummaryInputSchema = z.object({
  contractDataUri: z
    .string()
    .describe(
      "A contract document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AiContractSummaryInput = z.infer<typeof AiContractSummaryInputSchema>;

const AiContractSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the key terms and obligations in the contract.'),
});
export type AiContractSummaryOutput = z.infer<typeof AiContractSummaryOutputSchema>;

export async function summarizeContract(input: AiContractSummaryInput): Promise<AiContractSummaryOutput> {
  return aiContractSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiContractSummaryPrompt',
  input: {schema: AiContractSummaryInputSchema},
  output: {schema: AiContractSummaryOutputSchema},
  prompt: `You are an expert legal analyst specializing in contract review.

You will use the contract provided to identify and summarize the key terms and obligations.

Contract: {{media url=contractDataUri}}`,
});

const aiContractSummaryFlow = ai.defineFlow(
  {
    name: 'aiContractSummaryFlow',
    inputSchema: AiContractSummaryInputSchema,
    outputSchema: AiContractSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
