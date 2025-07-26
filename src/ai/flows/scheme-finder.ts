// Implemented by Gemini.
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
  situation: z.string().describe('The farmer\'s situation and the crops they are growing.'),
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

You will be provided with a description of the farmer's situation and the crops they are growing. Your goal is to identify relevant government schemes that the farmer might be eligible for.

Situation: {{{situation}}}

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
