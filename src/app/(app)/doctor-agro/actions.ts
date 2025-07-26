"use server";

import { z } from "zod";
import { getCropHealthAdvice, type CropHealthAdviceOutput } from "@/ai/flows/crop-health-advice";
import { translateText } from "@/ai/flows/translator";

const formSchema = z.object({
  description: z.string().min(10, "Please provide a more detailed description."),
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
  };
};

export async function getAdvice(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = formSchema.safeParse({
    description: formData.get("description"),
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

  const { description, image: file, language } = validatedFields.data;

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const photoDataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await getCropHealthAdvice({
      description,
      photoDataUri,
    });

    if (language === 'kn') {
        const [translatedDiagnosis, translatedTreatmentPlan] = await Promise.all([
            translateText({ text: result.diagnosis, targetLanguage: 'kn' }),
            translateText({ text: result.treatmentPlan, targetLanguage: 'kn' })
        ]);
        return { 
            data: { 
                diagnosis: translatedDiagnosis.translatedText, 
                treatmentPlan: translatedTreatmentPlan.translatedText 
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
