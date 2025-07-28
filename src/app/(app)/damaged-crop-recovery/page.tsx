
'use client';

import { useEffect, useRef, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { getAdvice } from './actions';
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
import { AlertCircle, Info, Loader2, Phone, ShoppingCart, Recycle, ThumbsUp, Users, ShieldAlert, BadgePercent, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type DamagedCropOutput } from '@/ai/flows/damaged-crop-recovery';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

const damageTypes = [
    { id: 'Heavy Rain', label: { en: 'Heavy Rain', kn: 'ಭಾರೀ ಮಳೆ' } },
    { id: 'Drought', label: { en: 'Drought', kn: 'ಬರ' } },
    { id: 'Pest Attack', label: { en: 'Pest Attack', kn: 'ಕೀಟಗಳ ದಾಳಿ' } },
    { id: 'Disease', label: { en: 'Disease', kn: 'ರೋಗ' } },
    { id: 'Hailstorm', label: { en: 'Hailstorm', kn: 'ಆಲಿಕಲ್ಲು ಮಳೆ' } },
    { id: 'Other', label: { en: 'Other', kn: 'ಇತರೆ' } },
] as const;

function SubmitButton() {
  const { pending: isPending } = useFormStatus();
  const { language } = useLanguage();
  return (
    <Button type="submit" className="w-full" disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {language === 'kn' ? 'ಸಲಹೆ ಪಡೆಯಲಾಗುತ್ತಿದೆ...' : 'Getting Advice...'}
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
  data: DamagedCropOutput | null;
  error: string | null;
  pending: boolean;
}) {
    const { language } = useLanguage();
    const { toast } = useToast();

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
            <AlertTitle>{language === 'kn' ? 'ಸಲಹೆ ಪಡೆಯಲು ವಿಫಲವಾಗಿದೆ' : 'Failed to get advice'}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
        );
    }

    if (!data) return null;

    const recoveryColor = data.recoveryProbability > 60 ? 'text-green-600' : data.recoveryProbability > 30 ? 'text-yellow-600' : 'text-red-600';
    const RecoveryIcon = data.recoveryProbability > 40 ? TrendingUp : TrendingDown;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{language === 'kn' ? 'ಚೇತರಿಕೆ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಸಲಹೆಗಳು' : 'Recovery & Market Advice'}</CardTitle>
                <CardDescription>
                {language === 'kn' ? 'ನಿಮ್ಮ ಹಾನಿಗೊಳಗಾದ ಬೆಳೆಗೆ ಶಿಫಾರಸು ಮಾಡಲಾದ ಕ್ರಮಗಳು ಇಲ್ಲಿವೆ.' : 'Here are the recommended actions for your damaged crop.'}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="space-y-4">
                     <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><BadgePercent /> {language === 'kn' ? 'ಬೆಳೆ ಉಳಿಸುವ ಸಂಭವನೀಯತೆ' : 'Crop Salvage Probability'}</h3>
                     <div className='flex items-center gap-4'>
                        <RecoveryIcon className={`h-8 w-8 ${recoveryColor}`} />
                        <span className={`text-4xl font-bold ${recoveryColor}`}>{data.recoveryProbability}%</span>
                     </div>
                     <Progress value={data.recoveryProbability} className="h-3" />
                 </div>

                 {data.recommendation && (
                    <Alert variant={data.recoveryProbability < 40 ? "destructive" : "default"}>
                        <ShieldAlert className="h-4 w-4" />
                        <AlertTitle>{language === 'kn' ? 'ಶಿಫಾರಸು' : 'Recommendation'}</AlertTitle>
                        <AlertDescription>{data.recommendation}</AlertDescription>
                    </Alert>
                 )}


                 {data.salvagingMethods?.length > 0 && (
                     <div>
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-2 mb-2"><ThumbsUp /> {language === 'kn' ? 'ಪಾರುಗಾಣಿಕಾ ವಿಧಾನಗಳು' : 'Salvaging Methods'}</h3>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {data.salvagingMethods.map((method, index) => <li key={index}>{method}</li>)}
                        </ul>
                    </div>
                )}
                 {data.alternativeBuyers?.length > 0 && (
                     <div>
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-2 mb-2"><Users /> {language === 'kn' ? 'ಪರ್ಯಾಯ ಖರೀದಿದಾರರು' : 'Alternative Buyers'}</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            {data.alternativeBuyers.map((buyer, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle className="text-xl">{buyer.name}</CardTitle>
                                        <CardDescription>{buyer.buyerType}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{language === 'kn' ? 'ಸಂಪರ್ಕಿಸಿ:' : 'Contact:'} {buyer.contact}</p>
                                    </CardContent>
                                    <CardFooter className="gap-2">
                                        <Button asChild className='flex-1'>
                                            <a href={`tel:${buyer.contact}`}><Phone className="mr-2" />{language === 'kn' ? 'ಕರೆ ಮಾಡಿ' : 'Call Buyer'}</a>
                                        </Button>
                                        <Button variant="secondary" className='flex-1' onClick={() => toast({ title: language === 'kn' ? 'ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ!' : 'Coming Soon!', description: language === 'kn' ? 'ಈ ವೈಶಿಷ್ಟ್ಯವನ್ನು ಶೀಘ್ರದಲ್ಲೇ ಜಾರಿಗೆ ತರಲಾಗುವುದು.' : 'This feature will be implemented soon.'})}>
                                            <ShoppingCart className="mr-2" />{language === 'kn' ? 'ಜಾಹೀರಾತು ಪೋಸ್ಟ್ ಮಾಡಿ' : 'Post Ad'}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

            </CardContent>
        </Card>
    );
}


export default function DamagedCropRecoveryPage() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [state, formAction] = useActionState(getAdvice, {
    data: null,
    error: null,
  });
  const { pending: isPending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error && !state.formErrors) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
    if (state.data) {
      // Don't reset form on success to allow viewing results
    }
  }, [state, toast]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Recycle /> {language === 'kn' ? 'ಹಾನಿಗೊಳಗಾದ ಬೆಳೆ ಚೇತರಿಕೆ' : 'Damaged Crop Recovery'}
             <Tooltip>
                <TooltipTrigger asChild>
                    <button>
                        <Info className="h-4 w-4 text-muted-foreground" />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{language === 'kn' ? 'ಹಾನಿಗೊಳಗಾದ ಬೆಳೆಯನ್ನು ಪಾರುಗಾಣಿಕಾ ಮಾಡಲು ಮತ್ತು ಪರ್ಯಾಯ ಮಾರುಕಟ್ಟೆಗಳನ್ನು ಹುಡುಕಲು ಸಹಾಯ.' : 'Get help salvaging damaged crops and finding alternative markets.'}</p>
                </TooltipContent>
            </Tooltip>
          </CardTitle>
          <CardDescription>
            {language === 'kn' ? 'ನಿಮ್ಮ ಹಾನಿಗೊಳಗಾದ ಬೆಳೆಗೆ ಪಾರುಗಾಣಿಕಾ ವಿಧಾನಗಳು ಮತ್ತು ಪರ್ಯಾಯ ಮಾರುಕಟ್ಟೆಗಳನ್ನು ಹುಡುಕಲು ಈ ಫಾರ್ಮ್ ಅನ್ನು ಭರ್ತಿ ಮಾಡಿ.' : 'Fill this form to find salvaging methods and alternative markets for your damaged crop.'}
          </CardDescription>
        </CardHeader>
        <form ref={formRef} action={formData => {
            formData.append('language', language);
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
                <Label htmlFor="location">{language === 'kn' ? 'ಸ್ಥಳ' : 'Location'}</Label>
                <Input id="location" name="location" placeholder={language === 'kn' ? 'ಉದಾ., ಬೆಂಗಳೂರು' : 'e.g., Bangalore'} required />
                 {state.formErrors?.location && (
                  <p className="text-sm text-destructive">{state.formErrors.location[0]}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{language === 'kn' ? 'ಬೆಳೆಯ ಹಂತ' : 'Stage of Crop'}</Label>
              <RadioGroup name="cropStage" required className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Seedling" id="seedling" />
                  <Label htmlFor="seedling">{language === 'kn' ? 'ಸಸಿ' : 'Seedling'}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Vegetative" id="vegetative" />
                  <Label htmlFor="vegetative">{language === 'kn' ? 'ಸಸ್ಯಕ' : 'Vegetative'}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Flowering" id="flowering" />
                  <Label htmlFor="flowering">{language === 'kn' ? 'ಹೂಬಿಡುವಿಕೆ' : 'Flowering'}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Harvest" id="harvest" />
                  <Label htmlFor="harvest">{language === 'kn' ? 'ಕೊಯ್ಲು' : 'Harvest'}</Label>
                </div>
              </RadioGroup>
              {state.formErrors?.cropStage && (
                <p className="text-sm text-destructive">{state.formErrors.cropStage[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{language === 'kn' ? 'ಹಾನಿಯ ವಿಧ' : 'Type of Damage'}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {damageTypes.map((type) => (
                    <div className="flex items-center space-x-2" key={type.id}>
                        <Checkbox id={type.id} name="damageType" value={type.id} />
                        <Label htmlFor={type.id} className="font-normal">{type.label[language]}</Label>
                    </div>
                ))}
              </div>
               {state.formErrors?.damageType && (
                <p className="text-sm text-destructive">{state.formErrors.damageType[0]}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="damageExtent">{language === 'kn' ? 'ಹಾನಿಯ ಪ್ರಮಾಣ' : 'Extent of Damage'}</Label>
                <Select name="damageExtent" required>
                    <SelectTrigger id="damageExtent">
                        <SelectValue placeholder={language === 'kn' ? 'ಒಂದು ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ' : 'Select an option'} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="<25%">&lt;25%</SelectItem>
                        <SelectItem value="25-50%">25-50%</SelectItem>
                        <SelectItem value="50-75%">50-75%</SelectItem>
                        <SelectItem value=">75%">&gt;75%</SelectItem>
                    </SelectContent>
                </Select>
                {state.formErrors?.damageExtent && (
                    <p className="text-sm text-destructive">{state.formErrors.damageExtent[0]}</p>
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
