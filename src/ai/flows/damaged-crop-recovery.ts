'use server';

/**
 * @fileOverview An AI agent to provide advice for damaged crops and find alternative markets.
 *
 * - getDamagedCropAdvice - A function that handles the advice generation process.
 * - DamagedCropInput - The input type for the getDamagedCropAdvice function.
 * - DamagedCropOutput - The return type for the getDamagedCropAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { findAlternativeBuyersTool } from '../tools/find-alternative-buyers';

export const DamagedCropInputSchema = z.object({
  cropName: z.string().describe('The name of the crop.'),
  cropStage: z.enum(['Seedling', 'Vegetative', 'Flowering', 'Harvest']).describe('The current growth stage of the crop.'),
  damageType: z.array(z.enum(['Heavy Rain', 'Drought', 'Pest Attack', 'Disease', 'Hailstorm', 'Other'])).describe('The type(s) of damage sustained by the crop.'),
  damageExtent: z.enum(['<25%', '25-50%', '50-75%', '>75%']).describe('The estimated extent of the damage.'),
  location: z.string().describe('The location of the farm to find nearby buyers.'),
});
export type DamagedCropInput = z.infer<typeof DamagedCropInputSchema>;

export const DamagedCropOutputSchema = z.object({
    salvagingMethods: z.array(z.string()).describe('A list of suggested methods to salvage the damaged crop.'),
    alternativeBuyers: z.array(z.object({
        name: z.string().describe("The name of the buyer or company."),
        contact: z.string().describe("The contact number of the buyer."),
        buyerType: z.string().describe("The type of buyer (e.g., Poultry Feed Unit, Juice Factory, Ethanol Plant)."),
    })).describe('A list of potential nearby alternative buyers for the damaged crop.'),
});
export type DamagedCropOutput = z.infer<typeof DamagedCropOutputSchema>;

export async function getDamagedCropAdvice(input: DamagedCropInput): Promise<DamagedCropOutput> {
  return damagedCropRecoveryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'damagedCropRecoveryPrompt',
  input: {schema: DamagedCropInputSchema},
  output: {schema: DamagedCropOutputSchema},
  tools: [findAlternativeBuyersTool],
  prompt: `You are an expert agricultural recovery specialist. A farmer has provided details about their damaged crop.

  Your tasks are:
  1.  Based on the crop name, stage, damage type, and extent, provide a list of practical and effective salvaging methods.
  2.  Use the findAlternativeBuyersTool to identify nearby buyers who might be interested in purchasing the damaged crop for alternative uses (e.g., animal feed, biofuel, compost).
  3.  Return the list of salvaging methods and the list of buyers found by the tool.

  Farmer's Input:
  - Crop Name: {{{cropName}}}
  - Crop Stage: {{{cropStage}}}
  - Type of Damage: {{#each damageType}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - Extent of Damage: {{{damageExtent}}}
  - Location: {{{location}}}
  `,
});

const damagedCropRecoveryFlow = ai.defineFlow(
  {
    name: 'damagedCropRecoveryFlow',
    inputSchema: DamagedCropInputSchema,
    outputSchema: DamagedCropOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
