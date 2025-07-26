"use server";

import { z } from "zod";
import { getMarketOverview, type MarketOverviewOutput } from "@/ai/flows/market-analysis-overview";

const formSchema = z.object({
  location: z.string().min(2, "Please provide a valid location."),
  cropDescription: z.string().min(3, "Please provide a more detailed crop name or description."),
});

type State = {
  data: MarketOverviewOutput | null;
  error: string | null;
  formErrors?: {
    location?: string[];
    cropDescription?: string[];
  };
};

export async function getAnalysis(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = formSchema.safeParse({
    location: formData.get("location"),
    cropDescription: formData.get("cropDescription"),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: "Invalid form data.",
      formErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { location, cropDescription } = validatedFields.data;

  try {
    const result = await getMarketOverview({
      location,
      cropDescription,
    });

    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { data: null, error: `Failed to get market analysis: ${errorMessage}` };
  }
}
