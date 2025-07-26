"use server";

import { z } from "zod";
import { findSchemes, type FindSchemesOutput } from "@/ai/flows/scheme-finder";

const formSchema = z.object({
  location: z.string().min(2, "Please provide a valid location."),
  landParcel: z.coerce.number().positive("Land parcel must be a positive number."),
  cropName: z.string().min(3, "Please provide a valid crop name."),
  subsidiesFor: z.string().min(10, "Please describe the subsidies you are looking for in more detail."),
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
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: "Invalid form data.",
      formErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { location, landParcel, cropName, subsidiesFor } = validatedFields.data;

  try {
    const result = await findSchemes({
      location,
      landParcel,
      cropName,
      subsidiesFor,
    });

    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { data: null, error: `Failed to find schemes: ${errorMessage}` };
  }
}
