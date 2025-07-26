
"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Newspaper, Home as HomeIcon, Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { getRecentNews, type NewsArticle } from "@/ai/flows/news-generator";
import { useEffect, useState } from "react";

const slideshowImages = [
    { src: "https://images.unsplash.com/photo-1627920769363-a0153351996c?q=80&w=1920&auto=format&fit=crop", alt: { en: "Farmer using a drone", kn: "ಡ್ರೋನ್ ಬಳಸುತ್ತಿರುವ ರೈತ" }, hint: "drone agriculture" },
    { src: "https://images.unsplash.com/photo-1599387600789-12346908355a?q=80&w=1920&auto=format&fit=crop", alt: { en: "Smart farm with sensors", kn: "ಸಂವೇದಕಗಳೊಂದಿಗೆ ಸ್ಮಾರ್ಟ್ ಫಾರ್ಮ್" }, hint: "smart farm" },
    { src: "https://images.unsplash.com/photo-1591784465425-43a91a19b58a?q=80&w=1920&auto=format&fit=crop", alt: { en: "Automated irrigation system", kn: "ಸ್ವಯಂಚಾಲಿತ ನೀರಾವರಿ ವ್ಯವಸ್ಥೆ" }, hint: "irrigation system" },
    { src: "https://images.unsplash.com/photo-1563201515-68095b578533?q=80&w=1920&auto=format&fit=crop", alt: { en: "Farmer with a tablet", kn: "ಟ್ಯಾಬ್ಲೆಟ್ ಹಿಡಿದ ರೈತ" }, hint: "farmer tablet" },
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
                        <HomeIcon /> {language === 'kn' ? 'ರೈತ ಸಹಾಯಕಕ್ಕೆ ಸ್ವಾಗತ' : 'Welcome to Raita Sahayak'}
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
                                'Raita Sahayak is a revolutionary app designed to assist the hardworking farmers of India, with a special focus on our brothers and sisters in Karnataka. Our mission is to bring modern technology to your fingertips, providing expert advice, market insights, and information on government schemes instantly.'
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
