'use server';

/**
 * @fileOverview Provides crop health advice based on an image of diseased crops.
 *
 * - getCropHealthAdvice - A function that takes an image and description of diseased crops and returns a diagnosis and treatment plan.
 * - CropHealthAdviceInput - The input type for the getCropHealthAdvice function.
 * - CropHealthAdviceOutput - The return type for the getCropHealthAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { findNearbyStoresTool } from '../tools/find-nearby-stores';

const CropHealthAdviceInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of diseased crops, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('A description of the symptoms or conditions of the crops.'),
  location: z.string().describe('The current location of the user to find nearby stores.'),
});
export type CropHealthAdviceInput = z.infer<typeof CropHealthAdviceInputSchema>;

const CropHealthAdviceOutputSchema = z.object({
    isHealthy: z.boolean().describe("Whether the crop is healthy or not."),
    analysis: z.string().describe('The detailed analysis of the crop issue.'),
    treatmentPlan: z.string().optional().describe('A treatment plan for the diagnosed issue. This should only be present if the crop is not healthy.'),
    requiredProducts: z.array(z.string()).optional().describe('A list of products or medicines required for the treatment. This should only be present if the crop is not healthy.'),
    nearbyOutlets: z.array(z.string()).optional().describe('A list of nearby outlets where the farmer can get the needed medicines. This should only be present if a treatment is needed.'),
});
export type CropHealthAdviceOutput = z.infer<typeof CropHealthAdviceOutputSchema>;

export async function getCropHealthAdvice(input: CropHealthAdviceInput): Promise<CropHealthAdviceOutput> {
  return cropHealthAdviceFlow(input);
}

const cropHealthAdvicePrompt = ai.definePrompt({
  name: 'cropHealthAdvicePrompt',
  input: {schema: CropHealthAdviceInputSchema},
  output: {schema: CropHealthAdviceOutputSchema},
  tools: [findNearbyStoresTool],
  prompt: `You are an expert agricultural advisor. A farmer has provided you with a photo and description of their crops, along with their location.

  1.  First, analyze the provided photo and description to determine if the crop is healthy.
  2.  Provide a detailed analysis of your findings.
  3.  If the crop is unhealthy:
      a.  Formulate a detailed treatment plan.
      b.  List the specific products or medicines required for the treatment.
      c.  Use the findNearbyStoresTool to find outlets near the user's location that sell the required products. Your response for nearbyOutlets should be based *only* on the output of this tool.

  Description: {{{description}}}
  Location: {{{location}}}
  Photo: {{media url=photoDataUri}}
  `,
});

const cropHealthAdviceFlow = ai.defineFlow(
  {
    name: 'cropHealthAdviceFlow',
    inputSchema: CropHealthAdviceInputSchema,
    outputSchema: CropHealthAdviceOutputSchema,
  },
  async input => {
    const {output} = await cropHealthAdvicePrompt(input);
    return output!;
  }
);
