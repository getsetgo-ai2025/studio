"use server";

import { z } from "zod";
import { getDamagedCropAdvice, type DamagedCropOutput } from "@/ai/flows/damaged-crop-recovery";
import { DamagedCropInputSchema } from "@/ai/schemas/damaged-crop-recovery";
import { translateText } from "@/ai/flows/translator";

const formSchema = DamagedCropInputSchema.extend({
    language: z.enum(['en', 'kn']),
    damageType: z.union([z.string(), z.array(z.string())])
        .refine(value => (Array.isArray(value) && value.length > 0) || typeof value === 'string', {
            message: "At least one damage type must be selected."
        }).transform(value => Array.isArray(value) ? value : [value]),
}).omit({ location: true }).extend({
    location: z.string().min(2, "Please provide a valid location."),
});

type State = {
  data: DamagedCropOutput | null;
  error: string | null;
  formErrors?: z.ZodError<z.infer<typeof formSchema>>['formErrors']['fieldErrors'];
};

export async function getAdvice(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = formSchema.safeParse({
    cropName: formData.get("cropName"),
    cropStage: formData.get("cropStage"),
    damageType: formData.getAll("damageType"),
    damageExtent: formData.get("damageExtent"),
    location: formData.get("location"),
    language: formData.get("language"),
  });
  
  if (!validatedFields.success) {
    return {
      data: null,
      error: "Invalid form data.",
      formErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { language, ...inputData } = validatedFields.data;

  try {
    const result = await getDamagedCropAdvice(inputData);

    if (language === 'kn') {
        const [translatedSalvagingMethods, translatedBuyers] = await Promise.all([
             Promise.all(result.salvagingMethods.map(m => translateText({ text: m, targetLanguage: 'kn' }))),
             Promise.all(result.alternativeBuyers.map(async (buyer) => {
                const [translatedName, translatedBuyerType] = await Promise.all([
                    translateText({ text: buyer.name, targetLanguage: 'kn' }),
                    translateText({ text: buyer.buyerType, targetLanguage: 'kn' }),
                ]);
                return { ...buyer, name: translatedName.translatedText, buyerType: translatedBuyerType.translatedText };
             }))
        ]);

        return {
            data: {
                salvagingMethods: translatedSalvagingMethods.map(m => m.translatedText),
                alternativeBuyers: translatedBuyers,
            },
            error: null
        }
    }


    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { data: null, error: `Failed to get advice: ${errorMessage}` };
  }
}
