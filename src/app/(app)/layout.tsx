
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Home,
  Landmark,
  LineChart,
  LogOut,
  Stethoscope,
  Tractor,
  User,
  Languages,
  Recycle,
  Loader2,
  LogIn,
  UserPlus,
  LifeBuoy,
  Info,
  CloudSun,
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import mainlogo from "@/app/images/raitasahayak.jpg";

const navItems = [
  {
    href: "/doctor-agro",
    icon: Stethoscope,
    label: { en: "Doctor Agro", kn: "ಡಾಕ್ಟರ್ ಆಗ್ರೋ" },
    tooltip: { en: "Crop Health Advisor", kn: "ಬೆಳೆ ಆರೋಗ್ಯ ಸಲಹೆಗಾರ" },
  },
  {
    href: "/market-analysis",
    icon: LineChart,
    label: { en: "Market Analysis", kn: "ಮಾರುಟ್ಟೆ ವಿಶ್ಲೇಷಣೆ" },
    tooltip: { en: "Market Insights", kn: "ಮಾರುಕಟ್ಟೆ ಒಳನೋಟಗಳು" },
  },
  {
    href: "/govt-schemes",
    icon: Landmark,
    label: { en: "Govt Schemes", kn: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು" },
    tooltip: { en: "Government Schemes", kn: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು" },
  },
  {
    href: "/damaged-crop-recovery",
    icon: Recycle,
    label: { en: "Crop Recovery", kn: "ಬೆಳೆ ಚೇತರಿಕೆ" },
    tooltip: { en: "Damaged Crop Recovery & Market Finder", kn: "ಹಾನಿಗೊಳಗಾದ ಬೆಳೆ ಚೇತರಿಕೆ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಶೋಧಕ" },
  },
  {
    href: "/weather-suggestion",
    icon: CloudSun,
    label: { en: "Weather Suggestion", kn: "ಹವಾಮಾನ ಸಲಹೆ" },
    tooltip: { en: "Get weather-based crop suggestions", kn: "ಹವಾಮಾನ ಆಧಾರಿತ ಬೆಳೆ ಸಲಹೆಗಳನ್ನು ಪಡೆಯಿರಿ" },
  },
  {
    href: "/personal-assistance",
    icon: LifeBuoy,
    label: { en: "Personal Assistance", kn: "ವೈಯಕ್ತಿಕ ಸಹಾಯ" },
    tooltip: { en: "Get personal assistance", kn: "ವೈಯಕ್ತಿಕ ಸಹಾಯ ಪಡೆಯಿರಿ" },
  },
];

const secondaryNavItems = [
    {
        href: "/about",
        icon: Info,
        label: { en: "About Us", kn: "ನಮ್ಮ ಬಗ್ಗೆ" },
        tooltip: { en: "About Raitha Sahayak", kn: "ರೈತ ಸಹಾಯಕ್ ಬಗ್ಗೆ" },
    },
];

function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <Languages className="mr-2 h-5 w-5" />
                    <span>{language === 'kn' ? 'ಭಾಷೆ' : 'Language'}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value as 'en' | 'kn')}>
                    <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="kn">ಕನ್ನಡ (Kannada)</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function UserMenu() {
    const { user, loading, error, signOut } = useAuth();
    const router = useRouter();

    if (loading) {
        return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    }

    if (error) {
        console.error("Auth error:", error);
    }
    
    if (!user) {
        return (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <Avatar>
                            <AvatarFallback>G</AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Guest Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/login')}>
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>Login</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/register')}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span>Register</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User Avatar'} />
              <AvatarFallback>{(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}

function Brand() {
    const { language } = useLanguage();
     const { isMobile, setOpenMobile } = useSidebar();

    const handleLinkClick = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };
    return (
        <Link href="/home" className="flex items-center gap-2 p-2" onClick={handleLinkClick}>
            <Image
                src={mainlogo}
                alt="Raitha Sahayak Logo"
                width={32}
                height={32}
                className="rounded-full"
            />
          <h1 className="text-xl font-headline font-bold">{language === 'kn' ? 'ರೈತ ಸಹಾಯಕ' : 'Raitha Sahayak'}</h1>
        </Link>
    )
}

function AppHeader() {
  const { language } = useLanguage();
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="w-full flex-1" />
       <Button variant="ghost" asChild>
            <Link href="/home">
                <Home className="mr-2 h-5 w-5" />
                <span>{language === 'kn' ? 'ಮುಖಪುಟ' : 'Home'}</span>
            </Link>
        </Button>
       <Button variant="ghost" asChild>
            <Link href="/about">
                <Info className="mr-2 h-5 w-5" />
                <span>{language === 'kn' ? 'ನಮ್ಮ ಬಗ್ಗೆ' : 'About Us'}</span>
            </Link>
        </Button>
      <LanguageSwitcher />
      <UserMenu />
    </header>
  );
}

function AppSidebar() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Brand />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.tooltip[language], side: "right", align: "center" }}
              >
                <Link href={item.href} onClick={handleLinkClick}>
                  <item.icon />
                  <span>{item.label[language]}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
       <SidebarContent className="mt-auto flex-grow-0">
        <SidebarMenu>
          <SidebarSeparator />
          {secondaryNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.tooltip[language], side: "right", align: "center" }}
              >
                <Link href={item.href} onClick={handleLinkClick}>
                  <item.icon />
                  <span>{item.label[language]}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    React.useEffect(() => {
        // This effect handles redirection for authenticated users away from login/register
        if (!loading && user && (pathname === '/login' || pathname === '/register')) {
            router.push('/home');
        }
    }, [loading, user, pathname, router]);

    // This effect handles redirection for unauthenticated users
     React.useEffect(() => {
        if (!loading && !user && !['/login', '/register', '/home', '/about', '/personal-assistance', '/doctor-agro', '/market-analysis', '/govt-schemes', '/damaged-crop-recovery', '/weather-suggestion'].includes(pathname)) {
            router.push('/home');
        }
    }, [loading, user, pathname, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    // Unauthenticated users can access login and register pages
    if (!user && (pathname === '/login' || pathname === '/register')) {
        return <>{children}</>;
    }
    
    // All other pages are wrapped in the main layout
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-col">
                    <AppHeader />
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
                        {children}
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
