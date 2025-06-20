'use server';

/**
 * @fileOverview A question answering and code generation AI agent for API documentation.
 *
 * - askApiDocumentation - A function that handles the question answering and code generation process.
 * - AskApiDocumentationInput - The input type for the askApiDocumentation function.
 * - AskApiDocumentationOutput - The return type for the askApiDocumentation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskApiDocumentationInputSchema = z.object({
  apiDocumentation: z.string().describe('The API documentation to answer questions about.'),
  question: z.string().describe('The question to ask or task to perform based on the API documentation.'),
});
export type AskApiDocumentationInput = z.infer<typeof AskApiDocumentationInputSchema>;

const AskApiDocumentationOutputSchema = z.object({
  explanation: z.string().describe('A natural language explanation of how to use the API to accomplish the requested task.'),
  codeSnippet: z.string().describe('A JavaScript `fetch` code snippet demonstrating the API call. Assume the code will run in a browser environment. It should include placeholders for things like API keys.'),
});
export type AskApiDocumentationOutput = z.infer<typeof AskApiDocumentationOutputSchema>;

export async function askApiDocumentation(input: AskApiDocumentationInput): Promise<AskApiDocumentationOutput> {
  return askApiDocumentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askApiDocumentationPrompt',
  input: {schema: AskApiDocumentationInputSchema},
  output: {schema: AskApiDocumentationOutputSchema},
  prompt: `You are an expert API assistant. Your task is to help developers by answering their questions about a given API documentation and generating code snippets.

You will be given some API documentation and a user's question. Based on this, you must generate a helpful explanation and a functional JavaScript \`fetch\` code snippet to achieve the user's goal.

Make sure the code snippet is complete and ready to run, but use placeholders like 'YOUR_API_KEY' for any sensitive information.

API Documentation:
\`\`\`
{{{apiDocumentation}}}
\`\`\`

User's Question: "{{{question}}}"

Now, provide the explanation and the code snippet.`,
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
