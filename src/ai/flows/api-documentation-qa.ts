'use server';

/**
 * @fileOverview A question answering AI agent for API documentation.
 *
 * - askApiDocumentation - A function that handles the question answering process.
 * - AskApiDocumentationInput - The input type for the askApiDocumentation function.
 * - AskApiDocumentationOutput - The return type for the askApiDocumentation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskApiDocumentationInputSchema = z.object({
  apiDocumentation: z.string().describe('The API documentation to answer questions about.'),
  question: z.string().describe('The question to ask about the API documentation.'),
});
export type AskApiDocumentationInput = z.infer<typeof AskApiDocumentationInputSchema>;

const AskApiDocumentationOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the API documentation.'),
});
export type AskApiDocumentationOutput = z.infer<typeof AskApiDocumentationOutputSchema>;

export async function askApiDocumentation(input: AskApiDocumentationInput): Promise<AskApiDocumentationOutput> {
  return askApiDocumentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askApiDocumentationPrompt',
  input: {schema: AskApiDocumentationInputSchema},
  output: {schema: AskApiDocumentationOutputSchema},
  prompt: `You are an expert API documentation reader. You will answer questions about the provided API documentation.

API Documentation: {{{apiDocumentation}}}

Question: {{{question}}}

Answer:`,
});

const askApiDocumentationFlow = ai.defineFlow(
  {
    name: 'askApiDocumentationFlow',
    inputSchema: AskApiDocumentationInputSchema,
    outputSchema: AskApiDocumentationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
