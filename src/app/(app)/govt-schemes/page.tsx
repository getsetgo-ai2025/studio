"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { getSchemes } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertCircle, Loader2, Mic, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Finding Schemes...
        </>
      ) : (
        "Find Schemes"
      )}
    </Button>
  );
}

function ResultCard({
  data,
  error,
  pending,
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


  if (pending) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Failed to find schemes</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data || data.schemes.length === 0) return null;

  const fullText = data.schemes.map((scheme:any) => 
    `Scheme: ${scheme.name}. Description: ${scheme.description}. Eligibility: ${scheme.eligibilityCriteria}. Benefits: ${scheme.benefits}. How to apply: ${scheme.howToApply}.`
  ).join(' ');


  return (
    <Card>
      <CardHeader>
         <div className="flex justify-between items-start">
          <div>
            <CardTitle>Relevant Government Schemes</CardTitle>
            <CardDescription>
              Based on your situation, you may be eligible for these schemes.
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => handleSpeak(fullText)}>
            <Volume2 className="h-5 w-5" />
            <span className="sr-only">Read all schemes aloud</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {data.schemes.map((scheme: any, index: number) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-left font-bold text-primary hover:no-underline">
                {scheme.name}
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="text-muted-foreground">{scheme.description}</p>
                <div className="space-y-2">
                    <h4 className="font-semibold text-accent">Eligibility Criteria</h4>
                    <p className="text-sm text-muted-foreground">{scheme.eligibilityCriteria}</p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold text-accent">Benefits</h4>
                    <p className="text-sm text-muted-foreground">{scheme.benefits}</p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold text-accent">How to Apply</h4>
                    <p className="text-sm text-muted-foreground">{scheme.howToApply}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

export default function GovtSchemesPage() {
  const { toast } = useToast();
  const [state, formAction] = useFormState(getSchemes, {
    data: null,
    error: null,
  });
  const { pending } = useFormStatus();
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
          <CardTitle className="font-headline">Government Scheme Finder</CardTitle>
          <CardDescription>
            Describe your situation and the crops you grow to find relevant government schemes.
          </CardDescription>
        </CardHeader>
        <form ref={formRef} action={formAction}>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="situation">Your Situation</Label>
               <div className="relative">
                <Textarea
                  id="situation"
                  name="situation"
                  placeholder="e.g., 'I am a small farmer in Karnataka with 2 acres of land, growing ragi and groundnuts. I need help with irrigation.'"
                  rows={4}
                  required
                  className="pr-10"
                />
                <Button type="button" variant="ghost" size="icon" className="absolute bottom-2 right-1 h-7 w-7">
                  <Mic className="h-4 w-4" />
                  <span className="sr-only">Use voice input</span>
                </Button>
              </div>
              {state.formErrors?.situation && (
                <p className="text-sm text-destructive">{state.formErrors.situation[0]}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      <ResultCard data={state.data} error={state.error} pending={pending} />
    </div>
  );
}
