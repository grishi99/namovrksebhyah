import { Header } from '@/components/layout/header';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, Camera, TreeDeciduous, ChevronRight } from 'lucide-react';

import { Slideshow } from '@/components/home/slideshow';

const Logo = () => (
  <div className="relative w-64 h-64 flex flex-col items-center justify-center">
    <div className="relative w-[180px] h-[180px]" data-ai-hint="logo tree">
      <Image
        src="/icon.png?v=2"
        alt="Namo Vrkshebhyah Logo"
        width={180}
        height={180}
        priority
      />
    </div>
  </div>
);


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-8">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-[8px] leading-tight tracking-widest mb-4 font-headline text-primary/80">
            <p>॥ विजयते श्रीबालकृष्णः प्रभुः ॥</p>
            <p>॥ श्रीवल्लभविट्ठलेशौ विजयेते ॥</p>
          </div>
          <h1 className="text-4xl md:text-6xl font-headline mb-2 text-primary">
            <b>Namo</b> <b>Vṛkṣebhyaḥ</b>
          </h1>
          <h2 className="text-3xl md:text-5xl font-semibold font-headline text-primary/80">
            Vṛkṣāropaṇa Mahotsava 2.0
          </h2>
          <div className="my-10 flex flex-col items-center justify-center relative">
            <Logo />
            <div className="mt-8 w-full max-w-sm">
              <Slideshow />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto w-full">
            <Link
              href="/e-brochure"
              className="group flex items-center justify-between px-8 py-4 bg-white/40 backdrop-blur-md border border-primary/20 text-primary-foreground font-bold rounded-2xl shadow-lg hover:shadow-xl hover:bg-primary hover:text-white transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-white/20 transition-colors">
                  <FileText className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <span className="text-xl text-foreground group-hover:text-white">E-brochure</span>
              </div>
              <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
            </Link>

            <Link
              href="/event-pics"
              className="group flex items-center justify-between px-8 py-4 bg-white/40 backdrop-blur-md border border-primary/20 text-primary-foreground font-bold rounded-2xl shadow-lg hover:shadow-xl hover:bg-primary hover:text-white transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-white/20 transition-colors">
                  <Camera className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <span className="text-xl text-foreground group-hover:text-white">Event Moments</span>
              </div>
              <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
            </Link>

            <Link
              href="/tree-form"
              className="group flex items-center justify-between px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:bg-primary/90 transform hover:-translate-y-1 transition-all duration-300 border border-primary/20"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-xl">
                  <TreeDeciduous className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="text-xl block">Plant & Adopt a Tree</span>
                  <span className="text-xs font-normal opacity-80">Join the Mahotsava 2.0 initiative</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
