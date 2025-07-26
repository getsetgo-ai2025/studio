"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "@/components/ui/sidebar";
import {
  Landmark,
  LineChart,
  LogOut,
  Stethoscope,
  Tractor,
  User,
  Languages,
} from "lucide-react";
import { LanguageProvider, useLanguage } from "@/hooks/use-language";


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
    label: { en: "Market Analysis", kn: "ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಣೆ" },
    tooltip: { en: "Market Insights", kn: "ಮಾರುಕಟ್ಟೆ ಒಳನೋಟಗಳು" },
  },
  {
    href: "/govt-schemes",
    icon: Landmark,
    label: { en: "Govt Schemes", kn: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು" },
    tooltip: { en: "Government Schemes", kn: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು" },
  },
];

function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Languages className="h-5 w-5" />
                    <span className="sr-only">Change language</span>
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
    )
}

function AppHeader() {
  const { isMobile } = useSidebar();
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="w-full flex-1" />
      <LanguageSwitcher />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="farmer avatar" />
              <AvatarFallback>U</AvatarFallback>
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
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

function AppSidebar() {
  const pathname = usePathname();
  const { language } = useLanguage();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Tractor className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-headline font-bold">{language === 'kn' ? 'ರೈತ ಸಹಾಯಕ' : 'Raita Sahayak'}</h1>
        </div>
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
                <Link href={item.href}>
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

function AppLayoutContent({ children }: { children: React.ReactNode }) {
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
    )
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
        <AppLayoutContent>{children}</AppLayoutContent>
    </LanguageProvider>
  );
}
