
"use client";

import { useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitFeedback } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { LifeBuoy, Phone, FileUp, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

function SubmitButton() {
  const { pending } = useFormStatus();
  const { language } = useLanguage();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {language === 'kn' ? 'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Submitting...'}
        </>
      ) : (
        language === 'kn' ? 'ಸಲ್ಲಿಸಿ' : 'Submit'
      )}
    </Button>
  );
}

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 448 512" {...props}>
        <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.8 0-67.3-8.8-98.1-25.4l-7.1-4.2-73.3 19.3 19.3-72.1-4.7-7.5c-18.1-28.9-27.6-62.6-27.6-97.4 0-108.8 88.5-197.3 197.3-197.3 52.9 0 102.8 20.5 140.1 57.6 37.2 37.2 57.6 87.3 57.6 140S314.1 419.6 277.8 456.9c-35.8 27.2-79.6 41.7-123.9 41.7zm112.5-122.9c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
    </svg>
)

export default function SupportPage() {
    const { toast } = useToast();
    const { language } = useLanguage();
    const { user } = useAuth();

    const [state, formAction] = useActionState(submitFeedback, {
        success: false,
        error: null,
    });

    const formRef = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (state.error && !state.formErrors) {
            toast({
                variant: 'destructive',
                title: language === 'kn' ? 'ದೋಷ' : 'Error',
                description: state.error,
            });
        }
        if (state.success) {
            toast({
                title: language === 'kn' ? 'ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಲಾಗಿದೆ' : 'Feedback Submitted',
                description: language === 'kn' ? 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಗಾಗಿ ಧನ್ಯವಾದಗಳು.' : 'Thank you for your feedback.',
            });
            formRef.current?.reset();
        }
    }, [state, toast, language]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <LifeBuoy /> {language === 'kn' ? 'ಬೆಂಬಲ / ನಮಗೆ ಕರೆ ಮಾಡಿ' : 'Support / Call Us'}
                    </CardTitle>
                    <CardDescription>
                        {language === 'kn' ? 'ಸಹಾಯಕ್ಕಾಗಿ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ ಅಥವಾ ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಸಲ್ಲಿಸಿ.' : 'Contact us for help or submit your feedback.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <Button asChild className="w-full">
                            <a href="tel:+919999999999">
                                <Phone className="mr-2" /> {language === 'kn' ? 'ಸಹಾಯವಾಣಿಗೆ ಕರೆ ಮಾಡಿ' : 'Call Helpline'}
                            </a>
                        </Button>
                        <Button asChild variant="secondary" className="w-full bg-green-500 hover:bg-green-600 text-white">
                            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer">
                                <WhatsAppIcon className="mr-2 h-5 w-5" /> {language === 'kn' ? 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಚಾಟ್ ಮಾಡಿ' : 'Chat on WhatsApp'}
                            </a>
                        </Button>
                    </div>
                    <form ref={formRef} action={formAction} className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="name">{language === 'kn' ? 'ಹೆಸರು' : 'Name'}</Label>
                            <Input id="name" name="name" defaultValue={user?.displayName || ''} required />
                            {state.formErrors?.name && <p className="text-sm text-destructive">{state.formErrors.name[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">{language === 'kn' ? 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ' : 'Phone Number'}</Label>
                            <Input id="phone" name="phone" type="tel" defaultValue={user?.phoneNumber || ''} required />
                            {state.formErrors?.phone && <p className="text-sm text-destructive">{state.formErrors.phone[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">{language === 'kn' ? 'ಸಮಸ್ಯೆ/ಸಂದೇಶ' : 'Issue/Message'}</Label>
                            <Textarea id="message" name="message" rows={4} required />
                            {state.formErrors?.message && <p className="text-sm text-destructive">{state.formErrors.message[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="attachment">{language === 'kn' ? 'ಲಗತ್ತು (ಐಚ್ಛಿಕ)' : 'Attachment (Optional)'}</Label>
                            <Input id="attachment" name="attachment" type="file" ref={fileInputRef} accept="image/*,audio/*" />
                            <p className="text-xs text-muted-foreground">{language === 'kn' ? 'ಚಿತ್ರ ಅಥವಾ ಆಡಿಯೋ ಫೈಲ್ ಅನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.' : 'Upload an image or audio file.'}</p>
                        </div>
                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
