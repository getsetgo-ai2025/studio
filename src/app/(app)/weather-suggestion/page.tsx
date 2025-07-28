
'use client';

import { useEffect, useRef, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { getSuggestions } from './actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Info, Loader2, CloudSun, MapPin, Sparkles, CalendarDays, Wind, Droplets, Thermometer, Forward, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { type WeatherSuggestionOutput } from '@/ai/flows/weather-suggestion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { type DailyForecastSchema as DailyForecastType } from '@/ai/schemas/weather-forecast';
import { type z } from 'zod';

function SubmitButton() {
  const { pending: isPending } = useFormStatus();
  const { language } = useLanguage();
  return (
    <Button type="submit" className="w-full" disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {language === 'kn' ? 'ಸಲಹೆಗಳನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...' : 'Getting Suggestions...'}
        </>
      ) : (
        language === 'kn' ? 'ಸಲಹೆಗಳನ್ನು ಪಡೆಯಿರಿ' : 'Get Suggestions'
      )}
    </Button>
  );
}

const ForecastDetails = ({ forecast, lang }: { forecast: z.infer<typeof DailyForecastType>, lang: 'en' | 'kn' }) => (
    <div className='mb-4 space-y-2 text-sm text-muted-foreground'>
        <div className="font-semibold">{forecast.condition}</div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
            <div className="flex items-center gap-1">
                <Thermometer className='h-4 w-4' /> {lang === 'kn' ? 'ತಾಪಮಾನ' : 'Temp'}: {forecast.temp_min_c}°C - {forecast.temp_max_c}°C
            </div>
             <div className="flex items-center gap-1">
                <Droplets className='h-4 w-4' /> {lang === 'kn' ? 'ಮಳೆ' : 'Rain'}: {forecast.rainfall_mm}mm
            </div>
            <div className="flex items-center gap-1">
                <Sparkles className='h-4 w-4' /> {lang === 'kn' ? 'ಆರ್ದ್ರತೆ' : 'Humidity'}: {forecast.humidity_percent}%
            </div>
            <div className="flex items-center gap-1">
                <Wind className='h-4 w-4' /> {lang === 'kn' ? 'ಗಾಳಿ' : 'Wind'}: {forecast.wind_kph}kph
            </div>
        </div>
    </div>
)

function ResultCard({
  data,
  error,
  pending: isPending,
}: {
  data: WeatherSuggestionOutput | null;
  error: string | null;
  pending: boolean;
}) {
    const { language } = useLanguage();

    if (isPending) {
        return (
        <Card>
            <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-20 w-full" />
            </CardContent>
        </Card>
        );
    }

    if (error) {
        return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{language === 'kn' ? 'ಸಲಹೆಗಳನ್ನು ಪಡೆಯಲು ವಿಫಲವಾಗಿದೆ' : 'Failed to get suggestions'}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
        );
    }

    if (!data) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{language === 'kn' ? 'ಹವಾಮಾನ ಆಧಾರಿತ ಸಲಹೆ' : 'Weather-Based Advice'}</CardTitle>
                <CardDescription>
                {language === 'kn' ? 'ನಿಮ್ಮ ಬೆಳೆ ಮತ್ತು ಸ್ಥಳೀಯ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಯ ಆಧಾರದ ಮೇಲೆ ಶಿಫಾರಸುಗಳು.' : 'Recommendations based on your crop and local weather forecast.'}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className='text-xl flex items-center gap-2'>
                           <Sparkles className='h-5 w-5 text-primary' /> {language === 'kn' ? 'ಇಂದು' : 'Today'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ForecastDetails forecast={data.today.forecast} lang={language} />
                        <p className="text-foreground">{data.today.suggestion}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className='text-xl flex items-center gap-2'>
                           <Forward className='h-5 w-5 text-primary' /> {language === 'kn' ? 'ನಾಳೆ' : 'Tomorrow'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ForecastDetails forecast={data.tomorrow.forecast} lang={language} />
                        <p className="text-foreground">{data.tomorrow.suggestion}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className='text-xl flex items-center gap-2'>
                           <CalendarDays className='h-5 w-5 text-primary' /> {language === 'kn' ? 'ಮುಂದಿನ 7 ದಿನಗಳು' : 'Next 7 Days'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                             <h4 className="font-semibold">{language === 'kn' ? 'ಹವಾಮಾನ ಸಾರಾಂಶ' : 'Weather Summary'}</h4>
                             <p className="text-muted-foreground">{data.next7Days.forecastSummary}</p>
                        </div>
                         <div className="space-y-2 mt-4">
                             <h4 className="font-semibold">{language === 'kn' ? 'ಸಲಹೆ ಸಾರಾಂಶ' : 'Suggestion Summary'}</h4>
                            <p className="text-muted-foreground">{data.next7Days.suggestion}</p>
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}


export default function WeatherSuggestionPage() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [location, setLocation] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [state, formAction] = useActionState(getSuggestions, {
    data: null,
    error: null,
  });
  const { pending: isPending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
                setLocationError(null);
            },
            (error) => {
                console.error("Geolocation error:", error);
                setLocationError("Could not get your location. Please enable location services in your browser and refresh the page.");
                toast({
                    variant: 'destructive',
                    title: "Location Error",
                    description: "Could not get your location. Please enable location services and refresh.",
                })
            }
        );
    } else {
        setLocationError("Geolocation is not supported by this browser.");
    }
  }, [toast]);


  useEffect(() => {
    if (state.error && !state.formErrors) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
    if (state.data) {
        // Don't reset form on success
    }
  }, [state, toast]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <CloudSun /> {language === 'kn' ? 'ಹವಾಮಾನ ಆಧಾರಿತ ಸಲಹೆಗಳು' : 'Weather-Based Suggestions'}
             <Tooltip>
                <TooltipTrigger asChild>
                    <button>
                        <Info className="h-4 w-4 text-muted-foreground" />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{language === 'kn' ? 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಆಧಾರದ ಮೇಲೆ ದೈನಂದಿನ ಬೆಳೆ ಸಲಹೆಗಳನ್ನು ಪಡೆಯಿರಿ.' : 'Get daily crop advice based on the weather forecast.'}</p>
                </TooltipContent>
            </Tooltip>
          </CardTitle>
          <CardDescription>
            {language === 'kn' ? 'ನಿಮ್ಮ ಬೆಳೆ ಮತ್ತು ಸ್ಥಳೀಯ ಹವಾಮಾನಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಸಲಹೆಗಳನ್ನು ಪಡೆಯಲು ಕೆಳಗಿನ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.' : 'Enter the details below to get suggestions tailored to your crop and local weather.'}
          </CardDescription>
        </CardHeader>
        <form ref={formRef} action={formData => {
            formData.append('language', language);
            if (location) {
                formData.append('location', location);
            }
            formAction(formData);
        }}>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cropName">{language === 'kn' ? 'ಬೆಳೆ ಹೆಸರು' : 'Crop Name'}</Label>
                <Input id="cropName" name="cropName" placeholder={language === 'kn' ? 'ಉದಾ., ಟೊಮೇಟೊ' : 'e.g., Tomato'} required />
                {state.formErrors?.cropName && (
                  <p className="text-sm text-destructive">{state.formErrors.cropName[0]}</p>
                )}
              </div>
               <div className="space-y-2">
                <Label htmlFor="location">{language === 'kn' ? 'ನಿಮ್ಮ ಸ್ಥಳ' : 'Your Location'}</Label>
                 <div className='flex items-center gap-2 h-10 px-3 py-2 text-sm rounded-md border border-input bg-muted'>
                    {location ? <> <MapPin className='h-4 w-4 text-primary' /> <span>{location}</span> </> : <>{locationError ? <span className='text-destructive text-xs'>{locationError}</span> : <span>Fetching location...</span>}</>}
                 </div>
                 <Input type="hidden" name="location" value={location || ""} />
                 {state.formErrors?.location && (
                  <p className="text-sm text-destructive">{state.formErrors.location[0]}</p>
                )}
              </div>
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
