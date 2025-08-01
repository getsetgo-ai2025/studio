

"use client";

import Image, { type StaticImageData } from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Newspaper, Home as HomeIcon, Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { getRecentNews, type NewsArticle } from "@/ai/flows/news-generator";
import { useEffect, useState } from "react";
import farmerWithTablet from "@/app/images/smart-farming.png";
import droneFarmer from "@/app/images/farmer-with-drone.png";
import lushGreenCrops from "@/app/images/lush-green-crops.jpeg";
import automatedIrrigationSystem from "@/app/images/auto-irrigation.jpeg";

const slideshowImages: { src: string | StaticImageData; alt: { en: string; kn: string; }; hint: string; }[] = [
    { src: farmerWithTablet, alt: { en: "Farmer with a tablet", kn: "ಟ್ಯಾಬ್ಲೆಟ್ ಹಿಡಿದ ರೈತ" }, hint: "farmer tablet" },
    { src: droneFarmer, alt: { en: "Farmer with a drone", kn: "ಡ್ರೋನ್ ಹೊಂದಿರುವ ರೈತ" }, hint: "farmer drone" },
    { src: lushGreenCrops, alt: { en: "Lush green crops in a field", kn: "ಹೊಲದಲ್ಲಿ ಸೊಂಪಾದ ಹಸಿರು ಬೆಳೆಗಳು" }, hint: "green crops" },
    { src: automatedIrrigationSystem, alt: { en: "Automated irrigation system", kn: "ಸ್ವಯಂಚಾಲಿತ ನೀರಾವರಿ ವ್ಯವಸ್ಥೆ" }, hint: "irrigation system" },
];

function NewsSection() {
    const { language } = useLanguage();
    const [newsItems, setNewsItems] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchNews() {
            try {
                setLoading(true);
                setError(null);
                const newsData = await getRecentNews(language);
                setNewsItems(newsData.articles);
            } catch (err) {
                console.error("Failed to fetch news:", err);
                setError(language === 'kn' ? 'ಸುದ್ದಿ ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ.' : 'Failed to load news.');
            } finally {
                setLoading(false);
            }
        }
        fetchNews();
    }, [language]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Newspaper /> {language === 'kn' ? 'ಇತ್ತೀಚಿನ ಸುದ್ದಿಗಳು' : 'Recent News'}
                </CardTitle>
                <CardDescription>
                    {language === 'kn' ? 'ಕರ್ನಾಟಕದ ರೈತರಿಗೆ ಸಂಬಂಧಿಸಿದ ನವೀಕರಣಗಳು' : 'Updates relevant to farmers in Karnataka'}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading && (
                    <>
                        <Card><CardHeader><CardTitle className="h-6 w-3/4 bg-muted animate-pulse rounded-md"></CardTitle><CardDescription className="h-4 w-1/2 bg-muted animate-pulse rounded-md"></CardDescription></CardHeader><CardContent><div className="h-16 bg-muted animate-pulse rounded-md"></div></CardContent></Card>
                        <Card><CardHeader><CardTitle className="h-6 w-3/4 bg-muted animate-pulse rounded-md"></CardTitle><CardDescription className="h-4 w-1/2 bg-muted animate-pulse rounded-md"></CardDescription></CardHeader><CardContent><div className="h-16 bg-muted animate-pulse rounded-md"></div></CardContent></Card>
                        <Card><CardHeader><CardTitle className="h-6 w-3/4 bg-muted animate-pulse rounded-md"></CardTitle><CardDescription className="h-4 w-1/2 bg-muted animate-pulse rounded-md"></CardDescription></CardHeader><CardContent><div className="h-16 bg-muted animate-pulse rounded-md"></div></CardContent></Card>
                    </>
                )}
                {error && <p className="text-destructive col-span-full">{error}</p>}
                {!loading && !error && newsItems.map((item, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                            <CardDescription>{item.date}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{item.summary}</p>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
}


export default function HomePage() {
    const { language } = useLanguage();

    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <HomeIcon /> {language === 'kn' ? 'ರೈತ ಸಹಾಯಕಕ್ಕೆ ಸ್ವಾಗತ' : 'Welcome to Raitha Sahayak'}
                    </CardTitle>
                    <CardDescription>
                        {language === 'kn' ? 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆಯೊಂದಿಗೆ ಭಾರತೀಯ ರೈತರನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುವುದು' : 'Empowering Indian Farmers with Artificial Intelligence'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <p className="text-muted-foreground">
                            {language === 'kn' ? 
                                'ರೈತ ಸಹಾಯಕವು ಭಾರತದ ರೈತರಿಗೆ, ವಿಶೇಷವಾಗಿ ಕರ್ನಾಟಕದ ನಮ್ಮ ಸಹೋದರ ಸಹೋದರಿಯರಿಗೆ ಸಹಾಯ ಮಾಡಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಒಂದು ಕ್ರಾಂತಿಕಾರಿ ಅಪ್ಲಿಕೇಶನ್ ಆಗಿದೆ. ನಮ್ಮ ಗುರಿ ಆಧುನಿಕ ತಂತ್ರಜ್ಞಾನವನ್ನು ನಿಮ್ಮ ಬೆರಳ ತುದಿಗೆ ತರುವುದು, ತಜ್ಞರ ಸಲಹೆ, ಮಾರುಕಟ್ಟೆ ಒಳನೋಟಗಳು ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಮಾಹಿತಿಯನ್ನು ತಕ್ಷಣ ಒದಗಿಸುವುದು.' :
                                'Raitha Sahayak is a revolutionary app designed to assist the hardworking farmers of India, with a special focus on our brothers and sisters in Karnataka. Our mission is to bring modern technology to your fingertips, providing expert advice, market insights, and information on government schemes instantly.'
                            }
                        </p>
                    </div>

                    <Carousel className="w-full" opts={{ loop: true }}>
                        <CarouselContent>
                            {slideshowImages.map((image, index) => (
                                <CarouselItem key={index}>
                                    <div className="relative aspect-video w-full">
                                        <Image 
                                            src={image.src} 
                                            alt={image.alt[language]} 
                                            data-ai-hint={image.hint}
                                            fill
                                            priority={index === 0}
                                            className="rounded-lg object-cover"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-4" />
                        <CarouselNext className="right-4" />
                    </Carousel>
                </CardContent>
            </Card>

            <NewsSection />
        </div>
    );
}
