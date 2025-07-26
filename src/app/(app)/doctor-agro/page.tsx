"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { getAdvice } from "./actions";
import Image from "next/image";
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
import { Camera, AlertCircle, Loader2, Mic, Volume2, MicOff, CheckCircle2, HeartPulse, List, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { Badge } from "@/components/ui/badge";

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
        language === 'kn' ? 'ಸಲಹೆ ಪಡೆಯಿರಿ' : 'Get Advice'
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
      // Attempt to find a Kannada voice
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

  let fullText = `${language === 'kn' ? 'ವಿಶ್ಲೇಷಣೆ:' : 'Analysis:'} ${data.analysis}.`;
  if (data.treatmentPlan) {
    fullText += ` ${language === 'kn' ? 'ಚಿಕಿತ್ಸಾ ಯೋಜನೆ:' : 'Treatment Plan:'} ${data.treatmentPlan}.`;
  }
  if (data.requiredProducts?.length) {
    fullText += ` ${language === 'kn' ? 'ಅಗತ್ಯವಿರುವ ಉತ್ಪನ್ನಗಳು:' : 'Required Products:'} ${data.requiredProducts.join(', ')}.`;
  }
  if (data.nearbyOutlets?.length) {
    fullText += ` ${language === 'kn' ? 'ಹತ್ತಿರದ ಮಳಿಗೆಗಳು:' : 'Nearby Outlets:'} ${data.nearbyOutlets.join(', ')}.`;
  }


  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{language === 'kn' ? 'ವಿಶ್ಲೇಷಣೆ ಫಲಿತಾಂಶ' : 'Analysis Result'}</CardTitle>
                <CardDescription>
                {language === 'kn' ? 'ಒದಗಿಸಿದ ಮಾಹಿತಿಯ ಆಧಾರದ ಮೇಲೆ.' : 'Based on the information provided.'}
                </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleSpeak(fullText)}>
                <Volume2 className="h-5 w-5" />
                <span className="sr-only">Read aloud</span>
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-primary">{language === 'kn' ? 'ಬೆಳೆ ಸ್ಥಿತಿ' : 'Crop Status'}</h3>
            <Badge variant={data.isHealthy ? 'default' : 'destructive'}>
                {data.isHealthy ? 
                    <><CheckCircle2 className="mr-1 h-4 w-4" /> {language === 'kn' ? 'ಆರೋಗ್ಯಕರ' : 'Healthy'}</> : 
                    <><HeartPulse className="mr-1 h-4 w-4" /> {language === 'kn' ? 'ಆರೋಗ್ಯಕರವಲ್ಲ' : 'Unhealthy'}</>
                }
            </Badge>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-primary">{language === 'kn' ? 'ವಿಶ್ಲೇಷಣೆ' : 'Analysis'}</h3>
          <p className="text-muted-foreground">{data.analysis}</p>
        </div>

        {!data.isHealthy && (
            <>
                {data.treatmentPlan && (
                    <div>
                        <h3 className="font-semibold text-lg text-primary">{language === 'kn' ? 'ಚಿಕಿತ್ಸಾ ಯೋಜನೆ' : 'Treatment Plan'}</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{data.treatmentPlan}</p>
                    </div>
                )}
                {data.requiredProducts?.length > 0 && (
                     <div>
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><List /> {language === 'kn' ? 'ಅಗತ್ಯವಿರುವ ಉತ್ಪನ್ನಗಳು' : 'Required Products'}</h3>
                        <ul className="list-disc list-inside text-muted-foreground">
                            {data.requiredProducts.map((product: string, index: number) => <li key={index}>{product}</li>)}
                        </ul>
                    </div>
                )}
                 {data.nearbyOutlets?.length > 0 && (
                     <div>
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Store /> {language === 'kn' ? 'ಹತ್ತಿರದ ಮಳಿಗೆಗಳು' : 'Nearby Outlets'}</h3>
                        <ul className="list-disc list-inside text-muted-foreground">
                            {data.nearbyOutlets.map((outlet: string, index: number) => <li key={index}>{outlet}</li>)}
                        </ul>
                    </div>
                )}
            </>
        )}

      </CardContent>
    </Card>
  );
}

export default function DoctorAgroPage() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [state, formAction] = useActionState(getAdvice, {
    data: null,
    error: null,
  });
  const { pending: isPending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  const { isRecognizing, transcript, startRecognition, stopRecognition } = useSpeechRecognition({
    onTranscript: (text) => setDescription(text),
    onError: () => toast({ variant: "destructive", title: "Speech Recognition Error", description: "Please check your microphone permissions and try again." })
  });
  
  useEffect(() => {
    if (transcript) {
        setDescription(transcript);
    }
  }, [transcript]);

  const handleMicClick = () => {
    if (isRecognizing) {
        stopRecognition();
    } else {
        startRecognition();
    }
  }


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };


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
        setImagePreview(null);
        setDescription('');
    }
  }, [state, toast]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{language === 'kn' ? 'ಬೆಳೆ ಆರೋಗ್ಯ ಸಲಹೆಗಾರ' : 'Crop Health Advisor'}</CardTitle>
          <CardDescription>
            {language === 'kn' ? 'AI-ಚಾಲಿತ ರೋಗನಿರ್ಣಯಕ್ಕಾಗಿ ನಿಮ್ಮ ಬೆಳವಣಿಗೆಯ ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ ಮತ್ತು ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.' : 'Describe your crop\'s issue and upload a photo for an AI-powered diagnosis.'}
          </CardDescription>
        </CardHeader>
        <form ref={formRef} action={(formData) => {
            formData.append('language', language);
            formData.set('description', description);
            formAction(formData);
        }}>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">{language === 'kn' ? 'ಸ್ಥಳ' : 'Location'}</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder={language === 'kn' ? "ಉದಾಹರಣೆಗೆ, 'ಬೆಂಗಳೂರು'" : "e.g., 'Bangalore'"}
                    required
                  />
                  {state.formErrors?.location && (
                    <p className="text-sm text-destructive">{state.formErrors.location[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">{language === 'kn' ? 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ' : 'Upload Photo'}</Label>
                  <div className="relative">
                    <Input id="image" name="image" type="file" accept="image/*" required onChange={handleImageChange} className="pr-10"/>
                    <Button type="button" variant="ghost" size="icon" className="absolute bottom-1 right-1 h-8 w-8" onClick={() => document.getElementById('image')?.click()}>
                      <Camera className="h-4 w-4" />
                      <span className="sr-only">Use camera</span>
                    </Button>
                  </div>
                  {state.formErrors?.image && (
                    <p className="text-sm text-destructive">{state.formErrors.image[0]}</p>
                  )}
                </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="description">{language === 'kn' ? 'ರೋಗಲಕ್ಷಣಗಳ ವಿವರಣೆ' : 'Symptom Description'}</Label>
              <div className="relative">
                <Textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={language === 'kn' ? "ಉದಾಹರಣೆಗೆ, 'ನನ್ನ ಟೊಮೆಟೊ ಗಿಡಗಳ ಎಲೆಗಳ ಮೇಲೆ ಹಳದಿ ಚುಕ್ಕೆಗಳಿವೆ ಮತ್ತು ಹಣ್ಣು ಕೊಳೆಯುತ್ತಿದೆ.'" : "e.g., 'My tomato plants have yellow spots on the leaves and the fruit is rotting.'"}
                  rows={4}
                  required
                  className="pr-10"
                />
                <Button type="button" variant="ghost" size="icon" className="absolute bottom-2 right-1 h-7 w-7" onClick={handleMicClick}>
                   {isRecognizing ? <MicOff className="h-4 w-4 text-destructive" /> : <Mic className="h-4 w-4" />}
                  <span className="sr-only">Use voice input</span>
                </Button>
              </div>
              {state.formErrors?.description && (
                <p className="text-sm text-destructive">{state.formErrors.description[0]}</p>
              )}
            </div>

            {imagePreview && (
            <div className="mt-4 relative aspect-video w-full max-w-sm mx-auto">
                <Image
                    src={imagePreview}
                    alt="Uploaded crop"
                    fill
                    className="rounded-md object-cover"
                />
            </div>
            )}
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
