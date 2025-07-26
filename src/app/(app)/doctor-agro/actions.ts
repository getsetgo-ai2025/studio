"use server";

import { z } from "zod";
import { getCropHealthAdvice, type CropHealthAdviceOutput } from "@/ai/flows/crop-health-advice";
import { translateText } from "@/ai/flows/translator";

const formSchema = z.object({
  description: z.string().min(10, "Please provide a more detailed description."),
  location: z.string().min(2, "Please provide a valid location."),
  image: z
    .any()
    .refine((file) => file?.size > 0, "An image of the crop is required.")
    .refine((file) => file?.type.startsWith("image/"), "Only image files are accepted."),
  language: z.enum(['en', 'kn']),
});

type State = {
  data: CropHealthAdviceOutput | null;
  error: string | null;
  formErrors?: {
    description?: string[];
    image?: string[];
    location?: string[];
  };
};

export async function getAdvice(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = formSchema.safeParse({
    description: formData.get("description"),
    location: formData.get("location"),
    image: formData.get("image"),
    language: formData.get("language"),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: "Invalid form data.",
      formErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { description, image: file, language, location } = validatedFields.data;

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const photoDataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await getCropHealthAdvice({
      description,
      location,
      photoDataUri,
    });

    if (language === 'kn') {
        const [
            translatedAnalysis, 
            translatedTreatmentPlan,
            translatedRequiredProducts,
            translatedNearbyOutlets,
        ] = await Promise.all([
            translateText({ text: result.analysis, targetLanguage: 'kn' }),
            result.treatmentPlan ? translateText({ text: result.treatmentPlan, targetLanguage: 'kn' }) : Promise.resolve(null),
            result.requiredProducts ? Promise.all(result.requiredProducts.map(p => translateText({ text: p, targetLanguage: 'kn' }))) : Promise.resolve(null),
            result.nearbyOutlets ? Promise.all(result.nearbyOutlets.map(o => translateText({ text: o, targetLanguage: 'kn' }))) : Promise.resolve(null),
        ]);
        
        return { 
            data: {
                isHealthy: result.isHealthy,
                analysis: translatedAnalysis.translatedText,
                treatmentPlan: translatedTreatmentPlan?.translatedText,
                requiredProducts: translatedRequiredProducts?.map(p => p.translatedText),
                nearbyOutlets: translatedNearbyOutlets?.map(o => o.translatedText),
            }, 
            error: null 
        };
    }

    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { data: null, error: `Failed to get advice: ${errorMessage}` };
  }
}
