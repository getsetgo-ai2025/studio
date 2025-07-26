"use server";

import { z } from "zod";
import { findSchemes, type FindSchemesOutput } from "@/ai/flows/scheme-finder";
import { translateText } from "@/ai/flows/translator";

const formSchema = z.object({
  location: z.string().min(2, "Please provide a valid location."),
  landParcel: z.coerce.number().positive("Land parcel must be a positive number."),
  cropName: z.string().min(3, "Please provide a valid crop name."),
  subsidiesFor: z.string().min(10, "Please describe the subsidies you are looking for in more detail."),
  language: z.enum(['en', 'kn']),
});

type State = {
  data: FindSchemesOutput | null;
  error: string | null;
  formErrors?: {
    location?: string[];
    landParcel?: string[];
    cropName?: string[];
    subsidiesFor?: string[];
  };
};

export async function getSchemes(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = formSchema.safeParse({
    location: formData.get("location"),
    landParcel: formData.get("landParcel"),
    cropName: formData.get("cropName"),
    subsidiesFor: formData.get("subsidiesFor"),
    language: formData.get("language"),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: "Invalid form data.",
      formErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { location, landParcel, cropName, subsidiesFor, language } = validatedFields.data;

  try {
    const result = await findSchemes({
      location,
      landParcel,
      cropName,
      subsidiesFor,
    });

     if (language === 'kn') {
        const translatedSchemes = await Promise.all(
            result.schemes.map(async (scheme) => {
                const [
                    translatedName, 
                    translatedDescription, 
                    translatedEligibility, 
                    translatedBenefits, 
                    translatedHowToApply
                ] = await Promise.all([
                    translateText({ text: scheme.name, targetLanguage: 'kn' }),
                    translateText({ text: scheme.description, targetLanguage: 'kn' }),
                    translateText({ text: scheme.eligibilityCriteria, targetLanguage: 'kn' }),
                    translateText({ text: scheme.benefits, targetLanguage: 'kn' }),
                    translateText({ text: scheme.howToApply, targetLanguage: 'kn' }),
                ]);
                return {
                    name: translatedName.translatedText,
                    description: translatedDescription.translatedText,
                    eligibilityCriteria: translatedEligibility.translatedText,
                    benefits: translatedBenefits.translatedText,
                    howToApply: translatedHowToApply.translatedText,
                };
            })
        );
        return { data: { schemes: translatedSchemes }, error: null };
     }


    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { data: null, error: `Failed to find schemes: ${errorMessage}` };
  }
}
