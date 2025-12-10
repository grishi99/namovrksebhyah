
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageCircle, Copy, Share2, Facebook, Instagram } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TopBar } from '@/components/layout/topbar';
import { Header } from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';

export default function ThankYouPage() {
  const { toast } = useToast();
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://namovrksebhyah.org';
  const shareMessage = `I have donated to the Namo Vrksebhyah Tree Plantation Drive 🌱 Help us reach our target of 108 trees! Join the mission and donate here: ${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareMessage);
    toast({
      title: "Link Copied",
      description: "Referral message copied to clipboard!",
    });
  };

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(shareMessage);
    toast({
      title: "Link Copied",
      description: "Open Instagram and paste this in your Story/Post!",
    });
    // Optional: Try to open instagram if installed (on mobile this might work, on web it just opens home)
    window.open('https://instagram.com', '_blank');
  };


  const handleNativeShare = async () => {
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
      handleCopyLink();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <TopBar />
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-3xl shadow-lg">
          <CardContent className="p-8 md:p-12 space-y-8">
            <div className="text-center pb-4">
              <h1 className="text-3xl font-bold text-primary">
                🌱 Thank you for your generous contribution! 🌱
              </h1>
            </div>
            <div className="text-lg text-foreground/80 space-y-4 text-left">
              <p>
                Your noble act will help preserve nature, support future generations, and carry forward the sacred tradition of tree worship.
              </p>
              <p>
                You will soon receive an E-Certificate of Plantation/Adoption acknowledging your contribution. You will also receive regular updates (photos/videos) of the growth and maintenance of your adopted tree.
              </p>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-xl font-bold text-center mb-4 text-green-800">Refer to friends</h3>
              <p className="text-center text-muted-foreground mb-6">
                Inspire others to join the mission. Share your contribution!
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                {/* WhatsApp */}
                <Button
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white"
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank')}
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                </Button>

                {/* Facebook */}
                <Button
                  className="bg-[#1877F2] hover:bg-[#166FE5] text-white"
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                >
                  <Facebook className="mr-2 h-4 w-4" /> Facebook
                </Button>

                {/* Instagram */}
                <Button
                  className="bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white border-0 hover:opacity-90"
                  onClick={handleInstagramShare}
                >
                  <Instagram className="mr-2 h-4 w-4" /> Instagram
                </Button>

                {/* Copy Link */}
                <Button variant="outline" onClick={handleCopyLink}>
                  <Copy className="mr-2 h-4 w-4" /> Copy Link
                </Button>

                {/* Native Share (Mobile) */}
                <div className="block md:hidden w-full">
                  <Button variant="secondary" className="w-full" onClick={handleNativeShare}>
                    <Share2 className="mr-2 h-4 w-4" /> Share via...
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4 text-center">
              <p className="font-semibold">With gratitude,</p>
              <p className="font-bold text-primary mt-1">Geet Sangeet Sagar Trust</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
