"use server";

import { ai } from "@/ai/genkit";
import { z } from "zod";

export const findAlternativeBuyersTool = ai.defineTool(
  {
    name: "findAlternativeBuyersTool",
    description: "Finds nearby alternative buyers for damaged crops based on the crop type and location.",
    inputSchema: z.object({
      cropName: z.string().describe("The name of the damaged crop."),
      location: z.string().describe("The user's location to search for buyers."),
    }),
    outputSchema: z.object({
        buyers: z.array(z.object({
            name: z.string().describe("The name of the buyer or company."),
            contact: z.string().describe("The contact number of the buyer."),
            buyerType: z.string().describe("The type of buyer (e.g., Poultry Feed Unit, Juice Factory, Ethanol Plant)."),
        })).describe("A list of potential alternative buyers."),
    })
  },
  async (input) => {
    console.log(`Searching for alternative buyers for ${input.cropName} near ${input.location}`);
    
    // This is a mock implementation. In a real application, you would
    // query a database or an external API to find actual buyers.
    const mockBuyers = [
        { name: "GreenLeaf Organics", contact: "+91 98765 43210", buyerType: "Compost Unit" },
        { name: "Farm-to-Fuel Biofuels", contact: "+91 87654 32109", buyerType: "Ethanol Plant" },
        { name: "Karnataka Poultry Feed", contact: "+91 76543 21098", buyerType: "Poultry Feed Unit" },
        { name: "Nature's Nectar Juices", contact: "+91 65432 10987", buyerType: "Juice Factory" },
    ];

    return {
      buyers: mockBuyers,
    };
  }
);
