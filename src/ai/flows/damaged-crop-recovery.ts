'use server';

/**
 * @fileOverview An AI agent to provide advice for damaged crops and find alternative markets.
 *
 * - getDamagedCropAdvice - A function that handles the advice generation process.
 * - DamagedCropInput - The input type for the getDamagedCropAdvice function.
 * - DamagedCropOutput - The return type for the getDamagedCropAdvice function.
 */

import {ai} from '@/ai/genkit';
import { findAlternativeBuyersTool } from '../tools/find-alternative-buyers';
import { DamagedCropInputSchema, DamagedCropOutputSchema, type DamagedCropInput, type DamagedCropOutput } from '../schemas/damaged-crop-recovery';

export type { DamagedCropInput, DamagedCropOutput };

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
  1.  Based on the crop name, stage, damage type, and extent, estimate the probability of saving the crop as a percentage.
  2.  Provide a list of practical and effective salvaging methods.
  3.  If the recovery probability is low (e.g., below 40%), provide a specific recommendation to the farmer, suggesting they focus on alternative markets.
  4.  Use the findAlternativeBuyersTool to identify nearby buyers who might be interested in purchasing the damaged crop for alternative uses (e.g., animal feed, biofuel, compost).
  5.  Return the probability, salvaging methods, recommendation (if applicable), and the list of buyers found by the tool.

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
