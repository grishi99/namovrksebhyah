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
          <div className="text-[8px] leading-tight tracking-widest mb-4 font-headline text-primary/80">
            <p>॥ विजयते श्रीबालकृष्णः प्रभुः ॥</p>
            <p>॥ श्रीवल्लभविट्ठलेशौ विजयेते ॥</p>
          </div>
          <h1 className="text-4xl md:text-6xl font-headline mb-2 text-primary">
             <b>Namo</b> <b>Vṛkṣebhyaḥ</b>
          </h1>
          <h2 className="text-3xl md:text-5xl font-semibold font-headline text-primary/80">
            Vṛkṣāropaṇa Mahotsava
          </h2>
          <div className="my-10 flex flex-col items-center justify-center relative">
            <Logo />
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Link
              href="#"
              className="px-10 py-5 bg-gradient-to-br from-white to-blue-200 text-blue-900 font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all text-lg border border-blue-300"
            >
              View E-brochure
            </Link>
            <Link
              href="/tree-form"
              className="px-10 py-5 bg-gradient-to-br from-white to-blue-200 text-blue-900 font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all text-lg border border-blue-300"
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
