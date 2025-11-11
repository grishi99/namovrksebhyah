import { Header } from '@/components/layout/header';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-[0.5rem] leading-tight tracking-widest mb-4 font-headline text-foreground/70">
            <p>॥ विजयते श्रीबालकृष्णः प्रभुः ॥</p>
            <p>॥ श्रीवल्लभविट्ठलेशौ विजयेते ॥</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-headline mb-2">
            Namo Vṛkṣebhyaḥ
          </h1>
          <p className="text-4xl md:text-6xl font-headline text-primary/90">
            Vṛkṣāropaṇa Mahotsava
          </p>
          <div className="my-10 flex flex-col items-center justify-center relative">
            <p className="text-2xl font-headline text-primary/90 mb-4">
              नमो वृक्षेभ्यः
            </p>
            <Image
              src="https://picsum.photos/seed/logo/200/200"
              alt="Namo Vrkshebhyah Logo"
              width={200}
              height={200}
              className="rounded-full"
              data-ai-hint="logo tree"
            />
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Link
              href="#"
              className="inline-block px-10 py-4 text-lg font-semibold rounded-full text-secondary-foreground bg-gradient-to-br from-white to-secondary shadow-lg border border-white/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-ring"
            >
              View E-brochure
            </Link>
            <Link
              href="#"
              className="inline-block px-10 py-4 text-lg font-semibold rounded-full text-secondary-foreground bg-gradient-to-br from-white to-secondary shadow-lg border border-white/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-ring"
            >
              Fill Tree Plantation and Adoption Form
            </Link>
          </div>
        </div>
      </main>
      <footer className="w-full py-6 text-center text-sm text-foreground/60">
        <p>A Geet Sangeet Sagar Trust Initiative</p>
      </footer>
    </div>
  );
}
