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

const CropHealthAdviceInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of diseased crops, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('A description of the symptoms or conditions of the crops.'),
});
export type CropHealthAdviceInput = z.infer<typeof CropHealthAdviceInputSchema>;

const CropHealthAdviceOutputSchema = z.object({
  diagnosis: z.string().describe('The diagnosis of the crop issue.'),
  treatmentPlan: z.string().describe('A treatment plan for the diagnosed issue.'),
});
export type CropHealthAdviceOutput = z.infer<typeof CropHealthAdviceOutputSchema>;

export async function getCropHealthAdvice(input: CropHealthAdviceInput): Promise<CropHealthAdviceOutput> {
  return cropHealthAdviceFlow(input);
}

const cropHealthAdvicePrompt = ai.definePrompt({
  name: 'cropHealthAdvicePrompt',
  input: {schema: CropHealthAdviceInputSchema},
  output: {schema: CropHealthAdviceOutputSchema},
  prompt: `You are an expert agricultural advisor. A farmer has provided you with a photo and description of their diseased crops.

  Based on this information, provide a diagnosis and a treatment plan.

  Description: {{{description}}}
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
