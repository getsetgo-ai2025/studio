
"use server";

import { z } from "zod";
import { auth } from "@/lib/firebase";

const formSchema = z.object({
  name: z.string().min(2, "Please provide a valid name."),
  phone: z.string().regex(/^[0-9]{10}$/, "Please provide a valid 10-digit phone number."),
  message: z.string().min(10, "Please provide a more detailed message."),
  attachment: z.any().optional(),
});

type State = {
  success: boolean;
  error: string | null;
  formErrors?: z.ZodError<z.infer<typeof formSchema>>['formErrors']['fieldErrors'];
};

export async function submitFeedback(
  prevState: State,
  formData: FormData
): Promise<State> {
  const currentUser = auth.currentUser;
  
  const validatedFields = formSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    attachment: formData.get("attachment"),
  });
  
  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid form data.",
      formErrors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { name, phone, message, attachment } = validatedFields.data;

  try {
    // In a real application, you would store this data in Firestore or Realtime Database.
    // For this example, we'll just log it to the console.
    console.log("Feedback submitted:", {
        userId: currentUser?.uid || 'guest',
        name,
        phone,
        message,
        fileName: attachment?.name,
        fileSize: attachment?.size,
        fileType: attachment?.type,
        submittedAt: new Date().toISOString(),
    });

    // Here you would handle the file upload to Firebase Storage if an attachment exists.

    return { success: true, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { success: false, error: `Failed to submit feedback: ${errorMessage}` };
  }
}
