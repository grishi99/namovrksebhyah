"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";

const HeaderLogo = () => (
  <div className="relative w-10 h-10" data-ai-hint="logo tree">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-10 h-10">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="48" stroke="#A52A2A" strokeWidth="3" fill="none" />
          <g transform="translate(10, 10) scale(0.8)">
            {/* Roots */}
            <path d="M 40,75 C 30,85 20,80 15,90" stroke="#8B4513" strokeWidth="2" fill="none" />
            <path d="M 60,75 C 70,85 80,80 85,90" stroke="#8B4513" strokeWidth="2" fill="none" />
            <path d="M 50,78 C 50,90 45,95 40,98" stroke="#8B4513" strokeWidth="2" fill="none" />
            <path d="M 50,78 C 50,90 55,95 60,98" stroke="#8B4513" strokeWidth="2" fill="none" />

            {/* Praying Hands as trunk */}
            <path d="M 45,75 C 45,65 40,60 50,50 C 60,60 55,65 55,75 Z" fill="#DEB887" />
            <path d="M 46,75 C 46,68 42,65 50,55 C 58,65 54,68 54,75" fill="none" stroke="#A0522D" strokeWidth="1.5" />

            {/* Crown of the tree */}
            <circle cx="50" cy="40" r="15" fill="#228B22" />
            <circle cx="40" cy="35" r="12" fill="#32CD32" />
            <circle cx="60" cy="35" r="12" fill="#32CD32" />
            <circle cx="35" cy="45" r="10" fill="#2E8B57" />
            <circle cx="65" cy="45" r="10" fill="#2E8B57" />
            <circle cx="50" cy="30" r="8" fill="#90EE90" />
          </g>
        </svg>
      </div>
    </div>
  </div>
);


export function Header() {
  return (
    <header className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full shadow-md bg-background/80 backdrop-blur-sm">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="text-left">
            <SheetTitle className="flex items-center gap-2">
            <HeaderLogo />
              Namo Vṛkṣebhyaḥ
            </SheetTitle>
            <SheetDescription>
              Geet Sangeet Sagar Trust
            </SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col space-y-2 mt-8">
            <Link href="#about" className="text-lg font-medium text-foreground hover:text-primary hover:underline underline-offset-4 transition-colors">
              About
            </Link>
            <Link href="#contact" className="text-lg font-medium text-foreground hover:text-primary hover:underline underline-offset-4 transition-colors">
              Contact
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
