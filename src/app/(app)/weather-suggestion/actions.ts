
"use server";

import { z } from "zod";
import { getWeatherSuggestions, type WeatherSuggestionOutput } from "@/ai/flows/weather-suggestion";
import { translateText } from "@/ai/flows/translator";

const formSchema = z.object({
  cropName: z.string().min(2, "Please provide a valid crop name."),
  location: z.string().min(3, "Could not determine location. Please ensure location services are enabled."),
  language: z.enum(['en', 'kn']),
});

type State = {
  data: WeatherSuggestionOutput | null;
  error: string | null;
  formErrors?: z.ZodError<z.infer<typeof formSchema>>['formErrors']['fieldErrors'];
};

export async function getSuggestions(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = formSchema.safeParse({
    cropName: formData.get("cropName"),
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
    const result = await getWeatherSuggestions(inputData);

    if (language === 'kn') {
        const [
            translatedToday,
            translatedTomorrow,
            translatedNext7Days,
        ] = await Promise.all([
            translateText({ text: result.today, targetLanguage: 'kn' }),
            translateText({ text: result.tomorrow, targetLanguage: 'kn' }),
            translateText({ text: result.next7Days, targetLanguage: 'kn' }),
        ]);

        return {
            data: { 
                today: translatedToday.translatedText,
                tomorrow: translatedTomorrow.translatedText,
                next7Days: translatedNext7Days.translatedText,
             },
            error: null,
        }
    }


    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { data: null, error: `Failed to get suggestions: ${errorMessage}` };
  }
}
