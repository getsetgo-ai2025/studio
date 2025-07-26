"use server";

import { z } from "zod";
import { findSchemes, type FindSchemesOutput } from "@/ai/flows/scheme-finder";

const formSchema = z.object({
  situation: z.string().min(10, "Please provide a more detailed description of your situation."),
});

type State = {
  data: FindSchemesOutput | null;
  error: string | null;
  formErrors?: {
    situation?: string[];
  };
};

export async function getSchemes(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = formSchema.safeParse({
    situation: formData.get("situation"),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: "Invalid form data.",
      formErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { situation } = validatedFields.data;

  try {
    const result = await findSchemes({
      situation,
    });

    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { data: null, error: `Failed to find schemes: ${errorMessage}` };
  }
}
