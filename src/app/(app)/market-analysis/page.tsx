
"use client";

import { useEffect, useRef, useActionState, useState } from "react";
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
import { AlertCircle, LineChart, Loader2, Mic, MicOff, Volume2, Target, TrendingUp, Users, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function SubmitButton() {
  const { pending: isPending } = useFormStatus();
  const { language } = useLanguage();
  return (
    <Button type="submit" className="w-full" disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {language === 'kn' ? 'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...' : 'Analyzing...'}
        </>
      ) : (
        language === 'kn' ? 'ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಣೆ ಪಡೆಯಿರಿ' : 'Get Market Analysis'
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
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const kannadaVoice = voices.find(voice => voice.lang.startsWith('kn'));
      if (kannadaVoice && language === 'kn') {
        utterance.voice = kannadaVoice;
      }
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
        <AlertTitle>{language === 'kn' ? 'ವಿಶ್ಲೇಷಣೆ ವಿಫಲವಾಗಿದೆ' : 'Analysis Failed'}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) return null;
  
  const fullText = `
    ${language === 'kn' ? 'ಪ್ರತಿ ಟನ್‌ಗೆ ಊಹಿಸಿದ ಮೌಲ್ಯ:' : 'Predictive Value Per Ton:'} ${data.predictiveValuePerTon}.
    ${language === 'kn' ? 'ಗರಿಷ್ಠ ಬಳಕೆ ಪ್ರದೇಶ:' : 'Maximum Consumption Area:'} ${data.maximumConsumption}.
    ${language === 'kn' ? 'ಅತ್ಯಂತ ಪರಿಣಾಮಕಾರಿ ಗ್ರಾಹಕ:' : 'Most Effective Consumer:'} ${data.effectiveConsumer}.
    ${language === 'kn' ? 'ಮಾರುಕಟ್ಟೆ ಅವಲೋಕನ:' : 'Market Overview:'} ${data.marketOverview}
  `;

  const formattedValue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(data.predictiveValuePerTon);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{language === 'kn' ? 'ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಣೆ' : 'Market Analysis'}</CardTitle>
            <CardDescription>
              {language === 'kn' ? 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯ ಆಧಾರದ ಮೇಲೆ ವಿವರವಾದ ಒಳನೋಟಗಳು.' : 'Detailed insights based on your query.'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => handleSpeak(fullText)}>
            <Volume2 className="h-5 w-5" />
            <span className="sr-only">Read aloud</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
         <div className="grid gap-4 md:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{language === 'kn' ? 'ಊಹಿಸಿದ ಮೌಲ್ಯ / ಟನ್' : 'Predictive Value / Ton'}</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formattedValue}</div>
                </CardContent>
             </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{language === 'kn' ? 'ಗರಿಷ್ಠ ಬಳಕೆ ಪ್ರದೇಶ' : 'Max Consumption Area'}</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-lg font-semibold">{data.maximumConsumption}</p>
                </CardContent>
             </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{language === 'kn' ? 'ಅತ್ಯಂತ ಪರಿಣಾಮಕಾರಿ ಗ್ರಾಹಕ' : 'Most Effective Consumer'}</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     <p className="text-lg font-semibold">{data.effectiveConsumer}</p>
                </CardContent>
             </Card>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-primary mb-2">{language === 'kn' ? 'ಮಾರುಕಟ್ಟೆ ಅವಲೋಕನ' : 'Market Overview'}</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{data.marketOverview}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MarketAnalysisPage() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [state, formAction] = useActionState(getAnalysis, {
    data: null,
    error: null,
  });
  const { pending: isPending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);
  const [cropDescription, setCropDescription] = useState('');

  const { isRecognizing, transcript, startRecognition, stopRecognition } = useSpeechRecognition({
    onTranscript: (text) => setCropDescription(text),
    onError: () => toast({ variant: "destructive", title: "Speech Recognition Error", description: "Please check your microphone permissions and try again." })
  });

  useEffect(() => {
    if (transcript) {
        setCropDescription(transcript);
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
        setCropDescription('');
    }
  }, [state, toast]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <LineChart /> {language === 'kn' ? 'ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಣೆ' : 'Market Analysis'}
            <Tooltip>
                <TooltipTrigger asChild>
                    <button>
                        <Info className="h-4 w-4 text-muted-foreground" />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{language === 'kn' ? 'ಬೆಳೆಗಳಿಗೆ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು ಮತ್ತು ಪ್ರವೃತ್ತಿಗಳನ್ನು ಪಡೆಯಿರಿ.' : 'Get market prices and trends for crops.'}</p>
                </TooltipContent>
            </Tooltip>
          </CardTitle>
          <CardDescription>
            {language === 'kn' ? 'AI-ಚಾಲಿತ ಮಾರುಕಟ್ಟೆ ಅವಲೋಕನವನ್ನು ಪಡೆಯಲು ಬೆಳೆ ಹೆಸರು ಮತ್ತು ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ.' : 'Enter a crop name and location to get an AI-powered market overview.'}
          </CardDescription>
        </CardHeader>
        <form ref={formRef} action={(formData) => {
            formData.append('language', language);
            formData.set('cropDescription', cropDescription);
            formAction(formData);
        }}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">{language === 'kn' ? 'ಸ್ಥಳ' : 'Location'}</Label>
              <Input
                id="location"
                name="location"
                placeholder={language === 'kn' ? "ಉದಾಹರಣೆಗೆ, 'ಕರ್ನಾಟಕ', 'ಮಹಾರಾಷ್ಟ್ರ'" : "e.g., 'Karnataka', 'Maharashtra'"}
                required
              />
              {state.formErrors?.location && (
                <p className="text-sm text-destructive">{state.formErrors.location[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cropDescription">{language === 'kn' ? 'ಬೆಳೆ ಹೆಸರು ಅಥವಾ ವಿವರಣೆ' : 'Crop Name or Description'}</Label>
               <div className="relative">
                <Textarea
                  id="cropDescription"
                  name="cropDescription"
                  value={cropDescription}
                  onChange={(e) => setCropDescription(e.target.value)}
                  placeholder={language === 'kn' ? "ಉದಾಹರಣೆಗೆ, 'ಬಾಸಮತಿ ಅಕ್ಕಿ', 'ಸಾವಯವ ಮಾವು'" : "e.g., 'Basmati Rice', 'Organic Mangoes'"}
                  rows={2}
                  required
                  className="pr-10"
                />
                <Button type="button" variant="ghost" size="icon" className="absolute bottom-2 right-1 h-7 w-7" onClick={handleMicClick}>
                   {isRecognizing ? <MicOff className="h-4 w-4 text-destructive" /> : <Mic className="h-4 w-4" />}
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
