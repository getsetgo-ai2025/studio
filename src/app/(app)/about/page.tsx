import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ExternalLink } from "lucide-react";
import packageJson from '../../../../package.json';
import Link from "next/link";

export default function AboutPage() {
    const appVersion = packageJson.version;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Info /> About Raita Sahayak (ರೈತ ಸಹಾಯಕ)
                    </CardTitle>
                    <CardDescription>
                        Empowering farmers with AI-powered assistance.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-muted-foreground">
                    <div className="space-y-2">
                        <h2 className="font-semibold text-lg text-primary">Our Mission</h2>
                        <p>
                            Raita Sahayak aims to bridge the technology gap for farmers by providing an intuitive, accessible, and powerful tool right at their fingertips. We leverage cutting-edge generative AI to offer instant advice on crop health, provide up-to-date market analysis, and help navigate complex government schemes. Our goal is to empower every farmer to make informed decisions, increase productivity, and improve their livelihood.
                        </p>
                    </div>
                     <div className="space-y-2">
                        <h2 className="font-semibold text-lg text-primary">App Version</h2>
                        <p>
                            You are currently using version {appVersion}.
                        </p>
                    </div>
                     <div className="space-y-2">
                        <h2 className="font-semibold text-lg text-primary">Resources</h2>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#" className="flex items-center gap-2 text-accent-foreground hover:underline">
                                    Privacy Policy <ExternalLink className="h-4 w-4" />
                                </Link>
                            </li>
                             <li>
                                <Link href="#" className="flex items-center gap-2 text-accent-foreground hover:underline">
                                    Terms of Service <ExternalLink className="h-4 w-4" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                     <div className="space-y-2">
                        <h2 className="font-semibold text-lg text-primary">Developed By</h2>
                        <p>
                           This application was built using Firebase Studio.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
