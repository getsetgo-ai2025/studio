"use client";

import { useEffect, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { getAnalysis } from "./actions";
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
import { AlertCircle, Loader2, Mic, Volume2 } from "lucide-react";
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
        "Get Market Analysis"
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>
              Current market analysis and pricing insights.
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => handleSpeak(data.marketOverview)}>
            <Volume2 className="h-5 w-5" />
            <span className="sr-only">Read aloud</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-pre-wrap">{data.marketOverview}</p>
      </CardContent>
    </Card>
  );
}

export default function MarketAnalysisPage() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(getAnalysis, {
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
          <CardTitle className="font-headline">Market Analysis</CardTitle>
          <CardDescription>
            Enter a crop name and location to get an AI-powered market overview.
          </CardDescription>
        </CardHeader>
        <form ref={formRef} action={formAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., 'Karnataka', 'Maharashtra'"
                required
              />
              {state.formErrors?.location && (
                <p className="text-sm text-destructive">{state.formErrors.location[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cropDescription">Crop Name or Description</Label>
               <div className="relative">
                <Textarea
                  id="cropDescription"
                  name="cropDescription"
                  placeholder="e.g., 'Basmati Rice', 'Organic Mangoes'"
                  rows={2}
                  required
                  className="pr-10"
                />
                <Button type="button" variant="ghost" size="icon" className="absolute bottom-2 right-1 h-7 w-7">
                  <Mic className="h-4 w-4" />
                  <span className="sr-only">Use voice input</span>
                </Button>
              </div>
              {state.formErrors?.cropDescription && (
                <p className="text-sm text-destructive">{state.formErrors.cropDescription[0]}</p>
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
