'use server';
/**
 * @fileOverview An AI agent that generates branded content.
 *
 * - generateBrandedContent - A function that handles the content generation process.
 * - GenerateBrandedContentInput - The input type for the generateBrandedContent function.
 * - GenerateBrandedContentOutput - The return type for the generateBrandedContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBrandedContentInputSchema = z.object({
  brandVoice: z.string().describe('A description of the brand voice, tone, and style.'),
  topic: z.string().describe('The topic or theme for the content.'),
  contentType: z.enum(['Social Media Post', 'Email Newsletter', 'Blog Post']).describe('The type of content to generate.'),
  campaignDetails: z.string().optional().describe('Details about an affiliate campaign to include, such as product name, description, and the affiliate link.'),
});
export type GenerateBrandedContentInput = z.infer<typeof GenerateBrandedContentInputSchema>;

const GenerateBrandedContentOutputSchema = z.object({
  title: z.string().describe('The generated title or headline for the content.'),
  body: z.string().describe('The main body of the generated content.'),
});
export type GenerateBrandedContentOutput = z.infer<typeof GenerateBrandedContentOutputSchema>;

export async function generateBrandedContent(input: GenerateBrandedContentInput): Promise<GenerateBrandedContentOutput> {
  return generateBrandedContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBrandedContentPrompt',
  input: {schema: GenerateBrandedContentInputSchema},
  output: {schema: GenerateBrandedContentOutputSchema},
  prompt: `You are an expert content creator and copywriter. Your task is to generate a "{{contentType}}" based on the provided topic and brand voice.

Brand Voice Description:
---
{{{brandVoice}}}
---

Content Topic: "{{{topic}}}"

{{#if campaignDetails}}
Affiliate Campaign Details:
---
{{{campaignDetails}}}
---
When relevant, you MUST naturally weave the affiliate campaign details and its link into the generated content. Make it compelling and encourage the user to click.
{{/if}}


Based on the above, generate a compelling "{{contentType}}". Create a suitable title and body text. If it is a social media post, include relevant hashtags.
`,
});

const generateBrandedContentFlow = ai.defineFlow(
  {
    name: 'generateBrandedContentFlow',
    inputSchema: GenerateBrandedContentInputSchema,
    outputSchema: GenerateBrandedContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
