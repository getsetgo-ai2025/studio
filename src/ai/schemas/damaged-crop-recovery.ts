import { z } from 'zod';

export const DamagedCropInputSchema = z.object({
  cropName: z.string().describe('The name of the crop.'),
  cropStage: z.enum(['Seedling', 'Vegetative', 'Flowering', 'Harvest']).describe('The current growth stage of the crop.'),
  damageType: z.array(z.enum(['Heavy Rain', 'Drought', 'Pest Attack', 'Disease', 'Hailstorm', 'Other'])).describe('The type(s) of damage sustained by the crop.'),
  damageExtent: z.enum(['<25%', '25-50%', '50-75%', '>75%']).describe('The estimated extent of the damage.'),
  location: z.string().describe('The location of the farm to find nearby buyers.'),
});
export type DamagedCropInput = z.infer<typeof DamagedCropInputSchema>;

export const DamagedCropOutputSchema = z.object({
    recoveryProbability: z.number().describe('The estimated probability (as a percentage, e.g., 65) of successfully saving the crop.'),
    salvagingMethods: z.array(z.string()).describe('A list of suggested methods to salvage the damaged crop.'),
    alternativeBuyers: z.array(z.object({
        name: z.string().describe("The name of the buyer or company."),
        contact: z.string().describe("The contact number of the buyer."),
        buyerType: z.string().describe("The type of buyer (e.g., Poultry Feed Unit, Juice Factory, Ethanol Plant)."),
    })).describe('A list of potential nearby alternative buyers for the damaged crop.'),
    recommendation: z.string().optional().describe('A specific recommendation for the farmer if the recovery probability is low (e.g., below 40%). This should guide them on whether to pursue salvaging or consider alternative options immediately.'),
});
export type DamagedCropOutput = z.infer<typeof DamagedCropOutputSchema>;
