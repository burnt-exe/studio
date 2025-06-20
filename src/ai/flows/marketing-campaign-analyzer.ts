'use server';

/**
 * @fileOverview A marketing campaign analysis AI agent.
 *
 * - analyzeMarketingCampaign - A function that handles the marketing campaign analysis process.
 * - AnalyzeMarketingCampaignInput - The input type for the analyzeMarketingCampaign function.
 * - AnalyzeMarketingCampaignOutput - The return type for the analyzeMarketingCampaign function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMarketingCampaignInputSchema = z.object({
  campaignData: z
    .string()
    .describe(
      'Data related to the marketing campaign including media, posts, ads, and other relevant information.'
    ),
});
export type AnalyzeMarketingCampaignInput = z.infer<typeof AnalyzeMarketingCampaignInputSchema>;

const AnalyzeMarketingCampaignOutputSchema = z.object({
  summary: z.string().describe('A summary of the marketing campaign performance.'),
  insights: z.array(z.string()).describe('Key insights derived from the campaign data.'),
  recommendations: z
    .array(z.string())
    .describe('Actionable recommendations for improving campaign performance.'),
});
export type AnalyzeMarketingCampaignOutput = z.infer<typeof AnalyzeMarketingCampaignOutputSchema>;

export async function analyzeMarketingCampaign(
  input: AnalyzeMarketingCampaignInput
): Promise<AnalyzeMarketingCampaignOutput> {
  return analyzeMarketingCampaignFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMarketingCampaignPrompt',
  input: {schema: AnalyzeMarketingCampaignInputSchema},
  output: {schema: AnalyzeMarketingCampaignOutputSchema},
  prompt: `You are an AI marketing expert specializing in analyzing marketing campaigns.

You will use the provided campaign data to generate a summary, identify key insights, and provide actionable recommendations.

Campaign Data: {{{campaignData}}}`,
});

const analyzeMarketingCampaignFlow = ai.defineFlow(
  {
    name: 'analyzeMarketingCampaignFlow',
    inputSchema: AnalyzeMarketingCampaignInputSchema,
    outputSchema: AnalyzeMarketingCampaignOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
