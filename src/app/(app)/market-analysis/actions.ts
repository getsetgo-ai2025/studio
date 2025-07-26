"use server";

import { z } from "zod";
import { getMarketOverview, type MarketOverviewOutput } from "@/ai/flows/market-analysis-overview";
import { translateText } from "@/ai/flows/translator";

const formSchema = z.object({
  location: z.string().min(2, "Please provide a valid location."),
  cropDescription: z.string().min(3, "Please provide a more detailed crop name or description."),
  language: z.enum(['en', 'kn']),
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
    language: formData.get("language"),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: "Invalid form data.",
      formErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { location, cropDescription, language } = validatedFields.data;

  try {
    const result = await getMarketOverview({
      location,
      cropDescription,
    });

    if (language === 'kn') {
        const [translatedMaxConsumption, translatedEffectiveConsumer, translatedOverview] = await Promise.all([
            translateText({ text: result.maximumConsumption, targetLanguage: 'kn' }),
            translateText({ text: result.effectiveConsumer, targetLanguage: 'kn' }),
            translateText({ text: result.marketOverview, targetLanguage: 'kn' })
        ]);
        return {
            data: {
                ...result,
                maximumConsumption: translatedMaxConsumption.translatedText,
                effectiveConsumer: translatedEffectiveConsumer.translatedText,
                marketOverview: translatedOverview.translatedText,
            },
            error: null
        }
    }


    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { data: null, error: `Failed to get market analysis: ${errorMessage}` };
  }
}
