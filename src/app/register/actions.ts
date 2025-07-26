"use server";

import { z } from "zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { redirect } from "next/navigation";
import { FirebaseError } from "firebase/app";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long."),
}).refine(data => data.password === (data as any).confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

type State = {
  fieldErrors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  error?: string | null;
} | null;


export async function register(prevState: State, formData: FormData): Promise<State> {
    const validatedFields = schema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    });

    if (!validatedFields.success) {
        return {
            fieldErrors: validatedFields.error.flatten().fieldErrors,
            error: "Invalid form data."
        };
    }

    const { email, password } = validatedFields.data;

    try {
       // As with login, we can't truly create the user on the server
       // without the Admin SDK. We redirect and let the client handle it.
    } catch (e) {
        const error = e as FirebaseError;
        let errorMessage = "An unknown error occurred.";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already registered. Please login.';
        } else {
            errorMessage = error.message;
        }
        return { error: errorMessage };
    }

    redirect('/');
}
