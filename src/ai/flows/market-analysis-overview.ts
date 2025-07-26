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
  location: z
    .string()
    .describe('The geographical location (e.g., city, state, or region) for the market analysis.'),
});
export type MarketOverviewInput = z.infer<typeof MarketOverviewInputSchema>;

const MarketOverviewOutputSchema = z.object({
    predictiveValuePerTon: z.number().describe('The predictive value per ton for the crop in the specified currency based on current market trends.'),
    maximumConsumption: z.string().describe('The area, sector, or demographic with the maximum consumption for the crop.'),
    effectiveConsumer: z.string().describe('The most effective consumer type or market to target for maximum returns (e.g., local markets, export, processing units).'),
    marketOverview: z.string().describe('A general overview of the market analysis for the specified crop and location, including other pricing insights and trends.'),
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

  Based on the provided crop description and location, generate a detailed market analysis. The output should be structured to include:
  1. The predictive value per ton.
  2. The area of maximum consumption.
  3. The most effective consumer to target for maximum returns.
  4. A general market overview with any other relevant insights.

  Crop Description: {{{cropDescription}}}
  Location: {{{location}}}`,
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
