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
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            fill="hsl(var(--card))"
          />

          <g transform="translate(5, 5) scale(0.9)">
            <path
              d="M45 40 C 40 40, 35 45, 35 50 L 35 70 C 35 75, 40 80, 45 80 L 45 40 Z"
              fill="#d2a679"
            />
            <path
              d="M45 40 C 50 40, 55 45, 55 50 L 55 70 C 55 75, 50 80, 45 80 L 45 40 Z"
              fill="#c69c6d"
              transform="scale(-1, 1) translate(-90, 0)"
            />
            <path
              d="M45 40 L 45 30 C 45 20, 50 15, 60 15 M45 40 C 40 40, 30 35, 30 30 C 30 25, 35 20, 40 20 M45 40 L 45 80 M45 80 C 40 80, 30 85, 25 90 M45 80 C 50 80, 60 85, 65 90"
              stroke="#8B4513"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />

            <circle cx="60" cy="15" r="5" fill="#228B22" />
            <circle cx="70" cy="25" r="6" fill="#228B22" />
            <circle cx="55" cy="25" r="4" fill="#32CD32" />
            <circle cx="40" cy="20" r="5" fill="#32CD32" />
            <circle cx="28" cy="30" r="6" fill="#228B22" />
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
