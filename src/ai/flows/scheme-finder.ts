'use server';

/**
 * @fileOverview A government scheme finder AI agent.
 *
 * - findSchemes - A function that handles the scheme finding process.
 * - FindSchemesInput - The input type for the findSchemes function.
 * - FindSchemesOutput - The return type for the findSchemes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindSchemesInputSchema = z.object({
  location: z.string().describe("The farmer's location (e.g., city, state)."),
  landParcel: z.number().describe('The size of the land parcel in acres.'),
  cropName: z.string().describe('The name of the crop the farmer is growing.'),
  subsidiesFor: z.string().describe('The specific subsidies the farmer is looking for (e.g., irrigation, seeds, fertilizers).'),
});
export type FindSchemesInput = z.infer<typeof FindSchemesInputSchema>;

const FindSchemesOutputSchema = z.object({
  schemes: z.array(
    z.object({
      name: z.string().describe('The name of the government scheme.'),
      description: z.string().describe('A brief description of the scheme.'),
      eligibilityCriteria: z.string().describe('The eligibility criteria for the scheme.'),
      benefits: z.string().describe('The benefits offered by the scheme.'),
      howToApply: z.string().describe('Instructions on how to apply for the scheme.'),
    })
  ).describe('A list of government schemes that the farmer might be eligible for.'),
});
export type FindSchemesOutput = z.infer<typeof FindSchemesOutputSchema>;

export async function findSchemes(input: FindSchemesInput): Promise<FindSchemesOutput> {
  return findSchemesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findSchemesPrompt',
  input: {schema: FindSchemesInputSchema},
  output: {schema: FindSchemesOutputSchema},
  prompt: `You are an expert in Indian government schemes for farmers.

You will be provided with a detailed description of a farmer's situation. Your goal is to identify relevant government schemes that the farmer might be eligible for.

Farmer's Situation:
- Location: {{{location}}}
- Land Parcel Size: {{{landParcel}}} acres
- Crop: {{{cropName}}}
- Looking for subsidies for: {{{subsidiesFor}}}

Based on the situation above, identify relevant government schemes and provide a detailed description of each scheme, including eligibility criteria, benefits, and how to apply.`,
});

const findSchemesFlow = ai.defineFlow(
  {
    name: 'findSchemesFlow',
    inputSchema: FindSchemesInputSchema,
    outputSchema: FindSchemesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
