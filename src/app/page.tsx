import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function WelcomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <Image
        src="https://placehold.co/1920x1080.png"
        alt="A beautiful farm landscape"
        data-ai-hint="farm landscape"
        fill
        className="object-cover -z-10 brightness-[0.3]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent -z-10" />

      <Card className="w-full max-w-md border-0 bg-card/70 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-headline text-primary">
            Raita Sahayak
          </CardTitle>
          <CardDescription className="text-foreground/80">
            Your AI-powered agricultural assistant. Get expert advice, market insights, and scheme information instantly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            Access as a guest to explore the features.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full font-bold">
            <Link href="/doctor-agro">
              Enter as Guest
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
