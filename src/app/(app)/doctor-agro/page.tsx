"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { getAdvice } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, AlertCircle, Loader2, Mic, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending: isPending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        "Get Advice"
      )}
    </Button>
  );
}

function ResultCard({
  data,
  error,
  pending: isPending,
}: {
  data: any;
  error: string | null;
  pending: boolean;
}) {
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Analysis Failed</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) return null;

  const fullText = `Diagnosis: ${data.diagnosis}. Treatment Plan: ${data.treatmentPlan}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Analysis Result</CardTitle>
                <CardDescription>
                Based on the information provided.
                </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleSpeak(fullText)}>
                <Volume2 className="h-5 w-5" />
                <span className="sr-only">Read aloud</span>
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-accent">Diagnosis</h3>
          <p className="text-muted-foreground">{data.diagnosis}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg text-accent">Treatment Plan</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{data.treatmentPlan}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DoctorAgroPage() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(getAdvice, {
    data: null,
    error: null,
  });
  const { pending: isPending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error && !state.formErrors) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    }
    if (state.data) {
        formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Crop Health Advisor</CardTitle>
          <CardDescription>
            Describe your crop's issue and upload a photo for an AI-powered diagnosis.
          </CardDescription>
        </CardHeader>
        <form ref={formRef} action={formAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Symptom Description</Label>
              <div className="relative">
                <Textarea
                  id="description"
                  name="description"
                  placeholder="e.g., 'My tomato plants have yellow spots on the leaves and the fruit is rotting.'"
                  rows={4}
                  required
                  className="pr-10"
                />
                <Button type="button" variant="ghost" size="icon" className="absolute bottom-2 right-1 h-7 w-7">
                  <Mic className="h-4 w-4" />
                  <span className="sr-only">Use voice input</span>
                </Button>
              </div>
              {state.formErrors?.description && (
                <p className="text-sm text-destructive">{state.formErrors.description[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Upload Photo</Label>
              <div className="relative">
                <Input id="image" name="image" type="file" accept="image/*" required />
                <Button type="button" variant="ghost" size="icon" className="absolute bottom-1 right-1 h-8 w-8" onClick={() => document.getElementById('image')?.click()}>
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Use camera</span>
                </Button>
              </div>
              {state.formErrors?.image && (
                <p className="text-sm text-destructive">{state.formErrors.image[0]}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      <ResultCard data={state.data} error={state.error} pending={isPending} />
    </div>
  );
}
