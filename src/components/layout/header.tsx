"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Share2, BarChart2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser, useAuth } from "@/firebase";
import { Separator } from "@/components/ui/separator";
import { signOut } from "firebase/auth";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { logShareEvent } from "@/lib/analytics";

const HeaderLogo = () => (
  <div className="relative w-10 h-10" data-ai-hint="logo tree">
    <Image
      src="/icon.png?v=2"
      alt="Namo Vrkshebhyah Logo"
      width={40}
      height={40}
      priority
    />
  </div>
);


export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const pathname = usePathname();
  const isAdmin = user?.email === 'grishi99@gmail.com';
  const { toast } = useToast();

  const handleShare = async () => {
    // Log intent immediately
    logShareEvent({
      platform: 'native_share', // Generalized as 'native_share' for the header button since it triggers native or copy
      location: 'header',
      userId: user?.uid,
      userEmail: user?.email || undefined
    });

    const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://namovrksebhyah.org';
    const shareMessage = `I have donated to the Namo Vrksebhyah Tree Plantation Drive 🌱 Help us reach our target of 108 trees! Join the mission and donate here: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Namo Vrksebhyah Tree Plantation',
          text: shareMessage,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareMessage);
      toast({
        title: "Link Copied",
        description: "Referral message copied to clipboard!",
      });
    }
  };

  return (
    <header className="absolute top-4 right-4 md:top-6 md:right-6 z-50">
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
            {pathname !== '/' && (
              <Link href="/" className="text-lg font-medium text-foreground hover:text-primary hover:underline underline-offset-4 transition-colors">
                Home
              </Link>
            )}
            <Link href="/about" className="text-lg font-medium text-foreground hover:text-primary hover:underline underline-offset-4 transition-colors">
              About
            </Link>
            <Link href="/#contact" className="text-lg font-medium text-foreground hover:text-primary hover:underline underline-offset-4 transition-colors">
              Contact
            </Link>

            <div
              onClick={handleShare}
              className="text-lg font-medium text-foreground hover:text-primary hover:underline underline-offset-4 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" /> Share
            </div>

            <Separator className="my-2" />
            {isAdmin && (
              <>
                <Link href="/admin" className="text-lg font-medium text-primary hover:underline underline-offset-4 transition-colors">
                  Admin Dashboard
                </Link>
                <Link href="/admin/stats" className="text-lg font-medium text-primary hover:underline underline-offset-4 transition-colors flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" /> Stats
                </Link>
              </>
            )}
            {!isUserLoading && !user && (
              <>
                <Link href="/signup" className="text-lg font-medium text-foreground hover:text-primary hover:underline underline-offset-4 transition-colors">
                  Sign Up
                </Link>
                <Link href="/login" className="text-lg font-medium text-foreground hover:text-primary hover:underline underline-offset-4 transition-colors">
                  Log In
                </Link>
              </>
            )}
            {!isUserLoading && user && (
              <Link href="#" onClick={() => signOut(auth)} className="text-lg font-medium text-foreground hover:text-primary hover:underline underline-offset-4 transition-colors">
                Log Out
              </Link>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
