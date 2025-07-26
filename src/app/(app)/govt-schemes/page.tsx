"use client";

import { useEffect, useRef, useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
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
import { Input } from "@/components/ui/input";
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
import { AlertCircle, Loader2, Mic, MicOff, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";


function SubmitButton() {
  const { pending: isPending } = useFormStatus();
  const { language } = useLanguage();
  return (
    <Button type="submit" className="w-full" disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {language === 'kn' ? 'ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...' : 'Finding Schemes...'}
        </>
      ) : (
        language === 'kn' ? 'ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ' : 'Find Schemes'
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
  const { language } = useLanguage();
  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const kannadaVoice = voices.find(voice => voice.lang.startsWith('kn'));
      if (kannadaVoice && language === 'kn') {
        utterance.voice = kannadaVoice;
      }
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  if (isPending) {
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
        <AlertTitle>{language === 'kn' ? 'ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲು ವಿಫಲವಾಗಿದೆ' : 'Failed to find schemes'}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data || data.schemes.length === 0) return null;

  const fullText = data.schemes
    .map(
      (scheme: any) =>
        `${language === 'kn' ? 'ಯೋಜನೆ:' : 'Scheme:'} ${scheme.name}. ${language === 'kn' ? 'ವಿವರಣೆ:' : 'Description:'} ${scheme.description}. ${language === 'kn' ? 'ಅರ್ಹತೆ:' : 'Eligibility:'} ${scheme.eligibilityCriteria}. ${language === 'kn' ? 'ಪ್ರಯೋಜನಗಳು:' : 'Benefits:'} ${scheme.benefits}. ${language === 'kn' ? 'ಅನ್ವಯಿಸುವುದು ಹೇಗೆ:' : 'How to apply:'} ${scheme.howToApply}.`
    )
    .join(" ");

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{language === 'kn' ? 'ಸಂಬಂಧಿತ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು' : 'Relevant Government Schemes'}</CardTitle>
            <CardDescription>
              {language === 'kn' ? 'ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಯ ಆಧಾರದ ಮೇಲೆ, ನೀವು ಈ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹರಾಗಿರಬಹುದು.' : 'Based on your situation, you may be eligible for these schemes.'}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleSpeak(fullText)}
          >
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
                  <h4 className="font-semibold text-accent-foreground">
                    {language === 'kn' ? 'ಅರ್ಹತಾ ಮಾನದಂಡ' : 'Eligibility Criteria'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {scheme.eligibilityCriteria}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent-foreground">
                    {language === 'kn' ? 'ಪ್ರಯೋಜನಗಳು' : 'Benefits'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {scheme.benefits}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-accent-foreground">
                    {language === 'kn' ? 'ಅನ್ವಯಿಸುವುದು ಹೇಗೆ' : 'How to Apply'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {scheme.howToApply}
                  </p>
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
  const { language } = useLanguage();
  const [state, formAction] = useActionState(getSchemes, {
    data: null,
    error: null,
  });
  const { pending: isPending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);

  const [subsidiesFor, setSubsidiesFor] = useState('');

  const { isRecognizing, transcript, startRecognition, stopRecognition } = useSpeechRecognition({
    onTranscript: (text) => setSubsidiesFor(text),
    onError: () => toast({ variant: "destructive", title: "Speech Recognition Error", description: "Please check your microphone permissions and try again." })
  });
  
  useEffect(() => {
    if (transcript) {
        setSubsidiesFor(transcript);
    }
  }, [transcript]);

  const handleMicClick = () => {
    if (isRecognizing) {
        stopRecognition();
    } else {
        startRecognition();
    }
  }


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
      setSubsidiesFor('');
    }
  }, [state, toast]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            {language === 'kn' ? 'ಸರ್ಕಾರಿ ಯೋಜನೆ ಹುಡುಕಾಟ' : 'Government Scheme Finder'}
          </CardTitle>
          <CardDescription>
            {language === 'kn' ? 'ಸಂಬಂಧಿತ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.' : 'Enter your details to find relevant government schemes.'}
          </CardDescription>
        </CardHeader>
        <form ref={formRef} action={(formData) => {
            formData.append('language', language);
            formData.set('subsidiesFor', subsidiesFor);
            formAction(formData);
        }}>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">{language === 'kn' ? 'ಸ್ಥಳ' : 'Location'}</Label>
              <Input
                id="location"
                name="location"
                placeholder={language === 'kn' ? "ಉದಾಹರಣೆಗೆ, 'ಕರ್ನಾಟಕ'" : "e.g., 'Karnataka'"}
                required
              />
              {state.formErrors?.location && (
                <p className="text-sm text-destructive">
                  {state.formErrors.location[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="landParcel">{language === 'kn' ? 'ಭೂಮಿ (ಎಕರೆಗಳಲ್ಲಿ)' : 'Land Parcel (in acres)'}</Label>
              <Input
                id="landParcel"
                name="landParcel"
                type="number"
                placeholder={language === 'kn' ? "ಉದಾಹರಣೆಗೆ, '2'" : "e.g., '2'"}
                required
                step="0.1"
              />
              {state.formErrors?.landParcel && (
                <p className="text-sm text-destructive">
                  {state.formErrors.landParcel[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cropName">{language === 'kn' ? 'ಬೆಳೆ ಹೆಸರು' : 'Crop Name'}</Label>
              <Input
                id="cropName"
                name="cropName"
                placeholder={language === 'kn' ? "ಉದಾಹರಣೆಗೆ, 'ರಾಗಿ'" : "e.g., 'Ragi'"}
                required
              />
              {state.formErrors?.cropName && (
                <p className="text-sm text-destructive">
                  {state.formErrors.cropName[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="subsidiesFor">{language === 'kn' ? 'ಸಬ್ಸಿಡಿಗಳು' : 'Subsidies for'}</Label>
              <div className="relative">
                <Textarea
                  id="subsidiesFor"
                  name="subsidiesFor"
                  value={subsidiesFor}
                  onChange={(e) => setSubsidiesFor(e.target.value)}
                  placeholder={language === 'kn' ? "ಉದಾಹರಣೆಗೆ, 'ನೀರಾವರಿ ಉಪಕರಣಗಳು, ಬೀಜಗಳು ಮತ್ತು ರಸಗೊಬ್ಬರಗಳು'" : "e.g., 'Irrigation equipment, seeds, and fertilizers'"}
                  rows={1}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-1 right-1 h-7 w-7"
                  onClick={handleMicClick}
                >
                  {isRecognizing ? <MicOff className="h-4 w-4 text-destructive" /> : <Mic className="h-4 w-4" />}
                  <span className="sr-only">Use voice input</span>
                </Button>
              </div>
              {state.formErrors?.subsidiesFor && (
                <p className="text-sm text-destructive">
                  {state.formErrors.subsidiesFor[0]}
                </p>
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
