
import { Header } from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';

export default function ThankYouPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4">
        <Card className="w-full max-w-3xl shadow-lg">
          <CardContent className="p-8 md:p-12 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-primary">
                🌱 Thank you for your generous contribution!
              </h1>
              <p className="mt-2 text-2xl">🌱</p>
            </div>
            <div className="text-lg text-foreground/80 space-y-4 text-left">
                <p>
                Your noble act will help preserve nature, support future generations, and carry forward the sacred tradition of tree worship.
                </p>
                <p>
                You will soon receive an E-Certificate of Plantation/Adoption acknowledging your contribution. You will also receive regular updates (photos/videos) of the growth and maintenance of your adopted tree.
                </p>
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
