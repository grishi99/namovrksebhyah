import { Header } from '@/components/layout/header';
import Link from 'next/link';
import Image from 'next/image';

const Logo = () => (
  <div className="relative w-64 h-64 flex flex-col items-center justify-center">
    <div className="relative w-[180px] h-[180px]" data-ai-hint="logo tree">
        <Image 
            src="/icon.png?v=2"
            alt="Namo Vrkshebhyah Logo"
            width={180}
            height={180}
        />
    </div>
  </div>
);


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-[8px] leading-tight tracking-widest mb-4 font-headline text-foreground/70">
            <p>॥ विजयते श्रीबालकृष्णः प्रभुः ॥</p>
            <p>॥ श्रीवल्लभविट्ठलेशौ विजयेते ॥</p>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold font-headline mb-4">
             Namo <span className="font-normal">Vṛkṣebhyaḥ</span>
          </h1>
          <p className="text-4xl md:text-5xl font-headline text-primary/80">
            Vṛkṣāropaṇa Mahotsava
          </p>
          <div className="my-10 flex flex-col items-center justify-center relative">
            <Logo />
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Link
              href="#"
              className="inline-block px-8 py-3 text-lg font-semibold rounded-full text-white bg-gradient-to-br from-blue-300 to-green-200 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.2)] transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-blue-300"
              style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                color: 'hsl(var(--primary-foreground))',
                background: 'linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--background)) 100%)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1), inset 0 1px 3px rgba(255,255,255,0.5), inset 0 -1px 2px rgba(0,0,0,0.1)'
              }}
            >
              View E-brochure
            </Link>
            <Link
              href="#"
              className="inline-block px-10 py-4 text-xl font-bold rounded-full text-white bg-gradient-to-br from-blue-400 to-green-300 shadow-[0_15px_25px_-10px_rgba(0,0,0,0.3)] transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-blue-400"
               style={{
                textShadow: '0 1px 3px rgba(0,0,0,0.25)',
                color: 'hsl(var(--primary-foreground))',
                background: 'linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--primary)) 100%)',
                boxShadow: '0 8px 15px rgba(0,0,0,0.2), inset 0 1px 3px rgba(255,255,255,0.6), inset 0 -1px 4px rgba(0,0,0,0.2)'
              }}
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
