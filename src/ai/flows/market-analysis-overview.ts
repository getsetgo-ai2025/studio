'use server';

/**
 * @fileOverview An AI agent to provide market analysis overview for crops.
 *
 * - getMarketOverview - A function that handles the market analysis process.
 * - MarketOverviewInput - The input type for the getMarketOverview function.
 * - MarketOverviewOutput - The return type for the getMarketOverview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketOverviewInputSchema = z.object({
  cropDescription: z
    .string()
    .describe('A description of the crop for which market analysis is needed. This can be voice input or text.'),
});
export type MarketOverviewInput = z.infer<typeof MarketOverviewInputSchema>;

const MarketOverviewOutputSchema = z.object({
  marketOverview: z.string().describe('An overview of the market analysis for the specified crop, including pricing insights.'),
});
export type MarketOverviewOutput = z.infer<typeof MarketOverviewOutputSchema>;

export async function getMarketOverview(input: MarketOverviewInput): Promise<MarketOverviewOutput> {
  return marketOverviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketOverviewPrompt',
  input: {schema: MarketOverviewInputSchema},
  output: {schema: MarketOverviewOutputSchema},
  prompt: `You are an AI market analyst specializing in providing crop pricing insights.

  Based on the provided crop description, generate an overview of the market, including pricing insights.

  Crop Description: {{{cropDescription}}}`,
});

const marketOverviewFlow = ai.defineFlow(
  {
    name: 'marketOverviewFlow',
    inputSchema: MarketOverviewInputSchema,
    outputSchema: MarketOverviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
