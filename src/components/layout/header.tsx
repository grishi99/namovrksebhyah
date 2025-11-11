"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Sprout } from "lucide-react";
import Link from "next/link";

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
              <Sprout className="h-6 w-6 text-primary" />
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
